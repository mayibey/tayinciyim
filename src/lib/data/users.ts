import { getListings } from "@/lib/data/listings";
import { getReviewsForUser } from "@/lib/data/reviews-repository";
import { getTransactionsForUser } from "@/lib/data/transactions-repository";
import {
  getPublicProfilesByIds,
  getPublicUserProfileById,
  NEUTRAL_AUTHOR_LABEL,
} from "@/lib/data/users-repository";
import { PUBLIC_LISTING_STATUS } from "@/lib/constants/listing-status";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { resolveUserIdForListing } from "@/lib/users/resolve-user";
import { getUserById } from "@/lib/users/resolve-user";
import type { Listing } from "@/types/listing";
import type { Review, TransactionHistory, UserProfile } from "@/types/user-profile";

export async function getUserProfileById(id: string): Promise<UserProfile | null> {
  return getPublicUserProfileById(id);
}

export async function getReviewsForUserProfile(userId: string): Promise<Review[]> {
  const reviews = await getReviewsForUser(userId);
  if (reviews.length === 0) return reviews;

  const authorIds = reviews.map((r) => r.fromUserId);
  const profiles = await getPublicProfilesByIds(authorIds);

  return reviews.map((review) => {
    const profile = profiles.get(review.fromUserId);
    if (profile) {
      return {
        ...review,
        fromUserDisplayName: profile.displayName,
        fromUserAvatarUrl: profile.avatarUrl,
      };
    }
    if (hasSupabaseEnv()) {
      return {
        ...review,
        fromUserDisplayName: NEUTRAL_AUTHOR_LABEL,
      };
    }
    const mockAuthor = getUserById(review.fromUserId);
    return {
      ...review,
      fromUserDisplayName: mockAuthor?.displayName ?? NEUTRAL_AUTHOR_LABEL,
      fromUserAvatarUrl: mockAuthor?.avatarUrl,
    };
  });
}

export async function getTransactionsForUserProfile(
  userId: string,
): Promise<TransactionHistory[]> {
  return getTransactionsForUser(userId);
}

export async function getActiveListingsForUser(userId: string): Promise<Listing[]> {
  const all = await getListings({ status: PUBLIC_LISTING_STATUS });
  return all.filter((l) => resolveUserIdForListing(l) === userId);
}

export async function getReviewAuthorName(userId: string): Promise<string> {
  const profile = await getPublicUserProfileById(userId);
  if (profile) return profile.displayName;
  if (hasSupabaseEnv()) return NEUTRAL_AUTHOR_LABEL;
  return getUserById(userId)?.displayName ?? NEUTRAL_AUTHOR_LABEL;
}
