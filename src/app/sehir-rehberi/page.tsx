import { Suspense } from "react";
import { CityGuideCard } from "@/components/location/CityGuideCard";
import { CityGuideDisclaimer } from "@/components/location/CityGuideDisclaimer";
import { CityGuideSearch } from "@/components/location/CityGuideSearch";
import { PageHeader } from "@/components/ui/PageHeader";
import { SecurityNotice } from "@/components/listings/SecurityNotice";
import { searchCityGuides } from "@/lib/location/location-insights";
import { SITE_NAME } from "@/lib/constants/site";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Şehir Rehberi",
  description:
    "Tayin olan memurlar için şehir, mahalle, kira, ulaşım, okul, hastane ve sosyal yaşam notları.",
  path: "/sehir-rehberi",
});

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SehirRehberiPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const guides = searchCityGuides(q ?? "");

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
      <PageHeader
        badge="Yerleşme"
        title="Şehir Rehberi"
        description="Gideceğiniz şehirde mahalle, ulaşım, kira ve sosyal imkânlar hakkında örnek rehber bilgileri."
      />

      <div className="mb-8">
        <CityGuideDisclaimer />
      </div>

      <Suspense fallback={<div className="h-12 animate-pulse rounded-xl bg-cream-200" />}>
        <CityGuideSearch />
      </Suspense>

      <section id="guvenli-tasinma" className="mt-10 card-surface-lg p-6 sm:p-8">
        <h2 className="text-lg font-bold text-navy-900">Güvenli Taşınma Rehberi</h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm leading-relaxed text-navy-800/90">
          <li>Kapora göndermeden önce ilan sahibini ve evi mümkünse yerinde doğrulayın.</li>
          <li>Tam adresi herkese açık paylaşmayın; mahalle düzeyi bilgi yeterlidir.</li>
          <li>Profil puanı ve yorumları tek başına karar verdirici olmamalıdır.</li>
          <li>Nakliyede sigorta ve sözleşme şartlarını yazılı teyit edin.</li>
        </ul>
        <div className="mt-4">
          <SecurityNotice
            message={`${SITE_NAME} ödeme aracılığı değildir. Şüpheli ilanları bildirin.`}
            variant="warning"
          />
        </div>
      </section>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {guides.map((guide) => (
          <CityGuideCard key={guide.slug} guide={guide} />
        ))}
      </div>

      {guides.length === 0 && (
        <p className="mt-8 text-center text-muted">Aramanızla eşleşen şehir bulunamadı.</p>
      )}
    </div>
  );
}
