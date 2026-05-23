import { ListingCardShell } from "./ListingCardShell";
import { Badge } from "@/components/ui/Badge";
import {
  ITEM_CATEGORY_LABELS,
  LISTING_INTENT_LABELS,
  REASON_FOR_SALE_LABELS,
} from "@/lib/constants/field-labels";
import { formatEsyaPrice } from "@/lib/esya-sale";
import type { Listing } from "@/types/listing";

function IntentBadge({ listing }: { listing: Listing & { category: "esya-devri" } }) {
  const intent = listing.details.listingIntent;
  const variant =
    intent === "ucretsiz"
      ? "success"
      : intent === "takas"
        ? "navy"
        : intent === "komple-ev-esyasi"
          ? "accent"
          : "default";

  return (
    <Badge variant={variant} size="sm">
      {LISTING_INTENT_LABELS[intent]}
    </Badge>
  );
}

export function EsyaDevriCard({ listing }: { listing: Listing & { category: "esya-devri" } }) {
  const d = listing.details;
  const priceLabel = formatEsyaPrice(listing);

  return (
    <ListingCardShell
      listing={listing}
      imageOverlay={
        priceLabel ? (
          <span
            className={`absolute bottom-3 right-3 rounded-xl px-2.5 py-1 text-xs font-bold shadow-soft ${
              d.listingIntent === "ucretsiz"
                ? "bg-emerald-600 text-white"
                : "bg-card/95 text-accent"
            }`}
          >
            {priceLabel}
          </span>
        ) : undefined
      }
      meta={
        <>
          <IntentBadge listing={listing} />
          {d.listingIntent === "komple-ev-esyasi" && (
            <Badge variant="accent" size="sm">
              Komple Ev
            </Badge>
          )}
          {(d.urgentSale || listing.isUrgent) && (
            <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white">
              Acil
            </span>
          )}
          {d.negotiable && (
            <span className="rounded-lg bg-cream-100 px-2 py-1 text-xs font-medium text-navy-800">
              Pazarlık var
            </span>
          )}
          <span className="rounded-lg bg-cream-100 px-2 py-1 text-xs font-medium text-muted">
            {ITEM_CATEGORY_LABELS[d.itemCategory]}
          </span>
          {d.reasonForSale && (
            <span className="text-xs text-muted">
              {REASON_FOR_SALE_LABELS[d.reasonForSale]}
            </span>
          )}
        </>
      }
    />
  );
}
