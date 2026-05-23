import { Suspense } from "react";
import { CategoryCard } from "@/components/home/CategoryCard";
import { Hero } from "@/components/home/Hero";
import { RecentListings } from "@/components/home/RecentListings";
import { ListingGridSkeleton } from "@/components/ui/skeletons/ListingGridSkeleton";
import { CATEGORIES } from "@/lib/categories";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Tayin ve yer değiştirme ilanları",
  path: "/",
});

export default function HomePage() {
  return (
    <div>
      <Hero />

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-10 text-center sm:text-left">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            Kategoriler
          </span>
          <h2 className="mt-2 text-2xl font-bold text-navy-900 sm:text-3xl">
            İhtiyacınıza göre ilanlara göz atın
          </h2>
          <p className="mt-2 max-w-xl text-muted">
            Ev devrinden ortak nakliyeye, yeni şehir sorularına kadar dört ana kategori.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-cream-100/50">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <Suspense fallback={<ListingGridSkeleton count={6} />}>
            <RecentListings />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
