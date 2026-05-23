import { ListingCardRouter } from "@/components/listings/cards/ListingCardRouter";
import type { Listing } from "@/types/listing";

interface RelatedListingsSectionProps {
  title: string;
  listings: Listing[];
  emptyMessage?: string;
}

export function RelatedListingsSection({
  title,
  listings,
  emptyMessage = "Bu kriterde ilan bulunamadı.",
}: RelatedListingsSectionProps) {
  if (listings.length === 0) {
    return (
      <section>
        <h2 className="mb-3 text-xl font-bold text-navy-900">{title}</h2>
        <p className="text-sm text-muted">{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-navy-900">{title}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <ListingCardRouter key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}
