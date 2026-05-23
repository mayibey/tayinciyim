import { MOCK_REVIEWS } from "@/lib/mock-data/reviews";
import { MOCK_TRANSACTIONS } from "@/lib/mock-data/transactions";
import { getUserById } from "@/lib/users/resolve-user";
import { getListings } from "@/lib/data/listings";
import { PUBLIC_LISTING_STATUS } from "@/lib/constants/listing-status";
import { resolveUserIdForListing } from "@/lib/users/resolve-user";
import type { Listing } from "@/types/listing";
import type { Review, TransactionHistory, UserProfile } from "@/types/user-profile";

// TODO: Supabase Auth — session user
// TODO: moderation queue for reports

export async function getUserProfileById(id: string): Promise<UserProfile | null> {
  return getUserById(id);
}

export async function getReviewsForUser(userId: string): Promise<Review[]> {
  // TODO: verified transaction review filter in production
  return MOCK_REVIEWS.filter((r) => r.toUserId === userId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function getTransactionsForUser(
  userId: string,
): Promise<TransactionHistory[]> {
  return MOCK_TRANSACTIONS.filter(
    (t) => t.fromUserId === userId || t.toUserId === userId,
  ).sort(
    (a, b) =>
      new Date(b.completedAt ?? 0).getTime() -
      new Date(a.completedAt ?? 0).getTime(),
  );
}

export async function getActiveListingsForUser(userId: string): Promise<Listing[]> {
  const all = await getListings({ status: PUBLIC_LISTING_STATUS });
  return all.filter((l) => resolveUserIdForListing(l) === userId);
}

export async function getReviewAuthorName(userId: string): Promise<string> {
  return getUserById(userId)?.displayName ?? "Kullanıcı";
}
