import { hasSupabaseEnv } from "@/lib/supabase/env";
import {
  DEFAULT_MOCK_USER_ID,
  MOCK_CARRIER_PROFILES,
  MOCK_USERS,
  WHATSAPP_TO_USER_ID,
} from "@/lib/mock-data/users";
import { maskContactName } from "@/lib/privacy/pii";
import type { Listing } from "@/types/listing";
import type {
  CarrierProfile,
  ListingAuthorSnapshot,
  UserProfile,
} from "@/types/user-profile";

const userById = new Map(MOCK_USERS.map((u) => [u.id, u]));

/** Mock mod — senkron profil */
export function getUserById(id: string): UserProfile | null {
  if (hasSupabaseEnv()) {
    return null;
  }
  return userById.get(id) ?? null;
}

export function getAllMockUsers(): UserProfile[] {
  if (hasSupabaseEnv()) {
    return [];
  }
  return [...MOCK_USERS];
}

export function resolveUserIdForListing(listing: Listing): string {
  if (listing.userId) {
    return listing.userId;
  }
  if (!hasSupabaseEnv()) {
    return (
      WHATSAPP_TO_USER_ID[listing.whatsapp.replace(/\s/g, "")] ??
      WHATSAPP_TO_USER_ID[listing.whatsapp] ??
      DEFAULT_MOCK_USER_ID
    );
  }
  return "guest";
}

/** Public-safe yazar özeti — telefon/email içermez */
export function resolveListingAuthor(listing: Listing): ListingAuthorSnapshot {
  if (listing.authorSnapshot) {
    return listing.authorSnapshot;
  }

  if (hasSupabaseEnv()) {
    return {
      userId: listing.userId ?? "guest",
      displayName: maskContactName(listing.contactName),
      userType: "bireysel",
      trustScore: 0,
      ratingAverage: 0,
      ratingCount: 0,
      badges: [],
      isVerified: false,
      completedTransactionCount: 0,
    };
  }

  const userId = resolveUserIdForListing(listing);
  const user = getUserById(userId);

  if (!user) {
    return {
      userId,
      displayName: listing.contactName,
      userType: "bireysel",
      trustScore: 60,
      ratingAverage: 0,
      ratingCount: 0,
      badges: [],
      isVerified: false,
      completedTransactionCount: 0,
    };
  }

  return {
    userId: user.id,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    userType: user.userType,
    trustScore: user.trustScore,
    ratingAverage: user.ratingAverage,
    ratingCount: user.ratingCount,
    badges: user.badges,
    isVerified: user.isVerified,
    completedTransactionCount: user.completedTransactionCount,
  };
}

export function attachUserIdToListing<T extends Listing>(listing: T): T & { userId: string } {
  const userId = resolveUserIdForListing(listing);
  return { ...listing, userId };
}

export function getCarrierProfile(userId: string): CarrierProfile | null {
  if (hasSupabaseEnv()) {
    return null;
  }
  return MOCK_CARRIER_PROFILES.find((c) => c.userId === userId) ?? null;
}

export function getDisplayNameForUserId(userId: string): string {
  if (hasSupabaseEnv()) {
    return "Kullanıcı";
  }
  return getUserById(userId)?.displayName ?? "Kullanıcı";
}
