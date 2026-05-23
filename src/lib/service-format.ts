import { SERVICE_PRICE_TYPE_LABELS } from "@/lib/constants/service-labels";
import type { Listing } from "@/types/listing";

export function formatServicePrice(
  listing: Listing & { category: "hizmet-verenler" },
): string {
  const d = listing.details;
  if (d.priceType === "teklif-al") return "Teklif al";
  const suffix =
    d.priceType === "saatlik"
      ? "/ saat"
      : d.priceType === "gunluk"
        ? "/ gün"
        : d.priceType === "is-basina"
          ? " / iş"
          : "";
  if (d.startingPrice != null && d.startingPrice > 0) {
    return `${d.startingPrice.toLocaleString("tr-TR")} ₺${suffix}`;
  }
  return SERVICE_PRICE_TYPE_LABELS[d.priceType];
}

export function formatServiceLocation(
  listing: Listing & { category: "hizmet-verenler" },
): string {
  const cities = listing.details.serviceCities;
  const districts = listing.details.serviceDistricts;
  const primary = [listing.cityFrom, listing.districtFrom].filter(Boolean).join(", ");
  if (districts?.length) {
    return `${primary || cities[0]} · ${districts.slice(0, 2).join(", ")}`;
  }
  if (cities.length > 1) return `${cities[0]} +${cities.length - 1} şehir`;
  return primary || cities.join(", ");
}
