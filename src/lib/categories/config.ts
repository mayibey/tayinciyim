import type { CategorySlug } from "@/types/listing";

export type FilterFieldType =
  | "text"
  | "select"
  | "checkbox"
  | "number-range";

export interface FilterFieldConfig {
  key: string;
  label: string;
  type: FilterFieldType;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface CategoryConfig {
  slug: CategorySlug;
  label: string;
  description: string;
  color: string;
  accentBar: string;
  iconBg: string;
  requiredFields: string[];
  filterFields: FilterFieldConfig[];
  minPhotos: number;
  requiresRoute: boolean;
}

export const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    slug: "ev-devri",
    label: "Ev Devri",
    description: "Kiralık ev devretme ve devralma ilanları",
    color: "bg-navy-900/8 text-navy-800 ring-1 ring-navy-900/10",
    accentBar: "bg-navy-700",
    iconBg: "bg-navy-900/10 text-navy-800",
    minPhotos: 1,
    requiresRoute: false,
    requiredFields: [
      "title",
      "description",
      "contactName",
      "whatsapp",
      "cityFrom",
      "districtFrom",
      "neighborhood",
      "roomCount",
      "rentPrice",
      "furnished",
    ],
    filterFields: [
      { key: "sehir", label: "Şehir", type: "text", placeholder: "Ankara" },
      { key: "ilce", label: "İlçe", type: "text", placeholder: "Çankaya" },
      { key: "kiraMin", label: "Min kira", type: "text", placeholder: "10000" },
      { key: "kiraMax", label: "Max kira", type: "text", placeholder: "25000" },
      {
        key: "oda",
        label: "Oda sayısı",
        type: "select",
        options: [
          { value: "", label: "Tümü" },
          { value: "1+1", label: "1+1" },
          { value: "2+1", label: "2+1" },
          { value: "3+1", label: "3+1" },
          { value: "4+1", label: "4+1" },
        ],
      },
      {
        key: "esyali",
        label: "Eşyalı",
        type: "select",
        options: [
          { value: "", label: "Tümü" },
          { value: "evet", label: "Eşyalı" },
          { value: "hayır", label: "Eşyasız" },
        ],
      },
      {
        key: "asansor",
        label: "Asansör",
        type: "checkbox",
      },
      {
        key: "memuraUygun",
        label: "Memura uygun",
        type: "checkbox",
      },
    ],
  },
  {
    slug: "esya-devri",
    label: "Eşya Devri / Satış",
    description:
      "Tayin nedeniyle satılan, devredilen, ücretsiz verilen veya takas edilen eşyaları listeleyin.",
    color: "bg-accent-soft text-accent ring-1 ring-accent/20",
    accentBar: "bg-accent",
    iconBg: "bg-accent-soft text-accent",
    minPhotos: 1,
    requiresRoute: false,
    requiredFields: [
      "title",
      "description",
      "contactName",
      "whatsapp",
      "cityFrom",
      "itemCategory",
      "condition",
      "quantity",
      "listingIntent",
    ],
    filterFields: [
      { key: "sehir", label: "Şehir", type: "text", placeholder: "İzmir" },
      {
        key: "ilanAmaci",
        label: "İlan amacı",
        type: "select",
        options: [
          { value: "", label: "Tümü" },
          { value: "satilik", label: "Satılık" },
          { value: "devredilecek", label: "Devredilecek" },
          { value: "ucretsiz", label: "Ücretsiz" },
          { value: "takas", label: "Takas" },
          { value: "komple-ev-esyasi", label: "Komple ev eşyası" },
        ],
      },
      { key: "satilik", label: "Satılık", type: "checkbox" },
      { key: "ucretsiz", label: "Ücretsiz", type: "checkbox" },
      { key: "takas", label: "Takas", type: "checkbox" },
      { key: "kompleEv", label: "Komple ev eşyası", type: "checkbox" },
      { key: "pazarlik", label: "Pazarlık var", type: "checkbox" },
      { key: "acil", label: "Acil", type: "checkbox" },
      { key: "fiyatMin", label: "Min fiyat (₺)", type: "text" },
      { key: "fiyatMax", label: "Max fiyat (₺)", type: "text" },
      {
        key: "esyaTuru",
        label: "Eşya türü",
        type: "select",
        options: [
          { value: "", label: "Tümü" },
          { value: "mobilya", label: "Mobilya" },
          { value: "beyaz-esya", label: "Beyaz eşya" },
          { value: "elektronik", label: "Elektronik" },
          { value: "cocuk-bebek", label: "Çocuk / bebek" },
        ],
      },
      {
        key: "durum",
        label: "Durum",
        type: "select",
        options: [
          { value: "", label: "Tümü" },
          { value: "yeni", label: "Yeni" },
          { value: "az-kullanilmis", label: "Az kullanılmış" },
          { value: "kullanilmis", label: "Kullanılmış" },
        ],
      },
    ],
  },
  {
    slug: "nakliye-ariyorum",
    label: "Nakliye Arıyorum",
    description: "Taşıma ihtiyacı olanlar için ilanlar",
    color: "bg-sky-50 text-sky-900 ring-1 ring-sky-200",
    accentBar: "bg-sky-600",
    iconBg: "bg-sky-100 text-sky-800",
    minPhotos: 0,
    requiresRoute: true,
    requiredFields: [
      "title",
      "description",
      "contactName",
      "whatsapp",
      "cityFrom",
      "cityTo",
      "loadType",
    ],
    filterFields: [
      { key: "nereden", label: "Nereden", type: "text", placeholder: "Ankara" },
      { key: "nereye", label: "Nereye", type: "text", placeholder: "İzmir" },
      { key: "tarih", label: "Tarih", type: "text", placeholder: "2026-06" },
      {
        key: "yukTipi",
        label: "Yük tipi",
        type: "select",
        options: [
          { value: "", label: "Tümü" },
          { value: "parca-esya", label: "Parça eşya" },
          { value: "2+1", label: "2+1" },
          { value: "komple-ev", label: "Komple ev" },
        ],
      },
      { key: "ortakNakliye", label: "Ortak nakliye", type: "checkbox" },
      { key: "asansorGerekli", label: "Asansör gerekli", type: "checkbox" },
    ],
  },
  {
    slug: "nakliyeci-arac-ilani",
    label: "Nakliyeci Araç İlanı",
    description: "Boş kapasitesi olan araç ve nakliyeci ilanları",
    color: "bg-indigo-50 text-indigo-900 ring-1 ring-indigo-200",
    accentBar: "bg-indigo-600",
    iconBg: "bg-indigo-100 text-indigo-800",
    minPhotos: 1,
    requiresRoute: true,
    requiredFields: [
      "title",
      "description",
      "contactName",
      "whatsapp",
      "cityFrom",
      "cityTo",
      "vehicleType",
      "departureDate",
    ],
    filterFields: [
      { key: "nereden", label: "Nereden", type: "text" },
      { key: "nereye", label: "Nereye", type: "text" },
      { key: "tarih", label: "Tarih", type: "text" },
      {
        key: "aracTipi",
        label: "Araç tipi",
        type: "select",
        options: [
          { value: "", label: "Tümü" },
          { value: "panelvan", label: "Panelvan" },
          { value: "kamyonet", label: "Kamyonet" },
          { value: "kamyon", label: "Kamyon" },
        ],
      },
      { key: "minKapasite", label: "Min boş kapasite %", type: "text", placeholder: "20" },
      { key: "sigortali", label: "Sigortalı taşıma", type: "checkbox" },
      { key: "asansorlu", label: "Asansörlü taşıma", type: "checkbox" },
      { key: "paketleme", label: "Paketleme hizmeti", type: "checkbox" },
    ],
  },
  {
    slug: "sehir-sorusu",
    label: "Şehir Sorusu",
    description: "Yeni şehir hakkında soru ve tavsiye",
    color: "bg-cream-200 text-navy-800 ring-1 ring-navy-900/10",
    accentBar: "bg-navy-800",
    iconBg: "bg-cream-200 text-navy-800",
    minPhotos: 0,
    requiresRoute: false,
    requiredFields: [
      "title",
      "description",
      "contactName",
      "whatsapp",
      "targetCity",
      "questionType",
      "officerGroup",
    ],
    filterFields: [
      { key: "sehir", label: "Şehir", type: "text" },
      { key: "ilce", label: "İlçe", type: "text" },
      {
        key: "soruTipi",
        label: "Soru tipi",
        type: "select",
        options: [
          { value: "", label: "Tümü" },
          { value: "mahalle", label: "Mahalle" },
          { value: "okul", label: "Okul" },
          { value: "kira", label: "Kira" },
          { value: "genel", label: "Genel" },
        ],
      },
      {
        key: "memurGrubu",
        label: "Memur grubu",
        type: "select",
        options: [
          { value: "", label: "Tümü" },
          { value: "ogretmen", label: "Öğretmen" },
          { value: "polis", label: "Polis" },
          { value: "saglikci", label: "Sağlıkçı" },
        ],
      },
      {
        key: "cevapDurumu",
        label: "Cevap durumu",
        type: "select",
        options: [
          { value: "", label: "Tümü" },
          { value: "cevap-bekliyor", label: "Cevap bekliyor" },
          { value: "cevaplandi", label: "Cevaplandı" },
        ],
      },
    ],
  },
  {
    slug: "hizmet-verenler",
    label: "Hizmet Verenler",
    description:
      "Tayin sonrası temizlik, boya, onarım, montaj ve yerleşme hizmetleri için güvenilir kişi ve firmaları bulun.",
    color: "bg-teal-50 text-teal-900 ring-1 ring-teal-200",
    accentBar: "bg-teal-600",
    iconBg: "bg-teal-100 text-teal-800",
    minPhotos: 0,
    requiresRoute: false,
    requiredFields: [
      "title",
      "description",
      "contactName",
      "whatsapp",
      "cityFrom",
      "serviceType",
      "priceType",
    ],
    filterFields: [
      {
        key: "hizmetTuru",
        label: "Hizmet türü",
        type: "select",
        options: [
          { value: "", label: "Tümü" },
          { value: "temizlik", label: "Temizlik" },
          { value: "boya-badana", label: "Boya / Badana" },
          { value: "ev-onarim", label: "Ev onarım" },
          { value: "tesisat", label: "Tesisat" },
          { value: "elektrik", label: "Elektrik" },
          { value: "mobilya-montaj", label: "Mobilya montaj" },
          { value: "perde-kornis", label: "Perde / Korniş" },
          { value: "klima-servisi", label: "Klima servisi" },
          { value: "internet-uydu", label: "İnternet / Uydu" },
          { value: "nakliye-yardimci-personel", label: "Nakliye yardımcı" },
          { value: "anahtar-cilingir", label: "Anahtar / Çilingir" },
          { value: "diger", label: "Diğer" },
        ],
      },
      { key: "sehir", label: "Şehir", type: "text", placeholder: "Ankara" },
      { key: "ilce", label: "İlçe", type: "text", placeholder: "Çankaya" },
      { key: "ayniGun", label: "Aynı gün hizmet", type: "checkbox" },
      { key: "haftaSonu", label: "Hafta sonu çalışır", type: "checkbox" },
      { key: "ekipman", label: "Ekipman getirir", type: "checkbox" },
      { key: "fatura", label: "Fatura kesebilir", type: "checkbox" },
      {
        key: "isletmeTipi",
        label: "İşletme tipi",
        type: "select",
        options: [
          { value: "", label: "Tümü" },
          { value: "bireysel", label: "Bireysel" },
          { value: "firma", label: "Firma" },
        ],
      },
      {
        key: "fiyatTipi",
        label: "Fiyatlandırma",
        type: "select",
        options: [
          { value: "", label: "Tümü" },
          { value: "teklif-al", label: "Teklif al" },
          { value: "sabit-fiyat", label: "Sabit fiyat" },
          { value: "saatlik", label: "Saatlik" },
          { value: "gunluk", label: "Günlük" },
          { value: "is-basina", label: "İş başına" },
        ],
      },
      { key: "minPuan", label: "Min. puan (1-5)", type: "text", placeholder: "4" },
      { key: "guvenMin", label: "Min. güven skoru", type: "text", placeholder: "70" },
    ],
  },
];

export function getCategoryConfig(slug: CategorySlug): CategoryConfig | undefined {
  return CATEGORY_CONFIGS.find((c) => c.slug === slug);
}

export const CATEGORIES = CATEGORY_CONFIGS;

export function getCategoryBySlug(slug: CategorySlug) {
  return getCategoryConfig(slug);
}
