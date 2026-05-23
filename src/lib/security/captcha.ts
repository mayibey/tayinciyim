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
