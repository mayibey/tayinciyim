import { Skeleton } from "@/components/ui/Skeleton";

export function ListingDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <Skeleton className="mb-6 h-4 w-32" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <Skeleton className="aspect-[4/3] w-full rounded-3xl sm:aspect-[16/10]" />
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-24 shrink-0 rounded-xl sm:h-20 sm:w-28" />
            ))}
          </div>
          <div className="card-surface-lg p-6 sm:p-8">
            <Skeleton className="mb-4 h-7 w-40 rounded-full" />
            <Skeleton className="mb-3 h-10 w-full" />
            <Skeleton className="mb-6 h-5 w-48" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
        <Skeleton className="hidden h-80 rounded-3xl lg:block" />
      </div>
    </div>
  );
}
