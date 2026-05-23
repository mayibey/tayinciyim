import { ListingCardRouter } from "@/components/listings/cards/ListingCardRouter";
import type { Listing } from "@/types/listing";

export function ListingCard({ listing }: { listing: Listing }) {
  return <ListingCardRouter listing={listing} />;
}
