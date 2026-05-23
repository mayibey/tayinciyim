import "server-only";

import { MOCK_REVIEWS } from "@/lib/mock-data/reviews";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseAnonServerClient } from "@/lib/supabase/server";
import type { Review, ReviewTag } from "@/types/user-profile";

interface ReviewRow {
  id: string;
  from_user_id: string | null;
  to_user_id: string;
  listing_id: string | null;
  rating: number;
  comment: string | null;
  review_tags: ReviewTag[] | null;
  is_verified_transaction: boolean | null;
  created_at: string;
}

function mapReviewRow(row: ReviewRow): Review {
  return {
    id: row.id,
    fromUserId: row.from_user_id ?? "unknown",
    toUserId: row.to_user_id,
    listingId: row.listing_id ?? undefined,
    rating: row.rating,
    comment: row.comment ?? "",
    reviewTags: Array.isArray(row.review_tags) ? row.review_tags : [],
    createdAt: row.created_at,
    isVerifiedTransaction: row.is_verified_transaction ?? false,
  };
}

async function supabaseGetReviewsForUser(userId: string): Promise<Review[]> {
  const client = createSupabaseAnonServerClient();
  if (!client) return [];

  const { data, error } = await client
    .from("reviews")
    .select("*")
    .eq("to_user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as ReviewRow[]).map(mapReviewRow);
}

export async function getReviewsForUser(userId: string): Promise<Review[]> {
  if (!hasSupabaseEnv()) {
    return MOCK_REVIEWS.filter((r) => r.toUserId === userId).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }
  return supabaseGetReviewsForUser(userId);
}
