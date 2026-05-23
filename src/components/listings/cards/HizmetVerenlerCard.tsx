import Link from "next/link";
import { ListingCardShell } from "./ListingCardShell";
import { Badge } from "@/components/ui/Badge";
import { SERVICE_TYPE_LABELS } from "@/lib/constants/service-labels";
import { formatServiceLocation, formatServicePrice } from "@/lib/service-format";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { resolveListingAuthor } from "@/lib/users/resolve-user";
import type { Listing } from "@/types/listing";

export function HizmetVerenlerCard({
  listing,
}: {
  listing: Listing & { category: "hizmet-verenler" };
}) {
  const d = listing.details;
  const author = resolveListingAuthor(listing);
  const priceLabel = formatServicePrice(listing);
  const location = formatServiceLocation(listing);
  const displayName = d.isCompany && d.companyName ? d.companyName : listing.contactName;
  const waUrl =
    buildWhatsAppUrl(
      listing.whatsapp,
      `Merhaba, tayinciyim.com üzerindeki "${listing.title}" hizmet ilanı hakkında bilgi almak istiyorum.`,
    ) ?? "#";

  return (
    <ListingCardShell
      listing={listing}
      imageOverlay={
        priceLabel ? (
          <span className="absolute bottom-3 right-3 rounded-xl bg-card/95 px-2.5 py-1 text-xs font-bold text-teal-800 shadow-soft">
            {priceLabel}
          </span>
        ) : undefined
      }
      meta={
        <>
          <Badge variant="navy" size="sm">
            {SERVICE_TYPE_LABELS[d.serviceType]}
          </Badge>
          {d.sameDayService && (
            <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-900">
              Aynı gün
            </span>
          )}
          {d.weekendAvailable && (
            <span className="rounded-lg bg-cream-100 px-2 py-1 text-xs font-medium text-navy-800">
              Hafta sonu
            </span>
          )}
          {d.invoiceAvailable && (
            <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800">
              Fatura
            </span>
          )}
          <span className="rounded-lg bg-cream-100 px-2 py-1 text-xs font-medium text-muted">
            {location}
          </span>
          <span className="text-xs font-medium text-navy-800">
            ★ {author.ratingAverage.toFixed(1)} · Güven {author.trustScore}
          </span>
        </>
      }
      footer={
        <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-navy-900">{displayName}</p>
              <p className="text-xs text-muted">
                {d.isCompany ? "Firma" : "Bireysel"} · {author.trustScore} güven
              </p>
            </div>
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition-smooth hover:brightness-105"
          >
            WhatsApp
          </a>
          <Link
            href={`/ilanlar/${listing.id}`}
            className="relative z-10 text-center text-xs font-semibold text-accent hover:underline"
          >
            Detayları gör
          </Link>
        </div>
      }
    />
  );
}
