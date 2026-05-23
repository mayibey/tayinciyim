"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { updateListingStatusAction } from "@/app/admin/actions";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { CategoryBadge } from "@/components/listings/CategoryBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { USER_TYPE_LABELS } from "@/lib/constants/user-labels";
import { formatDate } from "@/lib/utils";
import { getUserById, resolveListingAuthor } from "@/lib/users/resolve-user";
import type { Listing, ListingStatus } from "@/types/listing";

import { LISTING_STATUS_LABELS } from "@/lib/constants/listing-status";

interface AdminListingTableProps {
  listings: Listing[];
}

export function AdminListingTable({ listings }: AdminListingTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  function handleStatusChange(id: string, status: ListingStatus) {
    startTransition(async () => {
      const result = await updateListingStatusAction(id, status);
      if (!result.ok) {
        toast(result.message ?? "Güncellenemedi.", "error");
        return;
      }
      router.refresh();
    });
  }

  if (listings.length === 0) {
    return (
      <EmptyState
        icon="inbox"
        title="Henüz ilan yok"
        description="İlk ilan eklendiğinde burada listelenecek."
        actionLabel="İlan Ver"
        actionHref="/ilan-ver"
      />
    );
  }

  return (
    <div className="card-surface-lg overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-cream-100/80 text-muted">
            <tr>
              <th className="px-5 py-4 font-semibold">Başlık</th>
              <th className="px-5 py-4 font-semibold">İlan sahibi</th>
              <th className="px-5 py-4 font-semibold">Tip</th>
              <th className="px-5 py-4 font-semibold">Güven</th>
              <th className="px-5 py-4 font-semibold">Şikayet</th>
              <th className="px-5 py-4 font-semibold">Kategori</th>
              <th className="px-5 py-4 font-semibold">Şehir</th>
              <th className="px-5 py-4 font-semibold">Tarih</th>
              <th className="px-5 py-4 font-semibold">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {listings.map((listing) => {
              const author = resolveListingAuthor(listing);
              const user = getUserById(author.userId);
              return (
              <tr
                key={listing.id}
                className="transition-smooth hover:bg-cream-50/80"
              >
                <td className="max-w-[200px] truncate px-5 py-4 font-medium text-navy-900">
                  {listing.title}
                </td>
                <td className="max-w-[140px] truncate px-5 py-4 text-navy-800">
                  {listing.contactName}
                </td>
                <td className="px-5 py-4 text-navy-800">
                  {USER_TYPE_LABELS[author.userType]}
                </td>
                <td className="px-5 py-4 font-semibold tabular-nums text-navy-900">
                  {author.trustScore}
                </td>
                <td className="px-5 py-4 tabular-nums">
                  <span
                    className={
                      (user?.reportCount ?? listing.reportCount) > 0
                        ? "font-semibold text-red-700"
                        : "text-muted"
                    }
                  >
                    {user?.reportCount ?? listing.reportCount}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <CategoryBadge slug={listing.category} />
                </td>
                <td className="px-5 py-4 text-navy-800">{listing.cityFrom}</td>
                <td className="px-5 py-4 text-muted">
                  {formatDate(listing.createdAt)}
                </td>
                <td className="px-5 py-4">
                  <select
                    value={listing.status}
                    disabled={pending}
                    onChange={(e) =>
                      handleStatusChange(
                        listing.id,
                        e.target.value as ListingStatus,
                      )
                    }
                    className="rounded-xl border border-navy-900/10 bg-cream-50 px-3 py-1.5 text-sm font-medium text-navy-900 transition-smooth focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 disabled:opacity-50"
                    aria-label={`${listing.title} durumu`}
                  >
                  {(Object.keys(LISTING_STATUS_LABELS) as ListingStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {LISTING_STATUS_LABELS[s]}
                    </option>
                  ))}
                  </select>
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
