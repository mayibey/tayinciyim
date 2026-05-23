import type { Listing } from "@/types/listing";
import type { UserProfile } from "@/types/user-profile";

/** Telefon / WhatsApp maskeleme — son 2 hane görünür */
export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 4) return "***";
  if (digits.length <= 6) return `${digits.slice(0, 2)}***`;
  return `${digits.slice(0, 3)} *** ** ${digits.slice(-2)}`;
}

export function maskEmail(email: string): string {
  const trimmed = email.trim();
  const at = trimmed.indexOf("@");
  if (at < 1) return "***@***";
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  const maskedLocal =
    local.length <= 2 ? `${local[0] ?? "*"}*` : `${local.slice(0, 2)}***`;
  return `${maskedLocal}@${domain}`;
}

export function maskContactName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "İlan sahibi";
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1]![0]}.`;
}

/** Public liste / detay — iletişim reveal action ile açılır */
export function getPublicListingView(listing: Listing): Listing {
  return {
    ...listing,
    contactName: maskContactName(listing.contactName),
    whatsapp: "",
  };
}

/** Admin panel — tam iletişim */
export function getAdminListingView(listing: Listing): Listing {
  return listing;
}

export function getPublicProfileView(profile: UserProfile): UserProfile {
  return {
    ...profile,
    phone: profile.phone ? maskPhone(profile.phone) : "",
    whatsapp: profile.whatsapp ? maskPhone(profile.whatsapp) : "",
    email: profile.email ? maskEmail(profile.email) : undefined,
  };
}

export function getAdminProfileView(profile: UserProfile): UserProfile {
  return profile;
}
