import "server-only";

import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_LISTING_IMAGES,
  type UploadResult,
} from "@/lib/storage/types";

const BUCKET = "listing-images";
const MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "webp"]);

function extFromMime(mime: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

function safeExtension(file: File): string | null {
  const fromMime = extFromMime(file.type);
  const namePart = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXT.has(namePart)) return null;
  if (fromMime === "jpg" && (namePart === "jpg" || namePart === "jpeg")) return "jpg";
  if (fromMime === namePart) return fromMime;
  return fromMime;
}

export function validateListingImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return "Yalnızca JPEG, PNG veya WebP yükleyebilirsiniz.";
  }
  if (!safeExtension(file)) {
    return "Geçersiz dosya uzantısı.";
  }
  if (file.size > MAX_BYTES) {
    return "Dosya boyutu 5 MB'dan küçük olmalıdır.";
  }
  return null;
}

/**
 * Tek görsel yükle — Supabase Storage listing-images bucket.
 * TODO: file size/type validation sunucu tarafı ek kontrol
 */
export async function uploadListingImage(
  file: File,
  listingId: string,
): Promise<{ path: string; publicUrl: string } | null> {
  if (!hasSupabaseEnv()) return null;

  const err = validateListingImageFile(file);
  if (err) throw new Error(err);

  const client = createSupabaseServiceClient();
  if (!client) return null;

  const ext = safeExtension(file) ?? extFromMime(file.type);
  const path = `${listingId}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await client.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    console.error("[storage] upload:", error.message);
    return null;
  }

  const { data } = client.storage.from(BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

export async function uploadListingImages(
  files: File[],
  listingId: string,
): Promise<UploadResult> {
  if (!hasSupabaseEnv()) {
    return { success: false, error: "Supabase yapılandırılmadı — yerel önizleme kullanın." };
  }

  if (files.length > MAX_LISTING_IMAGES) {
    return { success: false, error: `En fazla ${MAX_LISTING_IMAGES} görsel.` };
  }

  const images: { path: string; publicUrl: string }[] = [];

  for (const file of files) {
    const uploaded = await uploadListingImage(file, listingId);
    if (!uploaded) {
      return { success: false, error: "Görsel yüklenemedi." };
    }
    images.push(uploaded);
  }

  return { success: true, images };
}

export async function deleteListingImage(path: string): Promise<boolean> {
  if (!hasSupabaseEnv()) return false;
  const client = createSupabaseServiceClient();
  if (!client) return false;
  const { error } = await client.storage.from(BUCKET).remove([path]);
  return !error;
}
