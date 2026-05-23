import "server-only";

import { getCurrentAdmin } from "@/lib/admin/admin-auth";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import {
  createSupabaseAnonServerClient,
  createSupabaseServerClient,
  createSupabaseServiceClient,
} from "@/lib/supabase/server";
import {
  MOCK_CARRIER_PROFILES,
  MOCK_USERS,
} from "@/lib/mock-data/users";
import type { CarrierProfile, UserProfile, UserBadge, UserType } from "@/types/user-profile";
import type { OfficerGroup } from "@/types/listing-fields";

interface ProfileRow {
  id: string;
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  user_type: string | null;
  officer_group: string | null;
  city: string | null;
  district: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  bio: string | null;
  trust_score: number | null;
  rating_average: number | null;
  rating_count: number | null;
  completed_transaction_count: number | null;
  active_listing_count: number | null;
  report_count: number | null;
  response_rate: number | null;
  average_response_time: string | null;
  badges: UserBadge[] | null;
  is_verified: boolean | null;
  is_phone_verified: boolean | null;
  is_email_verified: boolean | null;
  is_identity_verified: boolean | null;
  is_carrier_verified: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface PublicProfileRow {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  user_type: string | null;
  officer_group: string | null;
  city: string | null;
  district: string | null;
  bio: string | null;
  trust_score: number | null;
  rating_average: number | null;
  rating_count: number | null;
  completed_transaction_count: number | null;
  active_listing_count: number | null;
  report_count: number | null;
  response_rate: number | null;
  average_response_time: string | null;
  badges: UserBadge[] | null;
  is_verified: boolean | null;
  is_phone_verified: boolean | null;
  is_email_verified: boolean | null;
  is_identity_verified: boolean | null;
  is_carrier_verified: boolean | null;
  created_at: string;
}

const USER_TYPES: UserType[] = [
  "memur",
  "nakliyeci",
  "ev-sahibi",
  "emlakci",
  "bireysel",
  "hizmet-veren",
];

const NEUTRAL_AUTHOR_LABEL = "Doğrulanmış kullanıcı";

function parseUserType(value: string | null): UserType {
  return USER_TYPES.includes(value as UserType) ? (value as UserType) : "bireysel";
}

function mapFullProfileRow(row: ProfileRow): UserProfile {
  const displayName = row.display_name ?? row.full_name ?? NEUTRAL_AUTHOR_LABEL;
  return {
    id: row.id,
    fullName: row.full_name ?? displayName,
    displayName,
    avatarUrl: row.avatar_url ?? undefined,
    userType: parseUserType(row.user_type),
    officerGroup: (row.officer_group as OfficerGroup) ?? "none",
    city: row.city ?? "",
    district: row.district ?? undefined,
    phone: row.phone ?? "",
    whatsapp: row.whatsapp ?? row.phone ?? "",
    email: row.email ?? undefined,
    bio: row.bio ?? undefined,
    joinedAt: row.created_at,
    lastActiveAt: row.updated_at,
    isVerified: row.is_verified ?? false,
    isPhoneVerified: row.is_phone_verified ?? false,
    isEmailVerified: row.is_email_verified ?? false,
    isIdentityVerified: row.is_identity_verified ?? false,
    isCarrierVerified: row.is_carrier_verified ?? false,
    trustScore: row.trust_score ?? 60,
    ratingAverage: Number(row.rating_average ?? 0),
    ratingCount: row.rating_count ?? 0,
    completedTransactionCount: row.completed_transaction_count ?? 0,
    activeListingCount: row.active_listing_count ?? 0,
    reportCount: row.report_count ?? 0,
    responseRate: row.response_rate ?? 0,
    averageResponseTime: row.average_response_time ?? "—",
    badges: Array.isArray(row.badges) ? row.badges : [],
  };
}

export function mapPublicProfileRow(row: PublicProfileRow): UserProfile {
  const displayName = row.display_name?.trim() || NEUTRAL_AUTHOR_LABEL;
  return {
    id: row.id,
    fullName: displayName,
    displayName,
    avatarUrl: row.avatar_url ?? undefined,
    userType: parseUserType(row.user_type),
    officerGroup: (row.officer_group as OfficerGroup) ?? "none",
    city: row.city ?? "",
    district: row.district ?? undefined,
    phone: "",
    whatsapp: "",
    email: undefined,
    bio: row.bio ?? undefined,
    joinedAt: row.created_at,
    lastActiveAt: row.created_at,
    isVerified: row.is_verified ?? false,
    isPhoneVerified: row.is_phone_verified ?? false,
    isEmailVerified: row.is_email_verified ?? false,
    isIdentityVerified: row.is_identity_verified ?? false,
    isCarrierVerified: row.is_carrier_verified ?? false,
    trustScore: row.trust_score ?? 60,
    ratingAverage: Number(row.rating_average ?? 0),
    ratingCount: row.rating_count ?? 0,
    completedTransactionCount: row.completed_transaction_count ?? 0,
    activeListingCount: row.active_listing_count ?? 0,
    reportCount: row.report_count ?? 0,
    responseRate: row.response_rate ?? 0,
    averageResponseTime: row.average_response_time ?? "—",
    badges: Array.isArray(row.badges) ? row.badges : [],
  };
}

function mockGetProfileById(id: string): UserProfile | null {
  return MOCK_USERS.find((u) => u.id === id) ?? null;
}

/** public_profiles view — PII yok */
export async function getPublicUserProfileById(id: string): Promise<UserProfile | null> {
  if (!hasSupabaseEnv()) {
    return mockGetProfileById(id);
  }

  const client = createSupabaseAnonServerClient();
  if (!client) return null;

  const { data, error } = await client
    .from("public_profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return mapPublicProfileRow(data as PublicProfileRow);
}

/** Oturum açmış kullanıcı — profiles tablosu (RLS: auth.uid() = id) */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  if (!hasSupabaseEnv()) return null;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) return null;
  return mapFullProfileRow(data as ProfileRow);
}

/** Admin panel — service role, tam PII */
export async function getAdminUserProfileById(id: string): Promise<UserProfile | null> {
  if (!hasSupabaseEnv()) {
    return mockGetProfileById(id);
  }

  const admin = await getCurrentAdmin();
  if (!admin) return null;

  const service = createSupabaseServiceClient();
  if (!service) return null;

  const { data, error } = await service.from("profiles").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return mapFullProfileRow(data as ProfileRow);
}

/** Toplu public profil — yorum yazarları / ilan kartları */
export async function getPublicProfilesByIds(
  ids: string[],
): Promise<Map<string, UserProfile>> {
  const unique = [...new Set(ids.filter((id) => id && id !== "unknown"))];
  const result = new Map<string, UserProfile>();

  if (unique.length === 0) return result;

  if (!hasSupabaseEnv()) {
    for (const id of unique) {
      const mock = mockGetProfileById(id);
      if (mock) result.set(id, mock);
    }
    return result;
  }

  const client = createSupabaseAnonServerClient();
  if (!client) return result;

  const { data, error } = await client
    .from("public_profiles")
    .select("*")
    .in("id", unique);

  if (error || !data) return result;

  for (const row of data as PublicProfileRow[]) {
    result.set(row.id, mapPublicProfileRow(row));
  }
  return result;
}

/** @deprecated getPublicUserProfileById / getCurrentUserProfile / getAdminUserProfileById kullanın */
export async function getProfileById(
  id: string,
  options?: { admin?: boolean },
): Promise<UserProfile | null> {
  if (options?.admin) {
    return getAdminUserProfileById(id);
  }
  return getPublicUserProfileById(id);
}

export function getCarrierProfileForUser(userId: string): CarrierProfile | null {
  if (!hasSupabaseEnv()) {
    return MOCK_CARRIER_PROFILES.find((c) => c.userId === userId) ?? null;
  }
  // TODO: carrier_profiles Supabase select
  return null;
}

export { NEUTRAL_AUTHOR_LABEL };
