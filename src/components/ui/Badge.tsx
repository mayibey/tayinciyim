import type { ListingStatus } from "@/types/listing";
import { LISTING_STATUS_LABELS } from "@/lib/constants/listing-status";

type BadgeVariant = "default" | "accent" | "navy" | "success" | "warning" | "muted";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-cream-200 text-navy-800 ring-1 ring-navy-900/10",
  accent: "bg-accent-soft text-accent ring-1 ring-accent/20",
  navy: "bg-navy-900/8 text-navy-800 ring-1 ring-navy-900/10",
  success: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200",
  warning: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
  muted: "bg-cream-100 text-muted ring-1 ring-navy-900/5",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "sm",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${variantStyles[variant]} ${
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
      } ${className}`}
    >
      {children}
    </span>
  );
}

const statusVariant: Record<ListingStatus, BadgeVariant> = {
  approved: "success",
  pending: "warning",
  rejected: "muted",
};

export function ListingStatusBadge({ status }: { status: ListingStatus }) {
  return (
    <Badge variant={statusVariant[status]} size="sm">
      {LISTING_STATUS_LABELS[status]}
    </Badge>
  );
}
