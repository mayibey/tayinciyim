import Link from "next/link";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import type { Category } from "@/lib/categories";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/ilanlar?kategori=${category.slug}`}
      className="group card-surface-lg flex flex-col p-6 transition-smooth hover:-translate-y-1 hover:shadow-card-hover sm:p-7"
    >
      <div
        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition-smooth group-hover:scale-105 ${category.iconBg}`}
      >
        <CategoryIcon slug={category.slug} className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold text-navy-900 group-hover:text-accent transition-smooth">
        {category.label}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
        {category.description}
      </p>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-navy-800 transition-smooth group-hover:text-accent group-hover:gap-2">
        İlanlara git
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}
