import { USER_BADGE_LABELS } from "@/lib/constants/user-labels";
import type { UserBadge } from "@/types/user-profile";

const BADGE_STYLES: Partial<Record<UserBadge, string>> = {
  "telefon-dogrulandi": "bg-sky-50 text-sky-800 ring-sky-200",
  "eposta-dogrulandi": "bg-violet-50 text-violet-800 ring-violet-200",
  "onayli-nakliyeci": "bg-emerald-50 text-emerald-800 ring-emerald-200",
  "guvenilir-kullanici": "bg-navy-50 text-navy-800 ring-navy-200",
  "hizli-donus": "bg-amber-50 text-amber-900 ring-amber-200",
  "deneyimli-tasiyici": "bg-cream-100 text-navy-800 ring-navy-200",
  "yeni-uye": "bg-cream-200 text-muted ring-[var(--border)]",
  "premium-firma": "bg-gradient-to-r from-accent/10 to-amber-100 text-navy-900 ring-accent/30",
  "onayli-hizmet-veren": "bg-teal-50 text-teal-900 ring-teal-200",
  "hizli-servis": "bg-sky-50 text-sky-900 ring-sky-200",
  "deneyimli-usta": "bg-cream-100 text-navy-900 ring-navy-200",
};

interface UserVerificationBadgesProps {
  badges: UserBadge[];
  max?: number;
  size?: "sm" | "md";
}

export function UserVerificationBadges({
  badges,
  max = 4,
  size = "sm",
}: UserVerificationBadgesProps) {
  const visible = badges.slice(0, max);
  if (visible.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Doğrulama rozetleri">
      {visible.map((badge) => (
        <li
          key={badge}
          className={`rounded-full font-semibold ring-1 ${
            BADGE_STYLES[badge] ?? "bg-cream-100 text-navy-800 ring-[var(--border)]"
          } ${size === "md" ? "px-2.5 py-0.5 text-xs" : "px-2 py-0.5 text-[10px]"}`}
        >
          {USER_BADGE_LABELS[badge]}
        </li>
      ))}
    </ul>
  );
}
