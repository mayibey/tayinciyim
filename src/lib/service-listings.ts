import { normalizeCity } from "@/lib/matching/city-proximity";
import type { Listing } from "@/types/listing";
import type { ServiceType } from "@/types/listing-fields";

export function isHizmetListing(listing: Listing): listing is Listing & {
  category: "hizmet-verenler";
} {
  return listing.category === "hizmet-verenler";
}

export function filterHizmetByCity(
  listings: Listing[],
  cityNameOrSlug: string,
  serviceTypes?: ServiceType[],
): (Listing & { category: "hizmet-verenler" })[] {
  const slug = normalizeCity(cityNameOrSlug);
  return listings.filter((l): l is Listing & { category: "hizmet-verenler" } => {
    if (!isHizmetListing(l)) return false;
    if (serviceTypes?.length && !serviceTypes.includes(l.details.serviceType)) {
      return false;
    }
    const cityMatch =
      normalizeCity(l.cityFrom) === slug ||
      l.details.serviceCities.some((c) => normalizeCity(c) === slug);
    return cityMatch;
  });
}
