import { ListingCardRouter } from "@/components/listings/cards/ListingCardRouter";
import { filterHizmetByCity } from "@/lib/service-listings";
import { SERVICE_TYPE_LABELS } from "@/lib/constants/service-labels";
import type { Listing } from "@/types/listing";
import type { ServiceType } from "@/types/listing-fields";

const POST_MOVE_TYPES: ServiceType[] = [
  "temizlik",
  "boya-badana",
  "ev-onarim",
  "mobilya-montaj",
];

interface PostMoveServicesSectionProps {
  city: string;
  allListings: Listing[];
}

export function PostMoveServicesSection({ city, allListings }: PostMoveServicesSectionProps) {
  const services = filterHizmetByCity(allListings, city, POST_MOVE_TYPES).slice(0, 4);

  if (services.length === 0) return null;

  return (
    <section className="card-surface-lg p-6 sm:p-8">
      <h2 className="text-lg font-bold text-navy-900">
        Taşınma sonrası ihtiyaç duyabileceğiniz hizmetler
      </h2>
      <p className="mt-2 text-sm text-muted">
        {city} bölgesinde {POST_MOVE_TYPES.map((t) => SERVICE_TYPE_LABELS[t].toLowerCase()).join(", ")}{" "}
        hizmetleri
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {services.map((listing) => (
          <ListingCardRouter key={listing.id} listing={listing} />
        ))}
      </div>
      <a
        href={`/ilanlar?kategori=hizmet-verenler&sehir=${encodeURIComponent(city)}`}
        className="mt-6 inline-flex text-sm font-semibold text-accent hover:underline"
      >
        Tüm hizmet verenleri gör →
      </a>
    </section>
  );
}
