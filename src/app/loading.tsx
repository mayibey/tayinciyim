import { Hero } from "@/components/home/Hero";
import { CategoryCardSkeleton } from "@/components/ui/skeletons/CategoryCardSkeleton";
import { ListingGridSkeleton } from "@/components/ui/skeletons/ListingGridSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";

export default function HomeLoading() {
  return (
    <div>
      <Hero />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Skeleton className="mb-2 h-4 w-24" />
        <Skeleton className="mb-8 h-9 w-80 max-w-full" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      </section>
      <section className="border-t border-[var(--border)] bg-cream-100/50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <ListingGridSkeleton count={6} />
        </div>
      </section>
    </div>
  );
}
