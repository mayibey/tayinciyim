import type { ListingStatus } from "@/types/listing";

export const LISTING_STATUSES = ["pending", "approved", "rejected"] as const;

export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  pending: "Onay bekliyor",
  approved: "Yayında",
  rejected: "Reddedildi",
};

export const PUBLIC_LISTING_STATUS: ListingStatus = "approved";
