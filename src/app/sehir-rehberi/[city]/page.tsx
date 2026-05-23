import Link from "next/link";
import { notFound } from "next/navigation";
import { CityGuideDisclaimer } from "@/components/location/CityGuideDisclaimer";
import { CityScoreGrid } from "@/components/location/CityScoreGrid";
import { NeighborhoodList } from "@/components/location/NeighborhoodList";
import { OfficerTips } from "@/components/location/OfficerTips";
import { RelatedListingsSection } from "@/components/location/RelatedListingsSection";
import { getListings } from "@/lib/data/listings";
import { PUBLIC_LISTING_STATUS } from "@/lib/constants/listing-status";
import { normalizeCity } from "@/lib/matching/city-proximity";
import { getCityGuideBySlug } from "@/lib/location/location-insights";
import { formatDate } from "@/lib/utils";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { Listing } from "@/types/listing";

interface PageProps {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { city } = await params;
  const guide = getCityGuideBySlug(city);
  if (!guide) return { title: "Şehir bulunamadı" };

  return buildPageMetadata({
    title: `${guide.city} Şehir Rehberi | Memur Tayin Yerleşme Rehberi`,
    description: `${guide.city}'e tayin olan memurlar için mahalle, kira, ulaşım, okul, hastane ve sosyal yaşam notları.`,
    path: `/sehir-rehberi/${guide.slug}`,
  });
}

function filterListingsByCity(listings: Listing[], citySlug: string): Listing[] {
  return listings.filter((l) => {
    const from = normalizeCity(l.cityFrom);
    const to = l.cityTo ? normalizeCity(l.cityTo) : "";
    return from === citySlug || to === citySlug;
  });
}

export default async function SehirRehberiDetayPage({ params }: PageProps) {
  const { city } = await params;
  const guide = getCityGuideBySlug(city);

  if (!guide) {
    notFound();
  }

  const allApproved = await getListings({ status: PUBLIC_LISTING_STATUS });
  const inCity = filterListingsByCity(allApproved, guide.slug);
  const evListings = inCity.filter((l) => l.category === "ev-devri").slice(0, 3);
  const nakliyeListings = inCity
    .filter(
      (l) =>
        l.category === "nakliye-ariyorum" || l.category === "nakliyeci-arac-ilani",
    )
    .slice(0, 3);
  const sehirSorulari = inCity.filter((l) => l.category === "sehir-sorusu").slice(0, 3);
  const hizmetListings = inCity.filter((l) => l.category === "hizmet-verenler").slice(0, 6);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
      <Link
        href="/sehir-rehberi"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-navy-800 transition-smooth hover:text-accent"
      >
        ← Şehir rehberi
      </Link>

      <div className="card-surface-lg overflow-hidden p-0">
        <div className="h-1 w-full bg-gradient-to-r from-navy-800 via-sky-600 to-accent" />
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-navy-900 sm:text-4xl">
            {guide.city} Şehir Rehberi
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-navy-800/90">
            {guide.summary}
          </p>
          <p className="mt-2 text-xs text-muted">
            Son güncelleme: {formatDate(guide.lastUpdatedAt)}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <CityGuideDisclaimer />
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-bold text-navy-900">Şehir skorları</h2>
        <CityScoreGrid guide={guide} />
        <p className="mt-4 text-sm font-medium text-navy-800">{guide.averageRentNote}</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <NeighborhoodList
          title="Önerilen mahalleler"
          items={guide.recommendedNeighborhoods}
          variant="recommended"
        />
        <NeighborhoodList
          title="Dikkat edilecek bölgeler"
          items={guide.cautionNeighborhoods}
          variant="caution"
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <NoteCard title="Okul" text={guide.schoolNote} />
        <NoteCard title="Hastane" text={guide.hospitalNote} />
        <NoteCard title="Market" text={guide.marketNote} />
        <NoteCard title="Ulaşım" text={guide.publicTransportNote} />
        <NoteCard title="Sosyal yaşam" text={guide.socialLifeNote} full />
      </div>

      <div className="mt-8">
        <OfficerTips tips={guide.officerTips} />
      </div>

      <div className="mt-10 space-y-10">
        <RelatedListingsSection
          title={`${guide.city} — ev devri ilanları`}
          listings={evListings}
        />
        <RelatedListingsSection
          title={`${guide.city} — nakliye ilanları`}
          listings={nakliyeListings}
        />
        <RelatedListingsSection
          title={`${guide.city} — şehir soruları`}
          listings={sehirSorulari}
        />
        <RelatedListingsSection
          title={`${guide.city} — hizmet verenler`}
          listings={hizmetListings}
          emptyMessage="Bu şehir için henüz hizmet ilanı yok."
        />
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href={`/ilan-ver?kategori=sehir-sorusu`}
          className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-smooth hover:brightness-105"
        >
          Bu şehir hakkında soru sor
        </Link>
        <Link
          href={`/ilanlar?kategori=ev-devri&sehir=${encodeURIComponent(guide.city)}`}
          className="rounded-xl border border-navy-900/10 bg-cream-50 px-5 py-2.5 text-sm font-semibold text-navy-900 transition-smooth hover:border-accent"
        >
          {guide.city} ev ilanları
        </Link>
        <Link
          href={`/ilanlar?kategori=hizmet-verenler&sehir=${encodeURIComponent(guide.city)}`}
          className="rounded-xl border border-teal-200 bg-teal-50 px-5 py-2.5 text-sm font-semibold text-teal-900 transition-smooth hover:border-teal-400"
        >
          {guide.city} hizmet verenler
        </Link>
      </div>
    </div>
  );
}

function NoteCard({
  title,
  text,
  full,
}: {
  title: string;
  text: string;
  full?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-cream-50/80 p-4 ${full ? "sm:col-span-2" : ""}`}
    >
      <h3 className="text-sm font-bold text-navy-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
    </div>
  );
}
