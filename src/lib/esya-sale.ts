import type { EsyaDevriDetails } from "@/types/listing-fields";
import type { Listing } from "@/types/listing";

export function getEsyaDisplayPrice(
  listing: Listing & { category: "esya-devri" },
): number | null {
  const d = listing.details;
  if (d.listingIntent === "ucretsiz") return null;
  return d.askingPrice ?? listing.price ?? null;
}

export function formatEsyaPrice(
  listing: Listing & { category: "esya-devri" },
): string {
  const d = listing.details;
  if (d.listingIntent === "ucretsiz") return "Ücretsiz";
  const price = getEsyaDisplayPrice(listing);
  if (price == null || price <= 0) return "";
  return `${price.toLocaleString("tr-TR")} ₺`;
}

export function intentRequiresPrice(intent: EsyaDevriDetails["listingIntent"]): boolean {
  return intent === "satilik" || intent === "komple-ev-esyasi";
}
