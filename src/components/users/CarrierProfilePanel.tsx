import { VEHICLE_TYPE_LABELS } from "@/lib/constants/field-labels";
import { UserVerificationBadges } from "@/components/users/UserVerificationBadges";
import type { CarrierProfile, UserProfile } from "@/types/user-profile";

interface CarrierProfilePanelProps {
  carrier: CarrierProfile;
  user: UserProfile;
}

const VERIFICATION_LABELS: Record<CarrierProfile["verificationStatus"], string> = {
  verified: "Onaylı firma",
  pending: "Onay bekliyor",
  rejected: "Onay reddedildi",
  none: "Onay yok",
};

export function CarrierProfilePanel({ carrier, user }: CarrierProfilePanelProps) {
  return (
    <section className="card-surface-lg p-6 sm:p-8">
      <h2 className="text-lg font-bold text-navy-900 sm:text-xl">Firma profili</h2>
      <p className="mt-1 text-sm text-muted">{carrier.companyName}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
            carrier.verificationStatus === "verified"
              ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
              : "bg-cream-100 text-navy-800 ring-[var(--border)]"
          }`}
        >
          {VERIFICATION_LABELS[carrier.verificationStatus]}
        </span>
        {user.isCarrierVerified && (
          <UserVerificationBadges badges={["onayli-nakliyeci"]} max={1} size="md" />
        )}
      </div>

      {carrier.serviceDescription && (
        <p className="mt-4 text-sm leading-relaxed text-navy-800/90">
          {carrier.serviceDescription}
        </p>
      )}

      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
            Hizmet şehirleri
          </dt>
          <dd className="mt-1 text-sm font-medium text-navy-800">
            {carrier.serviceCities.join(" · ")}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
            Araç tipleri
          </dt>
          <dd className="mt-1 text-sm font-medium text-navy-800">
            {carrier.vehicleTypes.map((v) => VEHICLE_TYPE_LABELS[v]).join(" · ")}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
            Tamamlanan taşıma
          </dt>
          <dd className="mt-1 text-sm font-bold text-navy-900">
            {carrier.completedMoves} / {carrier.totalMoves}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
            Araç sayısı
          </dt>
          <dd className="mt-1 text-sm font-medium text-navy-800">{carrier.vehicleCount}</dd>
        </div>
      </dl>

      <ul className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
        {carrier.hasInsurance && (
          <li className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-800 ring-1 ring-emerald-200">
            Sigorta
          </li>
        )}
        {carrier.hasLiftService && (
          <li className="rounded-full bg-violet-50 px-2.5 py-1 text-violet-800 ring-1 ring-violet-200">
            Asansör
          </li>
        )}
        {carrier.hasPackingService && (
          <li className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-800 ring-1 ring-sky-200">
            Paketleme
          </li>
        )}
      </ul>

      {carrier.workingHours && (
        <p className="mt-4 text-xs text-muted">Çalışma saatleri: {carrier.workingHours}</p>
      )}
      {carrier.documentsNote && (
        <p className="mt-2 text-xs text-muted">{carrier.documentsNote}</p>
      )}
    </section>
  );
}
