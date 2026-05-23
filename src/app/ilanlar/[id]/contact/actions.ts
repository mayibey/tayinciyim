"use server";

import { getListingContactWhatsApp, getListingById } from "@/lib/data/listings";
import { PUBLIC_LISTING_STATUS } from "@/lib/constants/listing-status";
import { SITE_NAME } from "@/lib/constants/site";
import { isCaptchaConfigured, verifyCaptcha, warnCaptchaNotConfigured } from "@/lib/security/captcha";
import { assertRateLimit, RATE_LIMITS } from "@/lib/security/rate-limit";
import { rateLimitKey } from "@/lib/security/request";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export type RevealContactResult =
  | { ok: true; whatsappUrl: string }
  | { ok: false; message: string };

/**
 * İlan iletişim bilgisini kontrollü açar.
 * TODO: Yüksek risk / abuse durumunda oturum zorunluluğu eklenecek.
 * TODO: CAPTCHA zorunluluğu (token gönderilmeden reddet) production politikasına bağlanacak.
 */
export async function revealListingContactAction(
  listingId: string,
  captchaToken?: string | null,
): Promise<RevealContactResult> {
  warnCaptchaNotConfigured("revealListingContactAction");

  const token = captchaToken?.trim();
  if (token) {
    const captchaOk = await verifyCaptcha(token);
    if (!captchaOk) {
      return { ok: false, message: "Güvenlik doğrulaması başarısız. Lütfen tekrar deneyin." };
    }
  } else if (isCaptchaConfigured()) {
    return { ok: false, message: "Güvenlik doğrulaması gerekli." };
  }

  const key = await rateLimitKey(`contact-reveal:${listingId}`);
  const rl = assertRateLimit({ key, ...RATE_LIMITS.revealContact });
  if (!rl.ok) return { ok: false, message: rl.message };

  const listing = await getListingById(listingId);
  if (!listing) {
    return { ok: false, message: "İlan bulunamadı." };
  }
  if (listing.status !== PUBLIC_LISTING_STATUS) {
    return { ok: false, message: "Bu ilan henüz yayında değil." };
  }

  const whatsapp = await getListingContactWhatsApp(listingId);
  if (!whatsapp) {
    return { ok: false, message: "İletişim bilgisi paylaşılmamış." };
  }

  const url = buildWhatsAppUrl(
    whatsapp,
    `Merhaba, ${SITE_NAME} üzerindeki "${listing.title}" ilanı hakkında bilgi almak istiyorum.`,
  );

  if (!url) {
    return { ok: false, message: "Geçersiz iletişim numarası." };
  }

  return { ok: true, whatsappUrl: url };
}
