import { NearbyPointsList } from "@/components/location/NearbyPointsList";
import { LocationScoreBadge } from "@/components/location/LocationScoreBadge";
import { SecurityNotice } from "@/components/listings/SecurityNotice";
import { HOME_LOCATION_PRIVACY_NOTE } from "@/lib/constants/location-disclaimer";
import { formatDistanceKm } from "@/lib/location/location-insights";
import type { HomeLocationInsight } from "@/types/location-insights";

interface HomeLocationInsightPanelProps {
  insight: HomeLocationInsight;
}

export function HomeLocationInsightPanel({ insight }: HomeLocationInsightPanelProps) {
  return (
    <section className="card-surface-lg overflow-hidden p-0">
      <div className="h-1 w-full bg-gradient-to-r from-sky-600 to-navy-800" />
      <div className="p-6 sm:p-8">
        <h2 className="text-xl font-bold text-navy-900 sm:text-2xl">
          Konum ve Sosyal İmkânlar
        </h2>
        <p className="mt-2 text-sm text-muted">{insight.approximateAddress}</p>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-cream-50 px-4 py-3 ring-1 ring-[var(--border)]">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
              Mahalle
            </dt>
            <dd className="mt-1 font-semibold text-navy-900">{insight.neighborhood}</dd>
          </div>
          {insight.distanceToInstitutionKm != null && (
            <div className="rounded-xl bg-cream-50 px-4 py-3 ring-1 ring-[var(--border)]">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                Kuruma mesafe
              </dt>
              <dd className="mt-1 font-semibold text-navy-900">
                {formatDistanceKm(insight.distanceToInstitutionKm)}
              </dd>
            </div>
          )}
          <div className="rounded-xl bg-cream-50 px-4 py-3 ring-1 ring-[var(--border)]">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
              Şehir merkezine
            </dt>
            <dd className="mt-1 font-semibold text-navy-900">
              {formatDistanceKm(insight.distanceToCityCenterKm)}
            </dd>
          </div>
        </dl>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <LocationScoreBadge score={insight.locationScore} label="Konum" />
          <LocationScoreBadge score={insight.transportationScore} label="Ulaşım" />
          <LocationScoreBadge score={insight.familySuitabilityScore} label="Aile uyumu" />
          <LocationScoreBadge score={insight.socialOpportunityScore} label="Sosyal imkân" />
        </div>

        {insight.notes && (
          <p className="mt-4 text-sm leading-relaxed text-navy-800/90">{insight.notes}</p>
        )}

        <h3 className="mt-8 text-sm font-bold text-navy-900">Yakın noktalar</h3>
        <div className="mt-3">
          <NearbyPointsList points={insight.nearbyPoints} />
        </div>

        <div className="mt-6">
          <SecurityNotice message={HOME_LOCATION_PRIVACY_NOTE} variant="info" />
        </div>
      </div>
    </section>
  );
}
