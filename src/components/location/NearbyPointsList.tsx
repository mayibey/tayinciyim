import {
  formatDistanceKm,
  formatEstimatedMinutes,
  getPointTypeLabel,
} from "@/lib/location/location-insights";
import type { PointOfInterest } from "@/types/location-insights";

export function NearbyPointsList({ points }: { points: PointOfInterest[] }) {
  if (points.length === 0) {
    return <p className="text-sm text-muted">Yakın nokta verisi henüz eklenmemiş.</p>;
  }

  return (
    <ul className="divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-card overflow-hidden">
      {points.map((p) => (
        <li
          key={p.id}
          className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5"
        >
          <div>
            <p className="font-medium text-navy-900">{p.name}</p>
            <p className="text-xs text-muted">{getPointTypeLabel(p.type)}</p>
            {p.note && <p className="mt-1 text-xs text-muted">{p.note}</p>}
          </div>
          <div className="flex shrink-0 gap-3 text-xs font-semibold text-navy-800">
            <span>{formatDistanceKm(p.distanceKm)}</span>
            {p.estimatedMinutes != null && (
              <span className="text-muted">
                {formatEstimatedMinutes(p.estimatedMinutes)}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
