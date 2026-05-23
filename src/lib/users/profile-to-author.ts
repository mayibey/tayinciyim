import type { UserProfile } from "@/types/user-profile";
import type { ListingAuthorSnapshot } from "@/types/user-profile";

export function profileToAuthorSnapshot(profile: UserProfile): ListingAuthorSnapshot {
  return {
    userId: profile.id,
    displayName: profile.displayName,
    avatarUrl: profile.avatarUrl,
    userType: profile.userType,
    trustScore: profile.trustScore,
    ratingAverage: profile.ratingAverage,
    ratingCount: profile.ratingCount,
    badges: profile.badges,
    isVerified: profile.isVerified,
    completedTransactionCount: profile.completedTransactionCount,
  };
}
