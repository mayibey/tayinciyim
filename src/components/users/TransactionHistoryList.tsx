import { CategoryBadge } from "@/components/listings/CategoryBadge";
import {
  TRANSACTION_STATUS_LABELS,
  TRANSACTION_TYPE_LABELS,
} from "@/lib/constants/user-labels";
import { formatDate } from "@/lib/utils";
import type { TransactionHistory } from "@/types/user-profile";

interface TransactionHistoryListProps {
  transactions: TransactionHistory[];
}

const STATUS_COLORS: Record<string, string> = {
  tamamlandi: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  "devam-ediyor": "bg-sky-50 text-sky-800 ring-sky-200",
  iptal: "bg-cream-200 text-muted ring-[var(--border)]",
  sorunlu: "bg-red-50 text-red-800 ring-red-200",
};

export function TransactionHistoryList({
  transactions,
}: TransactionHistoryListProps) {
  if (transactions.length === 0) {
    return <p className="text-sm text-muted">Tamamlanan işlem kaydı yok.</p>;
  }

  return (
    <ul className="divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-card overflow-hidden">
      {transactions.map((txn) => (
        <li key={txn.id} className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="min-w-0">
            <p className="font-medium text-navy-900 truncate">{txn.listingTitle}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <CategoryBadge slug={txn.listingCategory} />
              <span className="text-xs text-muted">
                {TRANSACTION_TYPE_LABELS[txn.transactionType]}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${
                STATUS_COLORS[txn.status] ?? "bg-cream-100 text-navy-800"
              }`}
            >
              {TRANSACTION_STATUS_LABELS[txn.status]}
            </span>
            {txn.completedAt && (
              <time className="text-xs text-muted" dateTime={txn.completedAt}>
                {formatDate(txn.completedAt)}
              </time>
            )}
            {txn.ratingGiven != null && (
              <span className="text-xs font-semibold text-amber-600">
                ★ {txn.ratingGiven}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
