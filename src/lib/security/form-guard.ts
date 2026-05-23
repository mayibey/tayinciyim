import { verifyCaptcha } from "@/lib/security/captcha";
import { validateBotProtection } from "@/lib/security/honeypot";
import { assertRateLimit, type RateLimitOptions } from "@/lib/security/rate-limit";
import { rateLimitKey } from "@/lib/security/request";

export async function assertSecureFormSubmission(
  formData: FormData,
  options?: {
    rateLimit?: RateLimitOptions;
    minSubmitMs?: number;
  },
): Promise<{ ok: true } | { ok: false; message: string }> {
  const bot = validateBotProtection(formData, options?.minSubmitMs ?? 3000);
  if (!bot.ok) return bot;

  const captchaOk = await verifyCaptcha(
    String(formData.get("captchaToken") ?? ""),
  );
  if (!captchaOk) {
    return { ok: false, message: "İşlem güvenlik kontrolünden geçemedi." };
  }

  if (options?.rateLimit) {
    const key = await rateLimitKey(options.rateLimit.key);
    const rl = assertRateLimit({ ...options.rateLimit, key });
    if (!rl.ok) return rl;
  }

  return { ok: true };
}
