import { AuthorAvatar } from "@/components/listings/AuthorAvatar";
import { REVIEW_TAG_LABELS } from "@/lib/constants/user-labels";
import { formatRelativeDate } from "@/lib/utils";
import { getUserById } from "@/lib/users/resolve-user";
import type { Review } from "@/types/user-profile";

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-muted">Henüz yorum bulunmuyor.</p>
    );
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => {
        const author = getUserById(review.fromUserId);
        const displayName =
          review.fromUserDisplayName ??
          author?.displayName ??
          "Doğrulanmış kullanıcı";
        const avatarUrl = review.fromUserAvatarUrl ?? author?.avatarUrl;
        return (
          <li
            key={review.id}
            className="rounded-2xl border border-[var(--border)] bg-cream-50/50 p-4 sm:p-5"
          >
            <div className="flex items-start gap-3">
              <AuthorAvatar
                name={displayName}
                imageUrl={avatarUrl}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-navy-900">
                    {displayName}
                  </p>
                  <time className="text-xs text-muted" dateTime={review.createdAt}>
                    {formatRelativeDate(review.createdAt)}
                  </time>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-amber-500 text-sm" aria-label={`${review.rating} yıldız`}>
                    {"★".repeat(review.rating)}
                    <span className="text-cream-300">{"★".repeat(5 - review.rating)}</span>
                  </span>
                  {review.isVerifiedTransaction && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 ring-1 ring-emerald-200">
                      Doğrulanmış işlem
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-navy-800/90">
                  {review.comment}
                </p>
                {review.reviewTags.length > 0 && (
                  <ul className="mt-2 flex flex-wrap gap-1">
                    {review.reviewTags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-md bg-card px-2 py-0.5 text-[10px] font-medium text-muted ring-1 ring-[var(--border)]"
                      >
                        {REVIEW_TAG_LABELS[tag]}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
