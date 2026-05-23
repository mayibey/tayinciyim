import { getCategoryBySlug } from "@/lib/categories";
import type { CategorySlug } from "@/types/listing";

interface CategoryBadgeProps {
  slug: CategorySlug;
  size?: "sm" | "md";
}

export function CategoryBadge({ slug, size = "sm" }: CategoryBadgeProps) {
  const category = getCategoryBySlug(slug);
  if (!category) return null;

  return (
    <span
      className={`inline-flex rounded-full font-semibold ${category.color} ${
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
      }`}
    >
      {category.label}
    </span>
  );
}
