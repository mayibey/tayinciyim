import type { ServicePriceType, ServiceType } from "@/types/listing-fields";

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  temizlik: "Temizlik",
  "boya-badana": "Boya / Badana",
  "ev-onarim": "Ev onarım",
  tesisat: "Tesisat",
  elektrik: "Elektrik",
  "mobilya-montaj": "Mobilya montaj",
  "perde-kornis": "Perde / Korniş",
  "klima-servisi": "Klima servisi",
  "internet-uydu": "İnternet / Uydu",
  "nakliye-yardimci-personel": "Nakliye yardımcı",
  "anahtar-cilingir": "Anahtar / Çilingir",
  diger: "Diğer",
};

export const SERVICE_PRICE_TYPE_LABELS: Record<ServicePriceType, string> = {
  "sabit-fiyat": "Sabit fiyat",
  "teklif-al": "Teklif al",
  saatlik: "Saatlik",
  gunluk: "Günlük",
  "is-basina": "İş başına",
};

export const SERVICE_TYPE_OPTIONS = Object.entries(SERVICE_TYPE_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export const SERVICE_PRICE_TYPE_OPTIONS = Object.entries(SERVICE_PRICE_TYPE_LABELS).map(
  ([value, label]) => ({ value, label }),
);
