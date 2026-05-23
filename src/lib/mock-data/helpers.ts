import type { Listing, ListingImage } from "@/types/listing";

let idCounter = 100;

export function mockId(): string {
  idCounter += 1;
  return String(idCounter);
}

export function mockImages(seed: string, count = 2): ListingImage[] {
  return Array.from({ length: count }, (_, i) => ({
    url: `https://picsum.photos/seed/tayin-${seed}-${i}/1200/800`,
    alt: `Görsel ${i + 1}`,
  }));
}

export function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export function baseListing(
  partial: Omit<Listing, "createdAt" | "updatedAt"> & {
    createdAt?: string;
    updatedAt?: string;
  },
): Listing {
  const now = partial.createdAt ?? daysAgo(1);
  return {
    ...partial,
    createdAt: now,
    updatedAt: partial.updatedAt ?? now,
  } as Listing;
}
