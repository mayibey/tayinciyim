import { MOCK_LISTINGS } from "@/lib/mock-data";
import { applyListingFilters, type SearchParams } from "@/lib/filters/apply-filters";
import { attachUserIdToListing } from "@/lib/users/resolve-user";
import { DEFAULT_MOCK_USER_ID } from "@/lib/mock-data/users";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseAnonServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";
import {
  mapListingRowToListing,
  mapListingToInsertPayload,
  mapListingToUpdatePayload,
  type ListingRow,
} from "@/lib/data/mappers/listing-mapper";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { ListingRepositoryError, LISTING_SAVE_ERROR } from "@/lib/data/repository-error";
import type { CategorySlug, CreateListingInput, Listing, ListingStatus } from "@/types/listing";

const listingStore: Listing[] = structuredClone(MOCK_LISTINGS).map(attachUserIdToListing);
let runtimeListings: Listing[] = [];

function allMockListings(): Listing[] {
  return [...listingStore, ...runtimeListings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export interface GetListingsOptions {
  category?: CategorySlug;
  status?: ListingStatus;
  searchParams?: SearchParams;
  /** Admin: tüm durumlar */
  includeAllStatuses?: boolean;
}

export interface ReportListingInput {
  listingId: string;
  reporterName?: string;
  reporterContact?: string;
  reason: string;
  message?: string;
}

export interface RelatedListingsInput {
  city: string;
  category?: CategorySlug;
  excludeId?: string;
  limit?: number;
}

// —— Mock implementations ——

function mockGetListings(options?: GetListingsOptions): Listing[] {
  let items = allMockListings();
  if (options?.status) {
    items = items.filter((l) => l.status === options.status);
  } else if (!options?.includeAllStatuses) {
    items = items.filter((l) => l.status === "approved");
  }
  const category =
    options?.category ??
    (options?.searchParams?.kategori as CategorySlug | undefined);
  if (options?.searchParams || category) {
    items = applyListingFilters(items, category, options?.searchParams ?? {});
  }
  return items;
}

function mockGetListingById(id: string): Listing | null {
  return allMockListings().find((l) => l.id === id) ?? null;
}

function mockCreateListing(input: CreateListingInput): Listing {
  const now = new Date().toISOString();
  const listing = attachUserIdToListing({
    id: `local-${Date.now()}`,
    ...input,
    userId: input.userId ?? DEFAULT_MOCK_USER_ID,
    images: input.images ?? [],
    status: "pending" as const,
    createdAt: now,
    updatedAt: now,
    isUrgent: input.isUrgent ?? false,
    isFeatured: input.isFeatured ?? false,
    reportCount: 0,
  } as Listing);
  runtimeListings = [listing, ...runtimeListings];
  return listing;
}

function mockUpdateListingStatus(id: string, status: ListingStatus): Listing | null {
  const updateIn = (arr: Listing[]) => {
    const i = arr.findIndex((l) => l.id === id);
    if (i < 0) return null;
    arr[i] = { ...arr[i], status, updatedAt: new Date().toISOString() };
    return arr[i];
  };
  return updateIn(listingStore) ?? updateIn(runtimeListings);
}

// —— Supabase ——

function supabaseReadClient(includeAllStatuses?: boolean) {
  if (includeAllStatuses) {
    return createSupabaseServiceClient() ?? createSupabaseAnonServerClient();
  }
  return createSupabaseAnonServerClient();
}

async function supabaseGetListings(options?: GetListingsOptions): Promise<Listing[]> {
  const client = supabaseReadClient(options?.includeAllStatuses);
  if (!client) return mockGetListings(options);

  let query = client.from("listings").select("*").order("created_at", { ascending: false });

  if (options?.status) {
    query = query.eq("status", options.status);
  } else if (!options?.includeAllStatuses) {
    query = query.eq("status", "approved");
  }

  if (options?.category) {
    query = query.eq("category", options.category);
  }

  const { data, error } = await query;
  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[listings] Supabase getListings:", error.message);
    }
    return [];
  }

  let items = (data as ListingRow[]).map(mapListingRowToListing);

  if (options?.searchParams && !options.category) {
    const cat = options.searchParams.kategori as CategorySlug | undefined;
    items = applyListingFilters(items, cat, options.searchParams);
  } else if (options?.searchParams) {
    items = applyListingFilters(items, options.category, options.searchParams);
  }

  return items;
}

async function supabaseGetListingById(id: string): Promise<Listing | null> {
  const client = createSupabaseAnonServerClient();
  if (!client) return mockGetListingById(id);

  const { data, error } = await client.from("listings").select("*").eq("id", id).maybeSingle();
  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[listings] getById:", error.message);
    }
    return null;
  }
  if (!data) return null;
  return mapListingRowToListing(data as ListingRow);
}

async function supabaseCreateListing(input: CreateListingInput): Promise<Listing> {
  const userId = (await getCurrentUserId()) ?? input.userId ?? null;
  const payload = mapListingToInsertPayload(input, userId);

  const client = createSupabaseAnonServerClient();
  if (!client) return mockCreateListing({ ...input, userId: userId ?? undefined });

  const { data, error } = await client
    .from("listings")
    .insert(payload)
    .select("*")
    .single();

  if (error || !data) {
    if (process.env.NODE_ENV === "development") {
      console.error("[listings] create:", error?.message);
    }
    throw new ListingRepositoryError(
      error?.code === "42501" || error?.message?.includes("policy")
        ? "İlan kaydedilemedi. Yetki veya oturum sorunu olabilir."
        : LISTING_SAVE_ERROR,
    );
  }
  return mapListingRowToListing(data as ListingRow);
}

async function supabaseUpdateListingImages(
  id: string,
  images: Listing["images"],
): Promise<Listing | null> {
  const service = createSupabaseServiceClient();
  const client = service ?? createSupabaseAnonServerClient();
  if (!client) return null;

  const { data, error } = await client
    .from("listings")
    .update(mapListingToUpdatePayload({ images }))
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    console.error("[listings] update images:", error?.message);
    return null;
  }
  return mapListingRowToListing(data as ListingRow);
}

async function supabaseUpdateListingStatus(
  id: string,
  status: ListingStatus,
): Promise<Listing | null> {
  // TODO: admin role based policy — şimdilik service role ile güncelleme
  const client = createSupabaseServiceClient() ?? createSupabaseAnonServerClient();
  if (!client) return mockUpdateListingStatus(id, status);

  const { data, error } = await client
    .from("listings")
    .update(mapListingToUpdatePayload({ status }))
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    if (process.env.NODE_ENV === "development") {
      console.error("[listings] update status:", error?.message);
    }
    throw new ListingRepositoryError("İlan durumu güncellenemedi.");
  }
  return mapListingRowToListing(data as ListingRow);
}

async function supabaseReportListing(input: ReportListingInput): Promise<boolean> {
  const client = createSupabaseAnonServerClient();
  if (!client) return false;

  const { error: reportError } = await client.from("reports").insert({
    listing_id: input.listingId,
    reporter_name: input.reporterName ?? null,
    reporter_contact: input.reporterContact ?? null,
    reason: input.reason,
    message: input.message ?? null,
    status: "pending",
  });

  if (reportError) {
    if (process.env.NODE_ENV === "development") {
      console.error("[reports] insert:", reportError.message);
    }
    return false;
  }

  const listing = await supabaseGetListingById(input.listingId);
  if (listing) {
    const service = createSupabaseServiceClient() ?? client;
    await service
      .from("listings")
      .update(
        mapListingToUpdatePayload({ report_count: listing.reportCount + 1 }),
      )
      .eq("id", input.listingId);
  }

  return true;
}

// —— Public API ——

export async function getListings(options?: GetListingsOptions): Promise<Listing[]> {
  if (hasSupabaseEnv()) return supabaseGetListings(options);
  return mockGetListings(options);
}

export async function getListingById(id: string): Promise<Listing | null> {
  if (hasSupabaseEnv()) return supabaseGetListingById(id);
  return mockGetListingById(id);
}

export async function createListing(input: CreateListingInput): Promise<Listing> {
  if (hasSupabaseEnv()) return supabaseCreateListing(input);
  return mockCreateListing(input);
}

function mockUpdateListingImages(id: string, images: Listing["images"]): Listing | null {
  const patch = (arr: Listing[]) => {
    const i = arr.findIndex((l) => l.id === id);
    if (i < 0) return null;
    arr[i] = { ...arr[i], images, updatedAt: new Date().toISOString() };
    return arr[i];
  };
  return patch(listingStore) ?? patch(runtimeListings);
}

export async function updateListingImages(
  id: string,
  images: Listing["images"],
): Promise<Listing | null> {
  if (hasSupabaseEnv()) return supabaseUpdateListingImages(id, images);
  return mockUpdateListingImages(id, images);
}

export async function updateListingStatus(
  id: string,
  status: ListingStatus,
): Promise<Listing | null> {
  if (hasSupabaseEnv()) return supabaseUpdateListingStatus(id, status);
  return mockUpdateListingStatus(id, status);
}

export async function reportListing(input: ReportListingInput): Promise<boolean> {
  if (hasSupabaseEnv()) return supabaseReportListing(input);
  return true;
}

export async function getListingsByUserId(userId: string): Promise<Listing[]> {
  if (hasSupabaseEnv()) {
    const client = createSupabaseAnonServerClient();
    if (client) {
      const { data } = await client
        .from("listings")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (data) return (data as ListingRow[]).map(mapListingRowToListing);
    }
  }
  return allMockListings().filter((l) => l.userId === userId);
}

export async function getRelatedListings(input: RelatedListingsInput): Promise<Listing[]> {
  const limit = input.limit ?? 6;
  const all = await getListings({
    category: input.category,
    status: "approved",
  });
  return all
    .filter(
      (l) =>
        l.id !== input.excludeId &&
        (l.cityFrom === input.city ||
          l.cityTo === input.city ||
          (l.category === "sehir-sorusu" &&
            "targetCity" in l.details &&
            l.details.targetCity === input.city)),
    )
    .slice(0, limit);
}

export async function getListingStats() {
  const items = hasSupabaseEnv()
    ? await supabaseGetListings({ includeAllStatuses: true })
    : allMockListings();

  const byCategory = items.reduce(
    (acc, l) => {
      acc[l.category] = (acc[l.category] ?? 0) + 1;
      return acc;
    },
    {} as Record<CategorySlug, number>,
  );

  return {
    total: items.length,
    approved: items.filter((l) => l.status === "approved").length,
    pending: items.filter((l) => l.status === "pending").length,
    rejected: items.filter((l) => l.status === "rejected").length,
    byCategory,
  };
}
