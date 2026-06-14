/**
 * Metni cümlelere bölen saf (yan etkisiz) yardımcı fonksiyon.
 *
 * Kurallar:
 * - Cümle sonu: `.` `!` `?` `…` karakterinden sonra boşluk (ya da metin sonu) gelmesi.
 * - Ondalık sayılar bölünmez (örn. `3.14`) — nokta rakamlar arasındaysa boşluk gelmez,
 *   dolayısıyla doğal olarak korunur.
 * - Türkçe kısaltmalar bölünmez (örn. `Dr.`, `Av.`, `vb.`, `Prof.`).
 * - Tek harfli baş harfler bölünmez (örn. `M. Ali`).
 * - Satır sonları (`\n`) de cümle sınırı sayılır; böylece sayfadan alınan
 *   blok metinler tek dev cümle hâline gelmez.
 *
 * Test edilebilirlik için bilinçli olarak React/DOM'dan bağımsız tutulmuştur.
 */

// Sonuna nokta gelen ve cümle bitişi saymamamız gereken yaygın Türkçe kısaltmalar.
const TR_ABBREVIATIONS = new Set([
  "dr",
  "av",
  "vb",
  "vs",
  "vd",
  "prof",
  "doç",
  "yrd",
  "öğr",
  "gör",
  "uzm",
  "müh",
  "no",
  "nu",
  "sok",
  "sk",
  "cad",
  "mah",
  "apt",
  "bkz",
  "örn",
  "ör",
  "tel",
  "hz",
  "sn",
  "bn",
  "age",
  "agm",
  "çev",
  "haz",
  "yy",
  "mö",
  "ms",
  "alb",
  "gen",
  "yzb",
  "tğm",
]);

const SENTENCE_ENDINGS = new Set([".", "!", "?", "…"]);

function isWhitespace(char: string | undefined): boolean {
  return char !== undefined && /\s/.test(char);
}

export function splitSentences(input: string): string[] {
  if (!input) return [];
  const text = input.replace(/\r\n?/g, "\n");

  const sentences: string[] = [];
  let current = "";

  const flush = () => {
    const trimmed = current.trim();
    if (trimmed) sentences.push(trimmed);
    current = "";
  };

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    // Satır sonu: yumuşak cümle sınırı.
    if (char === "\n") {
      flush();
      continue;
    }

    current += char;

    if (!SENTENCE_ENDINGS.has(char)) continue;

    const next = text[i + 1];

    // Cümle sonu yalnızca boşluk veya metin sonu ile geçerli.
    // (Bu kural `3.14` gibi ondalıkları kendiliğinden korur.)
    if (!isWhitespace(next) && next !== undefined) continue;

    if (char === ".") {
      // Noktadan önceki son kelimeyi al (kısaltma/baş harf kontrolü için).
      const lastWord = current.slice(0, -1).split(/[\s(«"'[]/).pop() ?? "";
      const normalized = lastWord
        .toLocaleLowerCase("tr")
        .replace(/[^a-zçğıöşü]/g, "");

      if (normalized && TR_ABBREVIATIONS.has(normalized)) continue;

      // Tek harfli baş harf: "M.", "A." gibi.
      if (/^\p{Lu}$/u.test(lastWord)) continue;
    }

    flush();
  }

  flush();

  return sentences;
}
