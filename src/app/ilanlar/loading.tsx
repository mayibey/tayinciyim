import { ListingGridSkeleton } from "@/components/ui/skeletons/ListingGridSkeleton";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";

export default function IlanlarLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <PageHeader
        badge="İlanlar"
        title="Tüm İlanlar"
        description="Yükleniyor..."
      />
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        <div className="lg:w-72 lg:shrink-0">
          <div className="card-surface-lg overflow-hidden p-0">
            <Skeleton className="h-16 w-full rounded-none" />
            <div className="space-y-3 p-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
              <Skeleton className="mt-4 h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <Skeleton className="mb-5 h-4 w-28" />
          <ListingGridSkeleton count={4} />
        </div>
      </div>
    </div>
  );
}
