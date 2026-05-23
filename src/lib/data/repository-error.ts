/** Kullanıcıya gösterilebilir repository hatası */
export class ListingRepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ListingRepositoryError";
  }
}

export const LISTING_SAVE_ERROR =
  "İlan kaydedilemedi. Lütfen bilgileri kontrol edip tekrar deneyin.";

export const LISTING_LOAD_ERROR =
  "İlanlar yüklenemedi. Bağlantıyı kontrol edip sayfayı yenileyin.";
