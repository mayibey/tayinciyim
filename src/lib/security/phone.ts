/**
 * WhatsApp / telefon normalizasyonu — yalnız rakam, Türkiye mobil formatı.
 */
export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("90") && digits.length === 12) {
    return `0${digits.slice(2)}`;
  }
  if (digits.startsWith("5") && digits.length === 10) {
    return `0${digits}`;
  }
  return digits;
}

export function isValidTurkishMobileNormalized(normalized: string): boolean {
  return /^05\d{9}$/.test(normalized);
}

export function normalizeAndValidateMobile(
  input: string,
): { ok: true; value: string } | { ok: false } {
  const value = normalizePhone(input);
  if (!isValidTurkishMobileNormalized(value)) {
    return { ok: false };
  }
  return { ok: true, value };
}
