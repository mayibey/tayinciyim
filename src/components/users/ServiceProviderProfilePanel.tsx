import { SERVICE_TYPE_LABELS } from "@/lib/constants/service-labels";
import { UserRatingSummary } from "@/components/users/UserRatingSummary";
import { UserTrustBadge } from "@/components/users/UserTrustBadge";
import { UserVerificationBadges } from "@/components/users/UserVerificationBadges";
import type { Listing } from "@/types/listing";
import type { UserProfile } from "@/types/user-profile";

interface ServiceProviderProfilePanelProps {
  user: UserProfile;
  serviceListings: (Listing & { category: "hizmet-verenler" })[];
}

export function ServiceProviderProfilePanel({
  user,
  serviceListings,
}: ServiceProviderProfilePanelProps) {
  const serviceTypes = [
    ...new Set(serviceListings.map((l) => l.details.serviceType)),
  ];
  const cities = [
    ...new Set(serviceListings.flatMap((l) => l.details.serviceCities)),
  ];

  return (
    <div className="card-surface-lg p-6 sm:p-8">
      <h2 className="text-xl font-bold text-navy-900">Hizmet veren profili</h2>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <UserTrustBadge score={user.trustScore} />
        <UserRatingSummary average={user.ratingAverage} count={user.ratingCount} />
        <UserVerificationBadges badges={user.badges} />
      </div>
      <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted">Hizmet türleri</dt>
          <dd className="mt-1 font-medium text-navy-900">
            {serviceTypes.map((t) => SERVICE_TYPE_LABELS[t]).join(" · ")}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Hizmet verdiği şehirler</dt>
          <dd className="mt-1 font-medium text-navy-900">{cities.join(", ")}</dd>
        </div>
        <div>
          <dt className="text-muted">Tamamlanan iş</dt>
          <dd className="mt-1 font-medium text-navy-900">
            {user.completedTransactionCount}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Ortalama dönüş</dt>
          <dd className="mt-1 font-medium text-navy-900">{user.averageResponseTime}</dd>
        </div>
        <div>
          <dt className="text-muted">Puan</dt>
          <dd className="mt-1 font-medium text-navy-900">
            {user.ratingAverage.toFixed(1)} / 5 ({user.ratingCount} yorum)
          </dd>
        </div>
        <div>
          <dt className="text-muted">Güven skoru</dt>
          <dd className="mt-1 font-medium text-navy-900">{user.trustScore}</dd>
        </div>
      </dl>
    </div>
  );
}
