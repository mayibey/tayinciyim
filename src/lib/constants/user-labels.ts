import type {
  ReviewTag,
  TransactionStatus,
  TransactionType,
  UserBadge,
  UserType,
} from "@/types/user-profile";
import type { OfficerGroup } from "@/types/listing-fields";

export const USER_TYPE_LABELS: Record<UserType, string> = {
  memur: "Memur",
  nakliyeci: "Nakliyeci",
  "ev-sahibi": "Ev sahibi",
  emlakci: "Emlakçı",
  bireysel: "Bireysel",
  "hizmet-veren": "Hizmet veren",
};

export const OFFICER_GROUP_PROFILE_LABELS: Record<OfficerGroup | "none", string> = {
  ogretmen: "Öğretmen",
  polis: "Polis",
  jandarma: "Jandarma",
  saglikci: "Sağlık personeli",
  imam: "İmam",
  zabita: "Zabıta",
  diger: "Kamu personeli",
  none: "",
};

export const USER_BADGE_LABELS: Record<UserBadge, string> = {
  "telefon-dogrulandi": "Telefon doğrulandı",
  "eposta-dogrulandi": "E-posta doğrulandı",
  "onayli-nakliyeci": "Onaylı nakliyeci",
  "guvenilir-kullanici": "Güvenilir kullanıcı",
  "hizli-donus": "Hızlı dönüş",
  "deneyimli-tasiyici": "Deneyimli taşıyıcı",
  "yeni-uye": "Yeni üye",
  "premium-firma": "Premium firma",
  "onayli-hizmet-veren": "Onaylı hizmet veren",
  "hizli-servis": "Hızlı servis",
  "deneyimli-usta": "Deneyimli usta",
};

export const REVIEW_TAG_LABELS: Record<ReviewTag, string> = {
  "zamaninda-geldi": "Zamanında geldi",
  guvenilir: "Güvenilir",
  "iletisim-iyi": "İletişim iyi",
  "esya-durum-dogru": "Eşya durumu doğru",
  "temiz-teslim": "Temiz teslim",
  "fiyat-adil": "Fiyat adil",
  profesyonel: "Profesyonel",
  "tavsiye-ederim": "Tavsiye ederim",
};

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  "ev-devri": "Ev devri",
  "esya-satis": "Eşya satışı",
  nakliye: "Nakliye",
  "sehir-yardimi": "Şehir yardımı",
};

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  "devam-ediyor": "Devam ediyor",
  tamamlandi: "Tamamlandı",
  iptal: "İptal",
  sorunlu: "Sorunlu",
};
