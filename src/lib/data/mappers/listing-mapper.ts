import type { CategorySlug, CreateListingInput, Listing, ListingImage, ListingStatus } from "@/types/listing";
import type { ListingDetails } from "@/types/listing";

export interface ListingRow {
  id: string;
  user_id: string | null;
  category: string;
  title: string;
  description: string;
  contact_name: string | null;
  whatsapp: string | null;
  city_from: string | null;
  district_from: string | null;
  city_to: string | null;
  district_to: string | null;
  available_date: string | null;
  available_time_start: string | null;
  available_time_end: string | null;
  price: number | null;
  details: Record<string, unknown>;
  images: ListingImage[] | null;
  status: string;
  is_urgent: boolean;
  is_featured: boolean;
  report_count: number;
  created_at: string;
  updated_at: string;
}

export interface ListingInsertPayload {
  user_id?: string | null;
  category: string;
  title: string;
  description: string;
  contact_name: string;
  whatsapp: string;
  city_from: string;
  district_from?: string | null;
  city_to?: string | null;
  district_to?: string | null;
  available_date?: string | null;
  available_time_start?: string | null;
  available_time_end?: string | null;
  price?: number | null;
  details: Record<string, unknown>;
  images?: ListingImage[];
  status?: string;
  is_urgent?: boolean;
  is_featured?: boolean;
}

function isCategorySlug(value: string): value is CategorySlug {
  return [
    "ev-devri",
    "esya-devri",
    "nakliye-ariyorum",
    "nakliyeci-arac-ilani",
    "sehir-sorusu",
    "hizmet-verenler",
  ].includes(value);
}

function parseStatus(status: string): ListingStatus {
  if (status === "approved" || status === "rejected" || status === "pending") {
    return status;
  }
  return "pending";
}

export function mapListingRowToListing(row: ListingRow): Listing {
  const category = isCategorySlug(row.category) ? row.category : "esya-devri";
  const details = (row.details ?? {}) as unknown as ListingDetails;
  const base = {
    id: row.id,
    userId: row.user_id ?? undefined,
    category,
    title: row.title,
    description: row.description,
    contactName: row.contact_name ?? "",
    whatsapp: row.whatsapp ?? "",
    cityFrom: row.city_from ?? "",
    districtFrom: row.district_from ?? undefined,
    cityTo: row.city_to ?? undefined,
    districtTo: row.district_to ?? undefined,
    availableDate: row.available_date ?? undefined,
    availableTimeStart: row.available_time_start ?? undefined,
    availableTimeEnd: row.available_time_end ?? undefined,
    price: row.price ?? undefined,
    images: Array.isArray(row.images) ? row.images : [],
    status: parseStatus(row.status),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isUrgent: row.is_urgent,
    isFeatured: row.is_featured,
    reportCount: row.report_count,
  };

  return { ...base, category, details } as Listing;
}

export function mapListingToInsertPayload(
  input: CreateListingInput,
  userId?: string | null,
): ListingInsertPayload {
  return {
    user_id: userId ?? input.userId ?? null,
    category: input.category,
    title: input.title,
    description: input.description,
    contact_name: input.contactName,
    whatsapp: input.whatsapp,
    city_from: input.cityFrom,
    district_from: input.districtFrom ?? null,
    city_to: input.cityTo ?? null,
    district_to: input.districtTo ?? null,
    available_date: input.availableDate ?? null,
    available_time_start: input.availableTimeStart ?? null,
    available_time_end: input.availableTimeEnd ?? null,
    price: input.price ?? null,
    details: input.details as unknown as Record<string, unknown>,
    images: input.images ?? [],
    status: "pending",
    is_urgent: input.isUrgent ?? false,
    is_featured: input.isFeatured ?? false,
  };
}

export function mapListingToUpdatePayload(partial: {
  status?: ListingStatus;
  images?: ListingImage[];
  report_count?: number;
}): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (partial.status != null) payload.status = partial.status;
  if (partial.images != null) payload.images = partial.images;
  if (partial.report_count != null) payload.report_count = partial.report_count;
  return payload;
}
