import "server-only";

import {
  getPublicUserProfileById,
  NEUTRAL_AUTHOR_LABEL,
} from "@/lib/data/users-repository";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { profileToAuthorSnapshot } from "@/lib/users/profile-to-author";
import { resolveListingAuthor } from "@/lib/users/resolve-user";
import type { Listing } from "@/types/listing";
import type { ListingAuthorSnapshot } from "@/types/user-profile";

/** Detay sayfası — public_profiles view (server-only) */
export async function resolveListingAuthorAsync(
  listing: Listing,
): Promise<ListingAuthorSnapshot> {
  if (listing.authorSnapshot) {
    return listing.authorSnapshot;
  }

  if (!hasSupabaseEnv()) {
    return resolveListingAuthor(listing);
  }

  const userId = listing.userId;
  if (userId) {
    const profile = await getPublicUserProfileById(userId);
    if (profile) {
      return profileToAuthorSnapshot(profile);
    }
    return {
      userId,
      displayName: NEUTRAL_AUTHOR_LABEL,
      userType: "bireysel",
      trustScore: 0,
      ratingAverage: 0,
      ratingCount: 0,
      badges: [],
      isVerified: false,
      completedTransactionCount: 0,
    };
  }

  return resolveListingAuthor(listing);
}
