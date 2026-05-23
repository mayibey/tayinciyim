import { ListingCardSkeleton } from "@/components/ui/skeletons/ListingCardSkeleton";

interface ListingGridSkeletonProps {
  count?: number;
}

export function ListingGridSkeleton({ count = 6 }: ListingGridSkeletonProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}
