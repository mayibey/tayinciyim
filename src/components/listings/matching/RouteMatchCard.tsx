import Link from "next/link";
import { CapacityBar } from "@/components/listings/CapacityBar";
import { getScoreBadgeClass } from "@/lib/matching/route-matching";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import {
  LOAD_TYPE_LABELS,
  VEHICLE_TYPE_LABELS,
} from "@/lib/constants/field-labels";
import { formatDate } from "@/lib/utils";
import { getListingRoute } from "@/types/listing";
import type { RouteSuggestion } from "@/types/matching";

const ROUTE_TYPE_LABELS: Record<string, string> = {
  exact: "Doğrudan rota eşleşmesi",
  near_destination: "Yakın rota",
  corridor: "Güzergâh uyumlu",
  same_origin: "Aynı çıkış noktası",
  alternative: "Alternatif rota",
};

interface RouteMatchCardProps {
  suggestion: RouteSuggestion;
  sourceTitle?: string;
}

export function RouteMatchCard({ suggestion, sourceTitle }: RouteMatchCardProps) {
  const { listing, match } = suggestion;
  const route = getListingRoute(listing);
  const scoreClass = getScoreBadgeClass(match.totalScore);
  const routeTag = ROUTE_TYPE_LABELS[match.routeType] ?? "Rota önerisi";

  const waMessage = sourceTitle
    ? `Merhaba, tayinciyim.com üzerinde "${sourceTitle}" ilanı için %${match.totalScore} uyumlu eşleşme olarak gördüm. Bilgi alabilir miyim?`
    : `Merhaba, tayinciyim.com üzerindeki "${listing.title}" ilanı hakkında bilgi almak istiyorum.`;

  const waUrl = buildWhatsAppUrl(listing.whatsapp, waMessage);

  const carrierDetails =
    listing.category === "nakliyeci-arac-ilani" ? listing.details : null;

  const seekerDetails =
    listing.category === "nakliye-ariyorum" ? listing.details : null;

  return (
    <article className="card-surface overflow-hidden transition-smooth hover:shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--border)] bg-cream-50/80 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold tabular-nums ${scoreClass}`}
          >
            %{match.totalScore} {match.qualityLabel}
          </span>
          <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-900 ring-1 ring-sky-200">
            {routeTag}
          </span>
        </div>
        <Link
          href={`/ilanlar/${listing.id}`}
          className="text-xs font-semibold text-accent hover:underline"
        >
          İlana git →
        </Link>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div>
          <h3 className="font-semibold text-navy-900 line-clamp-2">{listing.title}</h3>
          {route && (
            <p className="mt-1 text-sm font-medium text-sky-900">{route}</p>
          )}
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          {(listing.availableDate || carrierDetails?.departureDate) && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                Tarih
              </dt>
              <dd className="font-medium text-navy-800">
                {formatDate(
                  carrierDetails?.departureDate ?? listing.availableDate ?? "",
                )}
              </dd>
            </div>
          )}
          {carrierDetails && (
            <>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Araç
                </dt>
                <dd className="font-medium text-navy-800">
                  {VEHICLE_TYPE_LABELS[carrierDetails.vehicleType]}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Kalkış
                </dt>
                <dd className="font-medium text-navy-800">
                  {formatDate(carrierDetails.departureDate)}
                </dd>
              </div>
            </>
          )}
          {seekerDetails && (
            <div className="col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                Yük tipi
              </dt>
              <dd className="font-medium text-navy-800">
                {LOAD_TYPE_LABELS[seekerDetails.loadType]}
              </dd>
            </div>
          )}
        </dl>

        {carrierDetails && (
          <CapacityBar details={carrierDetails} size="sm" showBreakdown />
        )}

        {match.reasonLabels.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label="Eşleşme nedenleri">
            {match.reasonLabels.slice(0, 5).map((label) => (
              <li
                key={label}
                className="rounded-lg bg-cream-100 px-2 py-0.5 text-xs font-medium text-navy-800"
              >
                {label}
              </li>
            ))}
          </ul>
        )}

        {carrierDetails && (
          <div className="flex flex-wrap gap-2">
            {carrierDetails.hasTransportInsurance && (
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
                Sigortalı
              </span>
            )}
            {carrierDetails.hasLift && (
              <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-800 ring-1 ring-violet-200">
                Asansör
              </span>
            )}
            {carrierDetails.verifiedCarrier && (
              <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-semibold text-navy-800 ring-1 ring-navy-200">
                Doğrulanmış
              </span>
            )}
          </div>
        )}

        {waUrl && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition-smooth hover:brightness-105"
          >
            WhatsApp ile iletişim
          </a>
        )}
      </div>
    </article>
  );
}
