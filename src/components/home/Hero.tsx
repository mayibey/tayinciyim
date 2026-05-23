import { ButtonLink } from "@/components/ui/Button";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const trustItems = [
  "Kamu memurları için",
  "Ücretsiz ilan",
  "4 kategori",
];

export function Hero() {
  const supabaseReady = isSupabaseConfigured();

  return (
    <section className="relative overflow-hidden bg-navy-900">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-navy-700/50 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-medium text-cream-100 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-accent" />
            Kamu tayini & yer değiştirme
          </div>

          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
            Tayin yolculuğunuzda{" "}
            <span className="text-accent">güvenilir</span> ilan platformu
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream-200/90">
            Ev devri, eşya devri, ortak nakliye ve yeni şehir sorularınızı
            memur topluluğuyla paylaşın. Resmî süreçlere uygun, sade ve
            anlaşılır arayüz.
          </p>

          <ul className="mt-8 flex flex-wrap gap-3">
            {trustItems.map((item) => (
              <li
                key={item}
                className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-cream-100 ring-1 ring-white/10"
              >
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/ilanlar" size="lg">
              İlanları İncele
            </ButtonLink>
            <ButtonLink href="/ilan-ver" variant="outline" size="lg" className="border-white/25 bg-white/5 text-white hover:border-white/40 hover:bg-white/10">
              Ücretsiz İlan Ver
            </ButtonLink>
          </div>

          {!supabaseReady && (
            <p className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent/15 px-4 py-2 text-sm text-accent-soft ring-1 ring-accent/30">
              <span className="font-semibold text-accent">MVP:</span>
              Mock veri — Supabase için .env.local
            </p>
          )}
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" />
    </section>
  );
}
