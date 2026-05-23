import type {
  AnswerStatus,
  FurnishedStatus,
  ItemCategory,
  ItemCondition,
  ListingIntent,
  LoadType,
  OfficerGroup,
  PaymentPreference,
  PriceType,
  QuestionType,
  ReasonForSale,
  RoomCount,
  RoomEquivalent,
  VehicleType,
} from "@/types/listing-fields";

export const ROOM_COUNT_LABELS: Record<RoomCount, string> = {
  "1+0": "1+0",
  "1+1": "1+1",
  "2+1": "2+1",
  "3+1": "3+1",
  "4+1": "4+1",
  "5+1": "5+1",
};

export const FURNISHED_LABELS: Record<FurnishedStatus, string> = {
  evet: "Eşyalı",
  hayır: "Eşyasız",
  kısmen: "Kısmen eşyalı",
};

export const ITEM_CATEGORY_LABELS: Record<ItemCategory, string> = {
  "beyaz-esya": "Beyaz eşya",
  mobilya: "Mobilya",
  "cocuk-bebek": "Çocuk / bebek",
  elektronik: "Elektronik",
  mutfak: "Mutfak",
  "hali-perde": "Halı / perde",
  "komple-ev-esyasi": "Komple ev eşyası",
  ucretsiz: "Ücretsiz",
};

export const ITEM_CONDITION_LABELS: Record<ItemCondition, string> = {
  yeni: "Yeni",
  "az-kullanilmis": "Az kullanılmış",
  kullanilmis: "Kullanılmış",
  "tamir-gerekir": "Tamir gerekir",
};

export const LISTING_INTENT_LABELS: Record<ListingIntent, string> = {
  satilik: "Satılık",
  devredilecek: "Devredilecek",
  ucretsiz: "Ücretsiz",
  takas: "Takas",
  "komple-ev-esyasi": "Komple Ev Eşyası",
};

export const PAYMENT_PREFERENCE_LABELS: Record<PaymentPreference, string> = {
  nakit: "Nakit",
  havale: "Havale",
  elden: "Elden",
  "fark-etmez": "Fark Etmez",
};

export const REASON_FOR_SALE_LABELS: Record<ReasonForSale, string> = {
  tayin: "Tayin",
  "ev-kucultme": "Ev küçültme",
  yenileme: "Yenileme",
  "ihtiyac-fazlasi": "İhtiyaç fazlası",
  diger: "Diğer",
};

export const LOAD_TYPE_LABELS: Record<LoadType, string> = {
  "parca-esya": "Parça eşya",
  "1+1": "1+1",
  "2+1": "2+1",
  "3+1": "3+1",
  "4+1": "4+1",
  "komple-ev": "Komple ev",
  "beyaz-esya": "Beyaz eşya",
  koli: "Koli",
  ofis: "Ofis",
};

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  panelvan: "Panelvan",
  kamyonet: "Kamyonet",
  kamyon: "Kamyon",
  tir: "Tır",
};

export const ROOM_EQUIVALENT_LABELS: Record<RoomEquivalent, string> = {
  parca: "Parça eşya",
  "1+1": "1+1",
  "2+1": "2+1",
  "3+1": "3+1",
};

export const PRICE_TYPE_LABELS: Record<PriceType, string> = {
  "teklif-al": "Teklif al",
  "sabit-fiyat": "Sabit fiyat",
  "masraf-paylasimi": "Masraf paylaşımı",
};

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  mahalle: "Mahalle",
  okul: "Okul",
  ulasim: "Ulaşım",
  kira: "Kira",
  guvenlik: "Güvenlik",
  "kurum-cevresi": "Kurum çevresi",
  lojman: "Lojman",
  genel: "Genel",
};

export const OFFICER_GROUP_LABELS: Record<OfficerGroup, string> = {
  ogretmen: "Öğretmen",
  polis: "Polis",
  jandarma: "Jandarma",
  saglikci: "Sağlıkçı",
  imam: "İmam",
  zabita: "Zabıta",
  diger: "Diğer",
};

export const ANSWER_STATUS_LABELS: Record<AnswerStatus, string> = {
  "cevap-bekliyor": "Cevap bekliyor",
  cevaplandi: "Cevaplandı",
};
