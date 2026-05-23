import Link from "next/link";
import { AuthorAvatar } from "@/components/listings/AuthorAvatar";
import { UserRatingSummary } from "@/components/users/UserRatingSummary";
import { UserTrustBadge } from "@/components/users/UserTrustBadge";
import { USER_TYPE_LABELS } from "@/lib/constants/user-labels";
import { USER_BADGE_LABELS } from "@/lib/constants/user-labels";
import type { ListingAuthorSnapshot } from "@/types/user-profile";

interface ListingAuthorTrustStripProps {
  author: ListingAuthorSnapshot;
  contactName?: string;
  compact?: boolean;
}

export function ListingAuthorTrustStrip({
  author,
  contactName,
  compact = false,
}: ListingAuthorTrustStripProps) {
  const phoneBadge = author.badges.includes("telefon-dogrulandi");

  return (
    <div
      className={`flex items-center gap-2 ${compact ? "min-w-0" : ""}`}
    >
      <AuthorAvatar
        name={author.displayName}
        imageUrl={author.avatarUrl}
        size="sm"
      />
      <div className="min-w-0 flex-1">
        <Link
          href={`/profil/${author.userId}`}
          className={`block truncate font-medium text-navy-900 transition-smooth hover:text-accent ${
            compact ? "text-xs sm:text-sm" : "text-sm"
          }`}
        >
          {contactName ?? author.displayName}
        </Link>
        <div
          className={`mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 ${
            compact ? "text-[10px] sm:text-xs" : "text-xs"
          }`}
        >
          <span className="text-muted">{USER_TYPE_LABELS[author.userType]}</span>
          <span className="text-muted" aria-hidden>
            ·
          </span>
          <UserRatingSummary
            average={author.ratingAverage}
            count={author.ratingCount}
            compact
          />
          <span className="text-muted" aria-hidden>
            ·
          </span>
          <UserTrustBadge score={author.trustScore} />
          {phoneBadge && (
            <>
              <span className="hidden text-muted sm:inline" aria-hidden>
                ·
              </span>
              <span className="hidden truncate text-muted sm:inline">
                {USER_BADGE_LABELS["telefon-dogrulandi"]}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
