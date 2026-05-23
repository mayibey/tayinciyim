import {
  getCapacityBarColors,
  getCapacityMessage,
  getRemainingCapacityLabel,
} from "@/lib/capacity";
import { ROOM_EQUIVALENT_LABELS } from "@/lib/constants/field-labels";
import type { NakliyeciAracDetails } from "@/types/listing-fields";

interface CapacityBarProps {
  details: NakliyeciAracDetails;
  size?: "sm" | "lg";
  showBreakdown?: boolean;
}

export function CapacityBar({
  details,
  size = "sm",
  showBreakdown = false,
}: CapacityBarProps) {
  const used = details.usedCapacityPercent;
  const available = details.availableCapacityPercent;
  const message = getCapacityMessage(details);
  const colors = getCapacityBarColors(available);
  const roomLabel = ROOM_EQUIVALENT_LABELS[details.canTakeRoomEquivalent];
  const isLarge = size === "lg";

  return (
    <div className={isLarge ? "space-y-3" : "space-y-2"}>
      <div className="flex items-center justify-between gap-2 text-xs font-semibold text-navy-800">
        <span>Doluluk</span>
        <span className={`tabular-nums ${colors.text}`}>%{available} boş</span>
      </div>

      <div
        className={`overflow-hidden rounded-full ${colors.track} ${isLarge ? "h-4" : "h-2.5"}`}
        role="progressbar"
        aria-valuenow={used}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Araç doluluk oranı yüzde ${used}, yüzde ${available} boş kapasite`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${colors.fill}`}
          style={{ width: `${used}%` }}
        />
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p
          className={`leading-snug text-muted ${isLarge ? "text-sm font-medium text-navy-800" : "text-xs"}`}
        >
          {message}
        </p>
        {showBreakdown && (
          <span className="text-xs font-bold tabular-nums text-navy-900">
            %{used} dolu
          </span>
        )}
      </div>

      {showBreakdown && (
        <p className="text-xs text-muted">{getRemainingCapacityLabel(details)}</p>
      )}

      <p className="text-xs text-muted">
        Toplam {details.totalCapacityM3} m³ · Oda karşılığı: {roomLabel}
        {!showBreakdown && ` · Kullanılan %${used}`}
      </p>
    </div>
  );
}
