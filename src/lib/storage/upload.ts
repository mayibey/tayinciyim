import { hasSupabaseEnv } from "@/lib/supabase/env";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_LISTING_IMAGES,
  type LocalImageFile,
  type UploadResult,
} from "./types";

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return "Yalnızca JPEG, PNG veya WebP yükleyebilirsiniz.";
  }
  if (file.size > 5 * 1024 * 1024) {
    return "Dosya boyutu 5 MB'dan küçük olmalıdır.";
  }
  return null;
}

export function validateImageBatch(files: File[], currentCount: number): string | null {
  if (currentCount + files.length > MAX_LISTING_IMAGES) {
    return `En fazla ${MAX_LISTING_IMAGES} görsel yükleyebilirsiniz.`;
  }
  for (const file of files) {
    const err = validateImageFile(file);
    if (err) return err;
  }
  return null;
}

/**
 * İstemci önizleme modu — gerçek yükleme sunucu action'da (listing-images.ts).
 */
export async function uploadListingImages(
  _listingId: string,
  images: LocalImageFile[],
): Promise<UploadResult> {
  if (hasSupabaseEnv()) {
    return {
      success: true,
      images: images.map((img) => ({
        path: `pending/${img.id}`,
        publicUrl: img.previewUrl,
      })),
    };
  }

  return {
    success: true,
    images: images.map((img) => ({
      path: `local/${img.id}`,
      publicUrl: img.previewUrl,
    })),
  };
}
