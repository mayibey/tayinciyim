/**
 * CAPTCHA doğrulama — env yoksa demo modda geçer.
 * TODO: hCaptcha / Cloudflare Turnstile / reCAPTCHA entegrasyonu
 */

export function isCaptchaConfigured(): boolean {
  return Boolean(
    process.env.CAPTCHA_SECRET_KEY?.trim() &&
      process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY?.trim(),
  );
}

/** Production’da CAPTCHA yoksa uyarı — reveal / form guard */
export function warnCaptchaNotConfigured(context: string): void {
  if (process.env.NODE_ENV === "production" && !isCaptchaConfigured()) {
    console.warn(
      `[security] CAPTCHA provider not configured (${context}). ` +
        "Set CAPTCHA_SECRET_KEY and NEXT_PUBLIC_CAPTCHA_SITE_KEY.",
    );
  }
}

export async function verifyCaptcha(token: string | null | undefined): Promise<boolean> {
  if (!isCaptchaConfigured()) {
    return true;
  }

  const secret = process.env.CAPTCHA_SECRET_KEY!.trim();
  const t = (token ?? "").trim();
  if (!t) return false;

  // TODO: Provider API çağrısı (Turnstile siteverify vb.)
  void secret;
  void t;
  return true;
}
