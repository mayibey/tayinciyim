import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getSystemHealthReport } from "@/lib/system/health";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Sistem durumu",
  description: "tayinciyim.com beta yayın kontrolü — yapılandırma özeti (gizli anahtarlar gösterilmez).",
  path: "/sistem-durumu",
  noIndex: true,
});

function StatusBadge({ ok, warn }: { ok: boolean; warn?: boolean }) {
  const cls = warn
    ? "bg-amber-100 text-amber-900"
    : ok
      ? "bg-emerald-100 text-emerald-800"
      : "bg-red-100 text-red-800";
  const label = warn ? "Uyarı" : ok ? "Tamam" : "Eksik";
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${cls}`}>{label}</span>
  );
}

export default async function SistemDurumuPage() {
  const health = await getSystemHealthReport();
  const { summary } = health;

  const statusLabel =
    health.status === "healthy"
      ? "Çalışıyor"
      : health.status === "degraded"
        ? "Kısıtlı"
        : "Demo (mock)";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">Beta kontrol</p>
      <h1 className="mt-2 text-2xl font-bold text-navy-900 sm:text-3xl">Sistem durumu</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Deploy sonrası hızlı kontrol. Gizli anahtarlar veya tam env değerleri burada gösterilmez.
      </p>

      <div className="card-surface-lg mt-8 space-y-4 p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="font-semibold text-navy-900">Uygulama</span>
          <StatusBadge ok={health.status === "healthy"} warn={health.status !== "healthy"} />
        </div>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Durum</dt>
            <dd className="font-medium text-navy-900">{statusLabel}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Veri modu</dt>
            <dd className="font-medium text-navy-900">
              {summary.mode === "supabase" ? "Supabase" : "Mock / demo"}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Ortam</dt>
            <dd className="font-medium text-navy-900">{summary.nodeEnv}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Site URL</dt>
            <dd className="truncate font-medium text-navy-900">{summary.siteUrl}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Supabase DB</dt>
            <dd className="font-medium text-navy-900">{health.supabaseMessage}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">/admin koruması</dt>
            <dd className="font-medium text-navy-900">
              {summary.adminRouteProtected
                ? "Aktif (oturum + ADMIN_EMAILS)"
                : summary.isProduction
                  ? "Eksik yapılandırma"
                  : "Geliştirme modu"}
            </dd>
          </div>
        </dl>
      </div>

      <div className="card-surface-lg mt-6 p-6">
        <h2 className="text-lg font-bold text-navy-900">Ortam kontrolleri</h2>
        <ul className="mt-4 space-y-2">
          {summary.checks.map((item) => (
            <li
              key={item.id}
              className="flex items-start justify-between gap-3 rounded-xl bg-cream-50 px-3 py-2 text-sm"
            >
              <div>
                <span className="font-medium text-navy-900">{item.label}</span>
                <p className="text-xs text-muted">{item.hint}</p>
              </div>
              <StatusBadge
                ok={item.status === "ok"}
                warn={item.status === "warn"}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="card-surface-lg mt-6 p-6">
        <h2 className="text-lg font-bold text-navy-900">Deploy kontrol listesi</h2>
        <ul className="mt-4 space-y-2">
          {health.deployChecklist.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between gap-3 rounded-xl bg-cream-50 px-3 py-2 text-sm"
            >
              <span className="text-navy-900">{item.label}</span>
              <StatusBadge ok={item.done} />
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted">
          Ayrıntılı adımlar:{" "}
          <code className="rounded bg-cream-100 px-1">DEPLOYMENT_CHECKLIST.md</code>
        </p>
      </div>

      {summary.readyForBeta ? (
        <p className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Temel beta yapılandırması tamam görünüyor. Admin ve ilan akışını elle doğrulayın.
        </p>
      ) : (
        <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Bazı maddeler eksik. Vercel env ve Supabase kurulumunu tamamlayın.
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link href="/" className="font-semibold text-accent hover:underline">
          Ana sayfa
        </Link>
        <Link href="/admin" className="font-semibold text-navy-700 hover:underline">
          Admin panel
        </Link>
        <Link href="/giris" className="font-semibold text-navy-700 hover:underline">
          Giriş
        </Link>
      </div>
    </div>
  );
}
