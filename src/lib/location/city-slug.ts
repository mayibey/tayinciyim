import { normalizeCity } from "@/lib/matching/city-proximity";

export function cityToSlug(city: string): string {
  return normalizeCity(city);
}

export function slugToCityDisplay(slug: string, guides: { slug: string; city: string }[]): string {
  const found = guides.find((g) => g.slug === slug);
  if (found) return found.city;
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}
