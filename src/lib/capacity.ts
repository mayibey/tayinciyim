import type { NakliyeciAracDetails } from "@/types/listing-fields";
import { ROOM_EQUIVALENT_LABELS } from "@/lib/constants/field-labels";

export type CapacityLevel = "high" | "medium" | "low" | "critical";

export function getCapacityLevel(
  availablePercent: number,
): CapacityLevel {
  if (availablePercent >= 50) return "high";
  if (availablePercent >= 25) return "medium";
  if (availablePercent >= 12) return "low";
  return "critical";
}

export function getCapacityBarColors(availablePercent: number): {
  fill: string;
  track: string;
  text: string;
} {
  const level = getCapacityLevel(availablePercent);
  switch (level) {
    case "high":
      return {
        fill: "bg-gradient-to-r from-emerald-600 to-emerald-500",
        track: "bg-emerald-100",
        text: "text-emerald-800",
      };
    case "medium":
      return {
        fill: "bg-gradient-to-r from-amber-500 to-accent",
        track: "bg-amber-100",
        text: "text-amber-900",
      };
    case "low":
      return {
        fill: "bg-gradient-to-r from-orange-500 to-orange-600",
        track: "bg-orange-100",
        text: "text-orange-900",
      };
    default:
      return {
        fill: "bg-gradient-to-r from-red-600 to-red-500",
        track: "bg-red-100",
        text: "text-red-800",
      };
  }
}

export function getCapacityMessage(details: NakliyeciAracDetails): string {
  const eq = ROOM_EQUIVALENT_LABELS[details.canTakeRoomEquivalent];
  if (details.availableCapacityPercent >= 50) {
    return `Bu araç yaklaşık ${eq} eşya daha alabilir.`;
  }
  if (details.availableCapacityPercent >= 20) {
    return `Sınırlı kapasite — yaklaşık ${eq} parça eşya alınabilir.`;
  }
  return "Kapasite dolmak üzere — lütfen önceden iletişime geçin.";
}

export function getRemainingCapacityLabel(
  details: NakliyeciAracDetails,
): string {
  const eq = ROOM_EQUIVALENT_LABELS[details.canTakeRoomEquivalent];
  return `Kalan: %${details.availableCapacityPercent} boş · ~${eq} oda karşılığı`;
}
