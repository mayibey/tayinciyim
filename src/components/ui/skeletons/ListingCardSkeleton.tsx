import { Skeleton } from "@/components/ui/Skeleton";

export function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-card shadow-card sm:rounded-3xl">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20 rounded-lg" />
          <Skeleton className="h-4 w-14" />
        </div>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}
