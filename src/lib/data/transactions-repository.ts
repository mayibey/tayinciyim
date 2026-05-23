import "server-only";

import { MOCK_TRANSACTIONS } from "@/lib/mock-data/transactions";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseAnonServerClient } from "@/lib/supabase/server";
import type { CategorySlug } from "@/types/listing";
import type {
  TransactionHistory,
  TransactionStatus,
  TransactionType,
} from "@/types/user-profile";

interface TransactionRow {
  id: string;
  listing_id: string | null;
  listing_title: string | null;
  listing_category: string | null;
  from_user_id: string | null;
  to_user_id: string | null;
  transaction_type: string | null;
  status: string | null;
  completed_at: string | null;
  rating_given: boolean | null;
  review_id: string | null;
  created_at: string;
}

const TX_TYPES: TransactionType[] = [
  "ev-devri",
  "esya-satis",
  "nakliye",
  "sehir-yardimi",
];

const TX_STATUS: TransactionStatus[] = [
  "devam-ediyor",
  "tamamlandi",
  "iptal",
  "sorunlu",
];

function mapTransactionRow(row: TransactionRow): TransactionHistory {
  const category = row.listing_category as CategorySlug;
  return {
    id: row.id,
    listingId: row.listing_id ?? undefined,
    listingTitle: row.listing_title ?? "İlan",
    listingCategory: category ?? "ev-devri",
    fromUserId: row.from_user_id ?? "unknown",
    toUserId: row.to_user_id ?? "unknown",
    transactionType: TX_TYPES.includes(row.transaction_type as TransactionType)
      ? (row.transaction_type as TransactionType)
      : "ev-devri",
    status: TX_STATUS.includes(row.status as TransactionStatus)
      ? (row.status as TransactionStatus)
      : "devam-ediyor",
    completedAt: row.completed_at ?? undefined,
    reviewId: row.review_id ?? undefined,
  };
}

async function supabaseGetTransactionsForUser(userId: string): Promise<TransactionHistory[]> {
  const client = createSupabaseAnonServerClient();
  if (!client) return [];

  const { data, error } = await client
    .from("transactions")
    .select("*")
    .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as TransactionRow[]).map(mapTransactionRow);
}

export async function getTransactionsForUser(
  userId: string,
): Promise<TransactionHistory[]> {
  if (!hasSupabaseEnv()) {
    return MOCK_TRANSACTIONS.filter(
      (t) => t.fromUserId === userId || t.toUserId === userId,
    ).sort(
      (a, b) =>
        new Date(b.completedAt ?? 0).getTime() -
        new Date(a.completedAt ?? 0).getTime(),
    );
  }
  return supabaseGetTransactionsForUser(userId);
}
