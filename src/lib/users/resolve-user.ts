import {
  DEFAULT_MOCK_USER_ID,
  MOCK_CARRIER_PROFILES,
  MOCK_USERS,
  WHATSAPP_TO_USER_ID,
} from "@/lib/mock-data/users";
import type { Listing } from "@/types/listing";
import type {
  CarrierProfile,
  ListingAuthorSnapshot,
  UserProfile,
} from "@/types/user-profile";

// TODO: Supabase Auth — oturum açmış kullanıcı
// TODO: phone verification, identity verification

const userById = new Map(MOCK_USERS.map((u) => [u.id, u]));

export function getUserById(id: string): UserProfile | null {
  if (id) {
    // TODO: Supabase — profiles tablosu
    return userById.get(id) ?? null;
  }
  return null;
}

export function getAllMockUsers(): UserProfile[] {
  return [...MOCK_USERS];
}

export function resolveUserIdForListing(listing: Listing): string {
  if ("userId" in listing && typeof listing.userId === "string") {
    return listing.userId;
  }
  return (
    WHATSAPP_TO_USER_ID[listing.whatsapp.replace(/\s/g, "")] ??
    WHATSAPP_TO_USER_ID[listing.whatsapp] ??
    DEFAULT_MOCK_USER_ID
  );
}

export function resolveListingAuthor(listing: Listing): ListingAuthorSnapshot {
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
  return MOCK_CARRIER_PROFILES.find((c) => c.userId === userId) ?? null;
}

export function getDisplayNameForUserId(userId: string): string {
  return getUserById(userId)?.displayName ?? "Kullanıcı";
}
