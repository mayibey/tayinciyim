import { CapacityBar } from "@/components/listings/CapacityBar";
import { Badge } from "@/components/ui/Badge";
import { ListingCardShell } from "./ListingCardShell";
import { VEHICLE_TYPE_LABELS } from "@/lib/constants/field-labels";
import { getListingRoute } from "@/types/listing";
import type { Listing } from "@/types/listing";

export function NakliyeciAracCard({
  listing,
}: {
  listing: Listing & { category: "nakliyeci-arac-ilani" };
}) {
  const d = listing.details;
  const route = getListingRoute(listing);

  return (
    <ListingCardShell
      listing={listing}
      meta={
        <>
          {route && (
            <span className="rounded-lg bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-900">
              {route}
            </span>
          )}
          <span className="rounded-lg bg-cream-100 px-2 py-1 text-xs font-medium text-navy-800">
            {VEHICLE_TYPE_LABELS[d.vehicleType]}
          </span>
          <span className="text-xs text-muted">{d.departureDate}</span>
          {d.hasTransportInsurance && <Badge variant="success">Sigortalı</Badge>}
          {d.hasLift && <Badge variant="navy">Asansörlü</Badge>}
        </>
      }
      footer={
        <div className="border-t border-[var(--border)] pt-4">
          <CapacityBar details={d} size="sm" />
        </div>
      }
    />
  );
}
