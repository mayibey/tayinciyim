"use server";

import { reportListing } from "@/lib/data/listings-repository";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { assertSecureFormSubmission } from "@/lib/security/form-guard";
import { assertRateLimit, RATE_LIMITS } from "@/lib/security/rate-limit";
import { rateLimitKey } from "@/lib/security/request";
import { sanitizeShortText } from "@/lib/security/sanitize";
import { normalizeAndValidateMobile } from "@/lib/security/phone";

export type ReportListingFormState = {
  ok: boolean;
  message: string;
};

export async function reportListingAction(
  listingId: string,
  reason: string,
  message?: string,
  reporterName?: string,
  reporterContact?: string,
  securityFormData?: FormData,
): Promise<ReportListingFormState> {
  if (securityFormData) {
    const security = await assertSecureFormSubmission(securityFormData, {
      rateLimit: { key: "reportListing", ...RATE_LIMITS.reportListing },
      minSubmitMs: 1000,
    });
    if (!security.ok) return { ok: false, message: security.message };
  } else {
    const key = await rateLimitKey("reportListing");
    const rl = assertRateLimit({ key, ...RATE_LIMITS.reportListing });
    if (!rl.ok) return { ok: false, message: rl.message };
  }

  const safeReason = sanitizeShortText(reason, 100);
  const safeMessage = message ? sanitizeShortText(message, 500) : undefined;
  const safeName = reporterName ? sanitizeShortText(reporterName, 80) : undefined;
  let safeContact: string | undefined;
  if (reporterContact) {
    const p = normalizeAndValidateMobile(reporterContact);
    safeContact = p.ok ? p.value : sanitizeShortText(reporterContact, 20);
  }

  const ok = await reportListing({
    listingId,
    reason: safeReason || "diger",
    message: safeMessage,
    reporterName: safeName,
    reporterContact: safeContact,
  });

  if (hasSupabaseEnv() && ok) {
    return { ok: true, message: "Şikayetiniz kaydedildi. Ekibimiz inceleyecektir." };
  }

  if (!hasSupabaseEnv()) {
    return {
      ok: true,
      message: "Şikayetiniz alındı (demo mod). Production'da veritabanına kaydedilir.",
    };
  }

  return { ok: false, message: "Şikayet gönderilemedi. Lütfen tekrar deneyin." };
}
