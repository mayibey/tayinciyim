import type { UserProfile } from "@/types/user-profile";

export type TrustScoreLabel =
  | "Çok Güvenilir"
  | "Güvenilir"
  | "Yeni / Orta"
  | "Dikkatli İncele";

export function getTrustScoreLabel(score: number): TrustScoreLabel {
  if (score >= 90) return "Çok Güvenilir";
  if (score >= 75) return "Güvenilir";
  if (score >= 60) return "Yeni / Orta";
  return "Dikkatli İncele";
}

export function getTrustScoreColor(score: number): string {
  if (score >= 90) return "text-emerald-700";
  if (score >= 75) return "text-sky-700";
  if (score >= 60) return "text-amber-800";
  return "text-red-700";
}

export function getTrustScoreBg(score: number): string {
  if (score >= 90) return "bg-emerald-50 ring-emerald-200";
  if (score >= 75) return "bg-sky-50 ring-sky-200";
  if (score >= 60) return "bg-amber-50 ring-amber-200";
  return "bg-red-50 ring-red-200";
}

/**
 * Mock güven skoru — production'da DB + doğrulama + şikayet verisiyle hesaplanır.
 * TODO: Supabase — gerçek trust score pipeline
 * TODO: anti-fake-review, moderation queue
 */
export function calculateMockTrustScore(user: UserProfile): number {
  let score = user.trustScore;

  if (user.isPhoneVerified) score += 0;
  if (user.isIdentityVerified) score = Math.min(100, score + 2);
  if (user.isCarrierVerified && user.userType === "nakliyeci") {
    score = Math.min(100, score + 1);
  }
  if (user.reportCount > 2) score -= 10;
  if (user.ratingCount >= 5 && user.ratingAverage >= 4.5) {
    score = Math.min(100, score + 2);
  }

  return Math.min(100, Math.max(0, Math.round(score)));
}
