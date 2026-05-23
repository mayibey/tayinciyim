import type { CategorySlug } from "@/types/listing";
import type { OfficerGroup, VehicleType } from "@/types/listing-fields";

export type UserType =
  | "memur"
  | "nakliyeci"
  | "ev-sahibi"
  | "emlakci"
  | "bireysel"
  | "hizmet-veren";

export type UserBadge =
  | "telefon-dogrulandi"
  | "eposta-dogrulandi"
  | "onayli-nakliyeci"
  | "guvenilir-kullanici"
  | "hizli-donus"
  | "deneyimli-tasiyici"
  | "yeni-uye"
  | "premium-firma"
  | "onayli-hizmet-veren"
  | "hizli-servis"
  | "deneyimli-usta";

export type VerificationStatus = "pending" | "verified" | "rejected" | "none";

export interface UserProfile {
  id: string;
  fullName: string;
  displayName: string;
  avatarUrl?: string;
  userType: UserType;
  officerGroup: OfficerGroup | "none";
  city: string;
  district?: string;
  phone: string;
  whatsapp: string;
  email?: string;
  bio?: string;
  joinedAt: string;
  lastActiveAt: string;
  isVerified: boolean;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  isIdentityVerified: boolean;
  isCarrierVerified: boolean;
  trustScore: number;
  ratingAverage: number;
  ratingCount: number;
  completedTransactionCount: number;
  activeListingCount: number;
  reportCount: number;
  responseRate: number;
  averageResponseTime: string;
  badges: UserBadge[];
}

export interface CarrierProfile {
  userId: string;
  companyName: string;
  taxOrRegistrationNote?: string;
  serviceCities: string[];
  vehicleTypes: VehicleType[];
  hasLiftService: boolean;
  hasPackingService: boolean;
  hasInsurance: boolean;
  totalMoves: number;
  completedMoves: number;
  cancelledMoves: number;
  vehicleCount: number;
  verificationStatus: VerificationStatus;
  documentsNote?: string;
  workingHours?: string;
  serviceDescription?: string;
}

export type TransactionType =
  | "ev-devri"
  | "esya-satis"
  | "nakliye"
  | "sehir-yardimi";

export type TransactionStatus =
  | "devam-ediyor"
  | "tamamlandi"
  | "iptal"
  | "sorunlu";

export interface TransactionHistory {
  id: string;
  listingId?: string;
  listingTitle: string;
  listingCategory: CategorySlug;
  fromUserId: string;
  toUserId: string;
  transactionType: TransactionType;
  status: TransactionStatus;
  completedAt?: string;
  ratingGiven?: number;
  reviewId?: string;
}

export type ReviewTag =
  | "zamaninda-geldi"
  | "guvenilir"
  | "iletisim-iyi"
  | "esya-durum-dogru"
  | "temiz-teslim"
  | "fiyat-adil"
  | "profesyonel"
  | "tavsiye-ederim";

export interface Review {
  id: string;
  fromUserId: string;
  toUserId: string;
  listingId?: string;
  rating: number;
  comment: string;
  reviewTags: ReviewTag[];
  createdAt: string;
  isVerifiedTransaction: boolean;
}

/** İlan kartı / detay için çözümlenmiş yazar özeti */
export interface ListingAuthorSnapshot {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  userType: UserType;
  trustScore: number;
  ratingAverage: number;
  ratingCount: number;
  badges: UserBadge[];
  isVerified: boolean;
  completedTransactionCount: number;
}
