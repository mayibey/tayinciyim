"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/Button";
import { splitSentences } from "@/lib/reader/splitSentences";

type Status = "idle" | "playing" | "paused";

const RATE_MIN = 0.6;
const RATE_MAX = 1.6;
const RATE_DEFAULT = 1.0;
const PITCH_MIN = 0.5;
const PITCH_MAX = 1.8;
const PITCH_DEFAULT = 1.0;

// Adında bu sözcükler geçen Türkçe sesler "daha doğal" kabul edilip öne alınır.
// Liste başı = en yüksek öncelik.
const VOICE_PRIORITY = [
  "natural",
  "doğal",
  "online",
  "çevrimiçi",
  "neural",
  "google",
];

function isTurkish(voice: SpeechSynthesisVoice): boolean {
  return (voice.lang ?? "").toLowerCase().startsWith("tr");
}

function scoreVoice(voice: SpeechSynthesisVoice): number {
  const name = voice.name.toLowerCase();
  let score = 0;
  VOICE_PRIORITY.forEach((keyword, index) => {
    if (name.includes(keyword)) score += VOICE_PRIORITY.length - index;
  });
  return score;
}

function pickBestTurkishVoice(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | null {
  const turkish = voices.filter(isTurkish);
  if (!turkish.length) return null;
  return [...turkish].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0];
}

function grabMainText(): string {
  if (typeof document === "undefined") return "";
  const main = document.querySelector("main");
  if (!main) return "";
  const clone = main.cloneNode(true) as HTMLElement;
  clone
    .querySelectorAll("script, style, nav, button, svg, [aria-hidden='true']")
    .forEach((node) => node.remove());
  const raw = clone.textContent ?? "";
  return raw
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function SesliOkuReader() {
  const [supported, setSupported] = useState(true);
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState("");
  const [rate, setRate] = useState(RATE_DEFAULT);
  const [pitch, setPitch] = useState(PITCH_DEFAULT);
  const [status, setStatus] = useState<Status>("idle");
  const [currentIndex, setCurrentIndex] = useState(-1);

  const sentences = useMemo(() => splitSentences(text), [text]);

  // Asenkron callback'lerin (onend) en güncel değerleri okuyabilmesi için ref'ler.
  const sentencesRef = useRef(sentences);
  const voicesRef = useRef(voices);
  const selectedVoiceRef = useRef(selectedVoiceURI);
  const rateRef = useRef(rate);
  const pitchRef = useRef(pitch);
  const statusRef = useRef(status);
  const currentIndexRef = useRef(currentIndex);
  // Her seslendirme isteğine bir jeton verilir; iptal/yeniden başlatma sonrası
  // gelen "bayat" onend/onerror olaylarını ayıklamak için kullanılır.
  const runTokenRef = useRef(0);

  useEffect(() => {
    sentencesRef.current = sentences;
  }, [sentences]);
  useEffect(() => {
    voicesRef.current = voices;
  }, [voices]);
  useEffect(() => {
    selectedVoiceRef.current = selectedVoiceURI;
  }, [selectedVoiceURI]);
  useEffect(() => {
    rateRef.current = rate;
  }, [rate]);
  useEffect(() => {
    pitchRef.current = pitch;
  }, [pitch]);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Sesleri yükle: onvoiceschanged + setTimeout fallback (sesler async gelir).
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    const synth = window.speechSynthesis;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const loadVoices = () => {
      const list = synth.getVoices();
      if (list.length) setVoices(list);
    };

    loadVoices();
    synth.addEventListener?.("voiceschanged", loadVoices);
    timeouts.push(setTimeout(loadVoices, 250));
    timeouts.push(setTimeout(loadVoices, 1000));

    return () => {
      timeouts.forEach(clearTimeout);
      synth.removeEventListener?.("voiceschanged", loadVoices);
      synth.cancel();
    };
  }, []);

  // İlk Türkçe ses geldiğinde en iyisini otomatik seç.
  useEffect(() => {
    if (!voices.length || selectedVoiceURI) return;
    const best = pickBestTurkishVoice(voices);
    if (best) setSelectedVoiceURI(best.voiceURI);
  }, [voices, selectedVoiceURI]);

  const turkishVoices = useMemo(
    () => voices.filter(isTurkish).sort((a, b) => scoreVoice(b) - scoreVoice(a)),
    [voices],
  );
  const hasTurkishVoice = turkishVoices.length > 0;

  // Belirli bir cümleyi seslendir; bitince zincirleme bir sonrakine geç.
  const speakIndex = useCallback((index: number) => {
    const synth = window.speechSynthesis;
    const list = sentencesRef.current;
    if (index < 0 || index >= list.length) {
      setStatus("idle");
      setCurrentIndex(-1);
      return;
    }

    const token = ++runTokenRef.current;
    const utterance = new SpeechSynthesisUtterance(list[index]);
    utterance.lang = "tr-TR";
    const voice = voicesRef.current.find(
      (item) => item.voiceURI === selectedVoiceRef.current,
    );
    if (voice) utterance.voice = voice;
    utterance.rate = rateRef.current;
    utterance.pitch = pitchRef.current;

    utterance.onend = () => {
      if (token !== runTokenRef.current) return; // bayat olay
      const next = index + 1;
      if (next < sentencesRef.current.length) {
        speakIndex(next);
      } else {
        setStatus("idle");
        setCurrentIndex(-1);
      }
    };
    utterance.onerror = () => {
      if (token !== runTokenRef.current) return; // iptal kaynaklı, yok say
      setStatus("idle");
      setCurrentIndex(-1);
    };

    setCurrentIndex(index);
    setStatus("playing");
    synth.speak(utterance);
  }, []);

  const startReading = useCallback(
    (index: number) => {
      if (typeof window === "undefined") return;
      runTokenRef.current++; // mevcut zinciri geçersiz kıl
      window.speechSynthesis.cancel();
      speakIndex(index);
    },
    [speakIndex],
  );

  const stop = useCallback(() => {
    if (typeof window === "undefined") return;
    runTokenRef.current++;
    window.speechSynthesis.cancel();
    setStatus("idle");
    setCurrentIndex(-1);
  }, []);

  const play = useCallback(() => {
    if (!sentencesRef.current.length) return;
    if (statusRef.current === "paused") {
      window.speechSynthesis.resume();
      setStatus("playing");
      return;
    }
    const start = currentIndexRef.current >= 0 ? currentIndexRef.current : 0;
    startReading(start);
  }, [startReading]);

  const pause = useCallback(() => {
    if (statusRef.current !== "playing") return;
    window.speechSynthesis.pause();
    setStatus("paused");
  }, []);

  // Hız/ton değişince: çalan cümleyi yeni değerle yeniden başlat.
  const handleRateChange = useCallback(
    (value: number) => {
      setRate(value);
      rateRef.current = value;
      if (statusRef.current === "playing" && currentIndexRef.current >= 0) {
        startReading(currentIndexRef.current);
      }
    },
    [startReading],
  );

  const handlePitchChange = useCallback(
    (value: number) => {
      setPitch(value);
      pitchRef.current = value;
      if (statusRef.current === "playing" && currentIndexRef.current >= 0) {
        startReading(currentIndexRef.current);
      }
    },
    [startReading],
  );

  const handleTextChange = (value: string) => {
    if (statusRef.current !== "idle") stop();
    setText(value);
    setCurrentIndex(-1);
  };

  const handleGrabPage = () => {
    if (statusRef.current !== "idle") stop();
    const pageText = grabMainText();
    setText(pageText);
    setCurrentIndex(-1);
  };

  // Bileşen kapanınca (modal unmount) okumayı kes.
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Esc: okuma sürerken önce okumayı durdur (modalı kapatma).
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && statusRef.current !== "idle") {
      event.stopPropagation();
      stop();
    }
  };

  if (!supported) {
    return (
      <p className="rounded-2xl bg-accent-soft p-4 text-sm text-navy-800">
        Tarayıcınız sesli okuma (Web Speech API) özelliğini desteklemiyor. Lütfen
        güncel bir Chrome veya Edge tarayıcısı deneyin.
      </p>
    );
  }

  const liveMessage =
    status === "playing" && currentIndex >= 0
      ? `${currentIndex + 1} / ${sentences.length}. cümle okunuyor.`
      : status === "paused"
        ? "Okuma duraklatıldı."
        : "";

  return (
    <div onKeyDown={handleKeyDown} className="flex flex-col gap-5">
      {/* Erişilebilirlik: durum duyurusu */}
      <p aria-live="polite" className="sr-only">
        {liveMessage}
      </p>

      {/* Metin girişi */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="sesli-oku-metin"
            className="text-sm font-semibold text-navy-900"
          >
            Okunacak metin
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGrabPage}
          >
            Bu sayfadaki metni al
          </Button>
        </div>
        <textarea
          id="sesli-oku-metin"
          value={text}
          onChange={(event) => handleTextChange(event.target.value)}
          rows={4}
          placeholder="Metni buraya yapıştırın ya da yazın…"
          className="w-full resize-y rounded-2xl border border-[var(--border)] bg-cream-50 p-3 text-sm text-navy-900 outline-none transition-smooth placeholder:text-muted focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40"
        />
      </div>

      {/* Ses seçimi */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="sesli-oku-ses"
          className="text-sm font-semibold text-navy-900"
        >
          Ses
        </label>
        <select
          id="sesli-oku-ses"
          value={selectedVoiceURI}
          onChange={(event) => setSelectedVoiceURI(event.target.value)}
          disabled={!hasTurkishVoice}
          className="w-full rounded-2xl border border-[var(--border)] bg-card p-2.5 text-sm text-navy-900 outline-none transition-smooth focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-50"
        >
          {hasTurkishVoice ? (
            turkishVoices.map((voice) => (
              <option key={voice.voiceURI} value={voice.voiceURI}>
                {voice.name} ({voice.lang})
              </option>
            ))
          ) : (
            <option value="">Türkçe ses bulunamadı</option>
          )}
        </select>
        {!hasTurkishVoice && (
          <p
            role="alert"
            className="rounded-xl bg-accent-soft px-3 py-2 text-xs text-navy-800"
          >
            Tarayıcınızda Türkçe ses bulunamadı. Sistem varsayılan sesiyle
            okunacaktır; daha doğal sonuç için Edge tarayıcısını deneyin.
          </p>
        )}
      </div>

      {/* Kaydırıcılar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="sesli-oku-hiz"
            className="flex items-center justify-between text-sm font-semibold text-navy-900"
          >
            <span>Hız</span>
            <span className="font-mono text-xs text-muted">
              {rate.toFixed(1)}×
            </span>
          </label>
          <input
            id="sesli-oku-hiz"
            type="range"
            min={RATE_MIN}
            max={RATE_MAX}
            step={0.1}
            value={rate}
            onChange={(event) =>
              handleRateChange(Number(event.target.value))
            }
            className="w-full accent-accent"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="sesli-oku-ton"
            className="flex items-center justify-between text-sm font-semibold text-navy-900"
          >
            <span>Ton</span>
            <span className="font-mono text-xs text-muted">
              {pitch.toFixed(1)}
            </span>
          </label>
          <input
            id="sesli-oku-ton"
            type="range"
            min={PITCH_MIN}
            max={PITCH_MAX}
            step={0.1}
            value={pitch}
            onChange={(event) =>
              handlePitchChange(Number(event.target.value))
            }
            className="w-full accent-accent"
          />
        </div>
      </div>

      {/* Kontroller */}
      <div className="flex flex-wrap items-center gap-2">
        {status === "playing" ? (
          <Button type="button" variant="primary" onClick={pause}>
            ⏸ Duraklat
          </Button>
        ) : (
          <Button
            type="button"
            variant="primary"
            onClick={play}
            disabled={!sentences.length}
          >
            {status === "paused" ? "▶ Devam" : "▶ Oku"}
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={stop}
          disabled={status === "idle"}
        >
          ⏹ Durdur
        </Button>
      </div>

      {/* Cümle listesi (highlight + tıkla-başlat) */}
      {sentences.length > 0 && (
        <div className="flex flex-col gap-1 rounded-2xl border border-[var(--border)] bg-cream-50 p-3">
          <p className="px-1 pb-1 text-xs font-medium text-muted">
            Bir cümleye tıklayarak okumayı oradan başlatabilirsiniz.
          </p>
          {sentences.map((sentence, index) => {
            const active = index === currentIndex;
            return (
              <button
                key={`${index}-${sentence.slice(0, 12)}`}
                type="button"
                onClick={() => startReading(index)}
                aria-current={active ? "true" : undefined}
                className={`rounded-xl px-3 py-2 text-left text-sm leading-relaxed transition-smooth outline-none focus-visible:ring-2 focus-visible:ring-accent/50 motion-reduce:transition-none ${
                  active
                    ? "bg-accent-soft font-medium text-navy-900 ring-1 ring-accent"
                    : "text-navy-800 hover:bg-cream-100"
                }`}
              >
                {sentence}
              </button>
            );
          })}
        </div>
      )}

      {/* İpucu */}
      <p className="border-t border-[var(--border)] pt-3 text-xs leading-relaxed text-muted">
        En doğal ses için Edge&apos;de &quot;Microsoft Emel / Ahmet (Çevrimiçi ·
        Doğal)&quot; Türkçe seslerini seçin; Chrome&apos;da &quot;Google
        Türkçe&quot; iyidir.
      </p>
    </div>
  );
}
