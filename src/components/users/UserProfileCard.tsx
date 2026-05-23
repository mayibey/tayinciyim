import Link from "next/link";
import type { ReactNode } from "react";
import { AuthorAvatar } from "@/components/listings/AuthorAvatar";
import { UserRatingSummary } from "@/components/users/UserRatingSummary";
import { UserTrustBadge } from "@/components/users/UserTrustBadge";
import { UserVerificationBadges } from "@/components/users/UserVerificationBadges";
import {
  OFFICER_GROUP_PROFILE_LABELS,
  USER_TYPE_LABELS,
} from "@/lib/constants/user-labels";
import { formatDate } from "@/lib/utils";
import type { UserProfile } from "@/types/user-profile";

interface UserProfileCardProps {
  user: UserProfile;
  showBio?: boolean;
}

export function UserProfileCard({ user, showBio = true }: UserProfileCardProps) {
  const officerLabel =
    user.officerGroup !== "none"
      ? OFFICER_GROUP_PROFILE_LABELS[user.officerGroup]
      : null;

  return (
    <div className="card-surface-lg overflow-hidden p-0">
      <div className="h-1 w-full bg-gradient-to-r from-navy-800 to-accent" />
      <div className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <AuthorAvatar
            name={user.displayName}
            imageUrl={user.avatarUrl}
            size="lg"
            className="h-20 w-20 text-lg"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">
                {user.displayName}
              </h1>
              {user.isVerified && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                  Doğrulanmış
                </span>
              )}
            </div>
            <p className="mt-1 text-sm font-medium text-muted">
              {USER_TYPE_LABELS[user.userType]}
              {officerLabel ? ` · ${officerLabel}` : ""}
              {" · "}
              {[user.city, user.district].filter(Boolean).join(", ")}
            </p>
            <p className="mt-1 text-xs text-muted">
              Katılım: {formatDate(user.joinedAt)}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <UserRatingSummary average={user.ratingAverage} count={user.ratingCount} />
              <UserTrustBadge score={user.trustScore} showLabel />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="İşlem" value={String(user.completedTransactionCount)} />
              <Stat label="Aktif ilan" value={String(user.activeListingCount)} />
              <Stat label="Yanıt oranı" value={`%${user.responseRate}`} />
              <Stat label="Yanıt süresi" value={user.averageResponseTime} />
            </div>

            <div className="mt-4">
              <UserVerificationBadges badges={user.badges} max={6} size="md" />
            </div>

            {showBio && user.bio && (
              <p className="mt-4 text-sm leading-relaxed text-navy-800/90">{user.bio}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-cream-50 px-3 py-2 ring-1 ring-[var(--border)]">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="text-sm font-bold text-navy-900">{value}</p>
    </div>
  );
}

export function UserProfileLink({
  userId,
  children,
  className = "",
}: {
  userId: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={`/profil/${userId}`} className={`font-semibold text-accent hover:underline ${className}`}>
      {children}
    </Link>
  );
}
