import Link from "next/link";
import { ListingCardRouter } from "@/components/listings/cards/ListingCardRouter";
import { CityGuideDisclaimer } from "@/components/location/CityGuideDisclaimer";
import { getListings } from "@/lib/data/listings";
import { PUBLIC_LISTING_STATUS } from "@/lib/constants/listing-status";
import { cityToSlug } from "@/lib/location/city-slug";
import { getCityGuideBySlug } from "@/lib/location/location-insights";
import { normalizeCity } from "@/lib/matching/city-proximity";
import type { Listing } from "@/types/listing";

export async function SehirSorusuGuideSection({
  listing,
}: {
  listing: Listing & { category: "sehir-sorusu" };
}) {
  const targetCity = listing.details.targetCity;
  const slug = cityToSlug(targetCity);
  const guide = getCityGuideBySlug(slug);

  const all = await getListings({ status: PUBLIC_LISTING_STATUS });
  const relatedQuestions = all.filter(
    (l) =>
      l.category === "sehir-sorusu" &&
      l.id !== listing.id &&
      normalizeCity(
        (l as Listing & { category: "sehir-sorusu" }).details.targetCity,
      ) === slug,
  );

  return (
    <section className="space-y-6">
      <div className="card-surface-lg p-6 sm:p-8">
        <h2 className="text-lg font-bold text-navy-900">Şehir rehberi</h2>
        <p className="mt-2 text-sm text-muted">
          {targetCity} hakkında yerleşme notları ve topluluk soruları.
        </p>
        {guide ? (
          <Link
            href={`/sehir-rehberi/${guide.slug}`}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
          >
            {targetCity} şehir rehberini görüntüle →
          </Link>
        ) : (
          <p className="mt-4 text-sm text-muted">
            Bu şehir için henüz rehber eklenmedi.{" "}
            <Link href="/sehir-rehberi" className="font-semibold text-accent hover:underline">
              Diğer şehirler
            </Link>
          </p>
        )}
        <div className="mt-4">
          <CityGuideDisclaimer />
        </div>
        <Link
          href={`/ilan-ver?kategori=sehir-sorusu`}
          className="mt-5 inline-flex rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white transition-smooth hover:bg-navy-800"
        >
          Bu şehir hakkında soru sor
        </Link>
      </div>

      {relatedQuestions.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-bold text-navy-900">
            {targetCity} — diğer sorular
          </h3>
          <div className="grid gap-6 sm:grid-cols-2">
            {relatedQuestions.slice(0, 4).map((q) => (
              <ListingCardRouter key={q.id} listing={q} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
