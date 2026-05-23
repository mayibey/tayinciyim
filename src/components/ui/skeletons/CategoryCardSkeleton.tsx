import { Skeleton } from "@/components/ui/Skeleton";

export function CategoryCardSkeleton() {
  return (
    <div className="card-surface-lg p-6">
      <Skeleton className="mb-4 h-12 w-12 rounded-2xl" />
      <Skeleton className="mb-2 h-5 w-28" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="mt-1 h-4 w-4/5" />
    </div>
  );
}
