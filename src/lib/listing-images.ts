import type { CategorySlug, Listing, ListingImage } from "@/types/listing";
import { getCategoryConfig } from "@/lib/categories";

const DEFAULT_COUNT: Record<CategorySlug, number> = {
  "ev-devri": 3,
  "esya-devri": 2,
  "nakliye-ariyorum": 1,
  "nakliyeci-arac-ilani": 2,
  "sehir-sorusu": 0,
  "hizmet-verenler": 2,
};

export function getListingImages(listing: Listing): ListingImage[] {
  if (listing.images.length > 0) return listing.images;

  const count = DEFAULT_COUNT[listing.category] ?? 1;
  if (count === 0) return [];

  return Array.from({ length: count }, (_, i) => ({
    url: `https://picsum.photos/seed/tayin-${listing.id}-${i}/1200/800`,
    alt: `${listing.title} — görsel ${i + 1}`,
  }));
}

export function getListingCoverImage(listing: Listing): ListingImage | null {
  const images = getListingImages(listing);
  if (images.length > 0) return images[0];
  const config = getCategoryConfig(listing.category);
  if (config && config.minPhotos === 0) return null;
  return {
    url: `https://picsum.photos/seed/tayin-${listing.id}-cover/800/500`,
    alt: listing.title,
  };
}

export function listingRequiresPhotos(category: CategorySlug): boolean {
  return (getCategoryConfig(category)?.minPhotos ?? 0) > 0;
}
