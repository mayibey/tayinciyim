import { getEnvValidationSummary } from "@/lib/env/validation";
import { isCaptchaConfigured } from "@/lib/security/captcha";

export function ProductionChecklist() {
  const env = getEnvValidationSummary();

  const extra = [
    {
      label: "CAPTCHA (opsiyonel)",
      status: isCaptchaConfigured() ? ("ok" as const) : ("warn" as const),
      hint: isCaptchaConfigured() ? "Anahtarlar tanımlı" : "Demo pass — anahtar yok",
    },
    {
      label: "Beta yayına hazır",
      status: env.readyForBeta ? ("ok" as const) : ("missing" as const),
      hint: env.readyForBeta
        ? "Temel env tamam"
        : "Eksik env — /sistem-durumu sayfasına bakın",
    },
  ];

  const allItems = [...env.checks, ...extra];

  return (
    <div className="card-surface-lg mb-8 p-6">
      <h2 className="text-lg font-bold text-navy-900">Yayın kontrol listesi</h2>
      <p className="mt-1 text-sm text-muted">
        Mod: <strong>{env.mode === "supabase" ? "Supabase" : "Mock"}</strong> · Ortam:{" "}
        <strong>{env.nodeEnv}</strong> —{" "}
        <a href="/sistem-durumu" className="text-accent hover:underline">
          /sistem-durumu
        </a>
      </p>
      <ul className="mt-4 space-y-2">
        {allItems.map((item) => (
          <li
            key={item.label}
            className="flex items-start justify-between gap-3 rounded-xl bg-cream-50 px-3 py-2 text-sm"
          >
            <div>
              <span className="font-medium text-navy-900">{item.label}</span>
              <p className="text-xs text-muted">{item.hint}</p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
                item.status === "warn"
                  ? "bg-amber-100 text-amber-900"
                  : item.status === "ok"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {item.status === "warn" ? "Uyarı" : item.status === "ok" ? "Tamam" : "Eksik"}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">
        Storage: listing-images, avatars — Supabase panelden doğrulayın. Service role istemciye
        eklenmemeli.
      </p>
    </div>
  );
}
