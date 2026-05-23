import { CATEGORIES } from "@/lib/categories";
import type { CategorySlug } from "@/types/listing";

const TITLE_MIN = 8;
const DESC_MIN = 20;

/** Türkiye cep: 05xx veya +90 5xx */
const TR_PHONE_REGEX = /^(?:\+90|90|0)?5\d{9}$/;

export function normalizeTurkishPhone(input: string): string {
  return input.replace(/\s|[\-(.)]/g, "");
}

export function isValidTurkishMobile(input: string): boolean {
  const normalized = normalizeTurkishPhone(input);
  return TR_PHONE_REGEX.test(normalized);
}

export interface ListingFormInput {
  title: string;
  description: string;
  category: string;
  city: string;
  district: string;
  authorName: string;
  whatsapp: string;
  price: string;
}

export function validateListingForm(input: ListingFormInput): {
  ok: boolean;
  fieldErrors: Record<string, string>;
  data?: {
    title: string;
    description: string;
    category: CategorySlug;
    city: string;
    district: string;
    authorName: string;
    whatsapp: string;
    price?: number;
  };
} {
  const fieldErrors: Record<string, string> = {};

  const title = input.title.trim();
  const description = input.description.trim();
  const category = input.category.trim();
  const city = input.city.trim();
  const district = input.district.trim();
  const authorName = input.authorName.trim();
  const whatsapp = input.whatsapp.trim();
  const priceRaw = input.price.trim();

  if (!title) fieldErrors.title = "Başlık zorunludur.";
  else if (title.length < TITLE_MIN) {
    fieldErrors.title = `Başlık en az ${TITLE_MIN} karakter olmalıdır.`;
  }

  if (!description) fieldErrors.description = "Açıklama zorunludur.";
  else if (description.length < DESC_MIN) {
    fieldErrors.description = `Açıklama en az ${DESC_MIN} karakter olmalıdır.`;
  }

  if (!category || !CATEGORIES.some((c) => c.slug === category)) {
    fieldErrors.category = "Lütfen bir kategori seçin.";
  }

  if (!city) fieldErrors.city = "Şehir zorunludur.";
  if (!district) fieldErrors.district = "İlçe veya mahalle zorunludur.";

  if (!authorName) fieldErrors.authorName = "Ad alanı zorunludur.";

  if (!whatsapp) fieldErrors.whatsapp = "WhatsApp numarası zorunludur.";
  else if (!isValidTurkishMobile(whatsapp)) {
    fieldErrors.whatsapp =
      "Geçerli bir Türkiye cep telefonu girin (örn: 05XX XXX XX XX).";
  }

  let price: number | undefined;
  if (priceRaw) {
    const parsed = Number(priceRaw);
    if (Number.isNaN(parsed) || parsed < 0) {
      fieldErrors.price = "Fiyat sayısal bir değer olmalıdır.";
    } else {
      price = parsed;
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    fieldErrors: {},
    data: {
      title,
      description,
      category: category as CategorySlug,
      city,
      district,
      authorName,
      whatsapp,
      price,
    },
  };
}
