import { ListingCardShell } from "./ListingCardShell";
import { FURNISHED_LABELS, ROOM_COUNT_LABELS } from "@/lib/constants/field-labels";
import {
  formatDistanceKm,
  resolveHomeLocationInsight,
} from "@/lib/location/location-insights";
import type { Listing } from "@/types/listing";

export function EvDevriCard({ listing }: { listing: Listing & { category: "ev-devri" } }) {
  const d = listing.details;
  const insight = resolveHomeLocationInsight(listing);

  return (
    <ListingCardShell
      listing={listing}
      imageOverlay={
        <span className="absolute bottom-3 right-3 rounded-xl bg-card/95 px-2.5 py-1 text-xs font-bold text-navy-900 shadow-soft">
          {d.rentPrice.toLocaleString("tr-TR")} ₺/ay
        </span>
      }
      meta={
        <>
          <span className="rounded-lg bg-cream-100 px-2 py-1 text-xs font-semibold text-navy-800">
            {ROOM_COUNT_LABELS[d.roomCount]}
          </span>
          <span className="rounded-lg bg-cream-100 px-2 py-1 text-xs font-medium text-muted">
            {FURNISHED_LABELS[d.furnished]}
          </span>
          {d.neighborhood && (
            <span className="rounded-lg bg-cream-100 px-2 py-1 text-xs font-medium text-muted">
              {d.neighborhood}
            </span>
          )}
          {insight && (
            <>
              {insight.distanceToInstitutionKm != null && (
                <span className="rounded-lg bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-900 ring-1 ring-sky-200">
                  Kurum {formatDistanceKm(insight.distanceToInstitutionKm)}
                </span>
              )}
              <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
                Ulaşım {insight.transportationScore}
              </span>
            </>
          )}
        </>
      }
    />
  );
}
