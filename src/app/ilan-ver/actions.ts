"use server";

import { revalidatePath } from "next/cache";
import { createListing, updateListingImages } from "@/lib/data/listings";
import { uploadListingImages } from "@/lib/storage/listing-images";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { assertSecureFormSubmission } from "@/lib/security/form-guard";
import { RATE_LIMITS } from "@/lib/security/rate-limit";
import { ListingRepositoryError } from "@/lib/data/repository-error";
import { parseListingForm } from "@/lib/validation/parse-listing-form";

export type CreateListingFormState = {
  ok: boolean;
  message: string;
};

export async function createListingAction(
  _prev: CreateListingFormState,
  formData: FormData,
): Promise<CreateListingFormState> {
  const security = await assertSecureFormSubmission(formData, {
    rateLimit: { key: "createListing", ...RATE_LIMITS.createListing },
  });
  if (!security.ok) return { ok: false, message: security.message };

  const imageCount = Number(formData.get("imageCount") ?? 0);

  if (formData.get("securityConfirm") !== "1") {
    return { ok: false, message: "Güvenlik onayını işaretlemeniz gerekir." };
  }

  const parsed = parseListingForm(formData, imageCount);
  if (!parsed.ok) {
    return { ok: false, message: parsed.message };
  }

  try {
    const listing = await createListing(parsed.data);

    const imageFiles = formData
      .getAll("listingImages")
      .filter((f): f is File => f instanceof File && f.size > 0);

    let uploadNote = "";
    if (imageFiles.length > 0 && hasSupabaseEnv()) {
      const upload = await uploadListingImages(imageFiles, listing.id);
      if (!upload.success) {
        return {
          ok: true,
          message:
            "İlan kaydedildi ancak görseller yüklenemedi. Daha sonra tekrar deneyebilir veya destek ile iletişime geçebilirsiniz.",
        };
      }
      if (upload.images?.length) {
        await updateListingImages(
          listing.id,
          upload.images.map((img, i) => ({
            url: img.publicUrl,
            alt: `${listing.title} — görsel ${i + 1}`,
          })),
        );
        uploadNote = " Görseller yüklendi;";
      }
    }

    revalidatePath("/");
    revalidatePath("/ilanlar");
    revalidatePath("/admin");

    return {
      ok: true,
      message: hasSupabaseEnv()
        ? `İlanınız kaydedildi.${uploadNote} Onay sonrası yayına alınır.`
        : "İlanınız başarıyla kaydedildi (demo mod).",
    };
  } catch (err) {
    if (err instanceof ListingRepositoryError) {
      return { ok: false, message: err.message };
    }
    return {
      ok: false,
      message: hasSupabaseEnv()
        ? "İlan kaydedilemedi. Lütfen daha sonra tekrar deneyin."
        : "İşlem tamamlanamadı.",
    };
  }
}
