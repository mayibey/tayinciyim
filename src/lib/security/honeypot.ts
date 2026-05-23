export const HONEYPOT_FIELD = "hp_url";
export const FORM_STARTED_FIELD = "formStartedAt";
export const CAPTCHA_TOKEN_FIELD = "captchaToken";

export const SECURITY_CHECK_FAILED_MESSAGE =
  "İşlem güvenlik kontrolünden geçemedi.";

/** Görünmez alan — botlar doldurursa reddet */
export function isHoneypotClean(formData: FormData): boolean {
  const value = String(formData.get(HONEYPOT_FIELD) ?? "").trim();
  return value.length === 0;
}

/** Çok hızlı gönderim (bot) */
export function isSubmitTimingValid(
  formData: FormData,
  minMs = 3000,
): boolean {
  const raw = formData.get(FORM_STARTED_FIELD);
  if (raw == null || raw === "") return true;
  const started = Number(raw);
  if (!Number.isFinite(started) || started <= 0) return true;
  return Date.now() - started >= minMs;
}

export function validateBotProtection(
  formData: FormData,
  minSubmitMs = 3000,
): { ok: true } | { ok: false; message: string } {
  if (!isHoneypotClean(formData)) {
    return { ok: false, message: SECURITY_CHECK_FAILED_MESSAGE };
  }
  if (!isSubmitTimingValid(formData, minSubmitMs)) {
    return { ok: false, message: SECURITY_CHECK_FAILED_MESSAGE };
  }
  return { ok: true };
}
