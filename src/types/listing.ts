import type {
  EsyaDevriDetails,
  EvDevriDetails,
  HizmetVerenlerDetails,
  NakliyeAriyorumDetails,
  NakliyeciAracDetails,
  SehirSorusuDetails,
} from "./listing-fields";

export type CategorySlug =
  | "ev-devri"
  | "esya-devri"
  | "nakliye-ariyorum"
  | "nakliyeci-arac-ilani"
  | "sehir-sorusu"
  | "hizmet-verenler";

export type ListingStatus = "pending" | "approved" | "rejected";

export interface ListingImage {
  url: string;
  alt?: string;
}

export interface ListingBase {
  id: string;
  /** İlan sahibi — mock'ta WhatsApp eşlemesi ile de çözülebilir */
  userId?: string;
  category: CategorySlug;
  title: string;
  description: string;
  contactName: string;
  whatsapp: string;
  cityFrom: string;
  districtFrom?: string;
  cityTo?: string;
  districtTo?: string;
  availableDate?: string;
  availableTimeStart?: string;
  availableTimeEnd?: string;
  price?: number;
  images: ListingImage[];
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
  isUrgent: boolean;
  isFeatured: boolean;
  reportCount: number;
}

export type Listing =
  | (ListingBase & { category: "ev-devri"; details: EvDevriDetails })
  | (ListingBase & { category: "esya-devri"; details: EsyaDevriDetails })
  | (ListingBase & { category: "nakliye-ariyorum"; details: NakliyeAriyorumDetails })
  | (ListingBase & { category: "nakliyeci-arac-ilani"; details: NakliyeciAracDetails })
  | (ListingBase & { category: "sehir-sorusu"; details: SehirSorusuDetails })
  | (ListingBase & { category: "hizmet-verenler"; details: HizmetVerenlerDetails });

export type ListingDetails = Listing["details"];

export type CreateListingInput = Omit<
  Listing,
  "id" | "status" | "createdAt" | "updatedAt" | "reportCount"
> & {
  isUrgent?: boolean;
  isFeatured?: boolean;
};

/** Geriye dönük uyumluluk */
export function getListingContactName(listing: Listing): string {
  return listing.contactName;
}

export function getListingLocationFrom(listing: Listing): string {
  return [listing.cityFrom, listing.districtFrom].filter(Boolean).join(", ");
}

export function getListingRoute(listing: Listing): string | null {
  if (!listing.cityTo) return getListingLocationFrom(listing);
  const from = getListingLocationFrom(listing);
  const to = [listing.cityTo, listing.districtTo].filter(Boolean).join(", ");
  return `${from} → ${to}`;
}
