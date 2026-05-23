export const MAX_LISTING_IMAGES = 10;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

export interface LocalImageFile {
  id: string;
  file: File;
  previewUrl: string;
}

export interface UploadedImageRef {
  path: string;
  publicUrl: string;
}

export interface UploadResult {
  success: boolean;
  images?: UploadedImageRef[];
  error?: string;
}
