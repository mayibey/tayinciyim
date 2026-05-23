import { getListings } from "@/lib/data/listings";
import { PUBLIC_LISTING_STATUS } from "@/lib/constants/listing-status";
import type { CategorySlug, Listing } from "@/types/listing";

const MATCH_CATEGORIES = {
  seeker: "nakliye-ariyorum",
  carrier: "nakliyeci-arac-ilani",
} as const;

export async function getRouteMatchCandidates(
  source: Listing,
  excludeId?: string,
): Promise<Listing[]> {
  const opposite: CategorySlug =
    source.category === MATCH_CATEGORIES.seeker
      ? MATCH_CATEGORIES.carrier
      : MATCH_CATEGORIES.seeker;

  const all = await getListings({ status: PUBLIC_LISTING_STATUS });
  const id = excludeId ?? source.id;

  return all.filter((l) => l.category === opposite && l.id !== id);
}
