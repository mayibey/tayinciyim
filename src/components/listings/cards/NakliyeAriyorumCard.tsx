import { Badge } from "@/components/ui/Badge";
import { ListingCardShell } from "./ListingCardShell";
import { LOAD_TYPE_LABELS } from "@/lib/constants/field-labels";
import { getListingRoute } from "@/types/listing";
import type { Listing } from "@/types/listing";

export function NakliyeAriyorumCard({
  listing,
}: {
  listing: Listing & { category: "nakliye-ariyorum" };
}) {
  const d = listing.details;
  const route = getListingRoute(listing);

  return (
    <ListingCardShell
      listing={listing}
      meta={
        <>
          {route && (
            <span className="rounded-lg bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-900 ring-1 ring-sky-200">
              {route}
            </span>
          )}
          <span className="rounded-lg bg-cream-100 px-2 py-1 text-xs font-medium text-navy-800">
            {LOAD_TYPE_LABELS[d.loadType]}
          </span>
          {listing.availableDate && (
            <span className="text-xs text-muted">
              {listing.availableDate}
              {listing.availableTimeStart ? ` · ${listing.availableTimeStart}` : ""}
            </span>
          )}
          {d.wantsSharedTruck && <Badge variant="accent">Ortak nakliye</Badge>}
          {d.budgetRange && (
            <span className="text-xs font-semibold text-accent">{d.budgetRange}</span>
          )}
        </>
      }
    />
  );
}
