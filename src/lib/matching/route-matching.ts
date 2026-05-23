import { calculateRouteProximity } from "@/lib/matching/city-proximity";
import type { Listing } from "@/types/listing";
import type {
  CarrierMatchInput,
  GenerateSuggestionsOptions,
  MatchQualityLabel,
  MatchReasonCode,
  RouteMatchInput,
  RouteMatchResult,
  RouteMatchType,
  RouteSuggestion,
} from "@/types/matching";
import type { LoadType, RoomEquivalent, VehicleType } from "@/types/listing-fields";

/** Gelecek: MapProvider ile değiştirilebilir */
export interface RouteMatchingConfig {
  weights: {
    route: number;
    date: number;
    capacity: number;
    vehicle: number;
  };
  minScoreDefault: number;
  maxSuggestionsDefault: number;
}

export const DEFAULT_MATCHING_CONFIG: RouteMatchingConfig = {
  weights: { route: 0.4, date: 0.25, capacity: 0.25, vehicle: 0.1 },
  minScoreDefault: 55,
  maxSuggestionsDefault: 8,
};

const LOAD_ROOM_LEVEL: Record<LoadType, number> = {
  "parca-esya": 0,
  koli: 0,
  ofis: 1,
  "beyaz-esya": 1,
  "1+1": 1,
  "2+1": 2,
  "3+1": 3,
  "4+1": 4,
  "komple-ev": 4,
};

const ROOM_LEVEL: Record<RoomEquivalent, number> = {
  parca: 0,
  "1+1": 1,
  "2+1": 2,
  "3+1": 3,
};

const VEHICLE_MAX_ROOM: Record<VehicleType, number> = {
  panelvan: 1,
  kamyonet: 2,
  kamyon: 4,
  tir: 5,
};

const REASON_LABELS: Record<MatchReasonCode, string> = {
  same_route: "Aynı rota",
  near_route: "Yakın rota / güzergâh uyumlu",
  corridor_route: "Aynı güzergâh",
  date_exact: "Tarih uyumu yüksek",
  date_close: "Yakın tarih",
  date_flexible: "Esnek tarih avantajı",
  capacity_fit: "Kapasite uygun",
  capacity_partial: "Sınırlı kapasite",
  vehicle_fit: "Araç tipi uygun",
  vehicle_small: "Araç kapasitesi sınırlı",
  insurance_match: "Sigortalı taşıma",
  elevator_match: "Asansörlü taşıma",
};

function qualityFromScore(score: number): MatchQualityLabel {
  if (score >= 90) return "Mükemmel Uyum";
  if (score >= 75) return "Yakın Rota";
  if (score >= 60) return "İyi Uyum";
  return "Alternatif Rota";
}

function reasonCodesFromProximity(
  type: RouteMatchType,
  routeScore: number,
): MatchReasonCode[] {
  const codes: MatchReasonCode[] = [];
  if (type === "exact" || routeScore >= 95) codes.push("same_route");
  else if (type === "near_destination") codes.push("near_route");
  else if (type === "corridor") codes.push("corridor_route");
  else if (routeScore >= 50) codes.push("near_route");
  return codes;
}

export function calculateRouteMatch(
  seeker: RouteMatchInput,
  carrier: RouteMatchInput,
): Pick<RouteMatchResult, "routeType" | "routeScore" | "reasons"> {
  const proximity = calculateRouteProximity(
    seeker.origin.city,
    seeker.destination.city,
    carrier.origin.city,
    carrier.destination.city,
  );

  const reasons = reasonCodesFromProximity(proximity.type, proximity.score);

  return {
    routeType: proximity.type,
    routeScore: proximity.score,
    reasons,
  };
}

export function calculateDateCompatibility(
  seeker: RouteMatchInput,
  carrier: CarrierMatchInput,
): { score: number; reasons: MatchReasonCode[] } {
  const reasons: MatchReasonCode[] = [];
  const seekerDate = seeker.date ?? carrier.date;
  const carrierDate = carrier.departureDate ?? carrier.date;

  if (!seekerDate && !carrierDate) {
    if (seeker.flexibleDate || carrier.flexibleDate) {
      reasons.push("date_flexible");
      return { score: 70, reasons };
    }
    return { score: 50, reasons };
  }

  if (!seekerDate || !carrierDate) {
    if (seeker.flexibleDate || carrier.flexibleDate) {
      reasons.push("date_flexible");
      return { score: 75, reasons };
    }
    return { score: 55, reasons };
  }

  const a = new Date(seekerDate);
  const b = new Date(carrierDate);
  const diffDays = Math.abs(
    Math.round((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24)),
  );

  if (diffDays === 0) {
    reasons.push("date_exact");
    let score = 100;
    if (seeker.timeStart && carrier.timeStart) {
      const [sh, sm] = seeker.timeStart.split(":").map(Number);
      const [ch, cm] = carrier.timeStart.split(":").map(Number);
      const seekerMins = sh * 60 + sm;
      const carrierMins = ch * 60 + cm;
      const timeDiff = Math.abs(seekerMins - carrierMins);
      if (timeDiff > 180) score -= 15;
      else if (timeDiff > 60) score -= 5;
    }
    return { score, reasons };
  }

  if (diffDays === 1) {
    reasons.push("date_close");
    return { score: 85, reasons };
  }

  if (diffDays <= 2) {
    reasons.push("date_close");
    return { score: 70, reasons };
  }

  if (seeker.flexibleDate || carrier.flexibleDate) {
    reasons.push("date_flexible");
    return { score: Math.max(60, 75 - diffDays * 5), reasons };
  }

  return { score: Math.max(20, 50 - diffDays * 8), reasons };
}

export function calculateCapacityMatch(
  loadType: LoadType,
  carrier: Pick<
    CarrierMatchInput,
    "availableCapacityPercent" | "canTakeRoomEquivalent"
  >,
): { score: number; reasons: MatchReasonCode[] } {
  const required = LOAD_ROOM_LEVEL[loadType] ?? 1;
  const offered = ROOM_LEVEL[carrier.canTakeRoomEquivalent as RoomEquivalent] ?? 0;
  const avail = carrier.availableCapacityPercent;

  const reasons: MatchReasonCode[] = [];

  if (required === 0) {
    if (avail >= 10) {
      reasons.push("capacity_fit");
      return { score: 95, reasons };
    }
    reasons.push("capacity_partial");
    return { score: 60, reasons };
  }

  if (offered >= required && avail >= 30) {
    reasons.push("capacity_fit");
    const bonus = Math.min(15, avail / 5);
    return { score: Math.min(100, 85 + bonus), reasons };
  }

  if (offered >= required - 1 && avail >= 15) {
    reasons.push("capacity_partial");
    return { score: 72, reasons };
  }

  if (offered < required) {
    reasons.push("capacity_partial");
    const gap = required - offered;
    return { score: Math.max(25, 65 - gap * 20), reasons };
  }

  reasons.push("capacity_partial");
  return { score: Math.max(30, avail), reasons };
}

export function calculateVehicleCompatibility(
  loadType: LoadType,
  vehicleType: VehicleType,
  preferredVehicleType?: string,
): { score: number; reasons: MatchReasonCode[] } {
  const reasons: MatchReasonCode[] = [];
  const required = LOAD_ROOM_LEVEL[loadType] ?? 1;
  const maxRoom = VEHICLE_MAX_ROOM[vehicleType];

  if (preferredVehicleType && preferredVehicleType === vehicleType) {
    reasons.push("vehicle_fit");
    return { score: 100, reasons };
  }

  if (loadType === "komple-ev" && maxRoom < 4) {
    reasons.push("vehicle_small");
    return { score: 35, reasons };
  }

  if (required <= maxRoom) {
    reasons.push("vehicle_fit");
    const headroom = maxRoom - required;
    return { score: Math.min(100, 75 + headroom * 8), reasons };
  }

  reasons.push("vehicle_small");
  return { score: Math.max(20, 50 - (required - maxRoom) * 15), reasons };
}

export function calculateFullMatch(
  seeker: RouteMatchInput,
  carrier: CarrierMatchInput,
  config: RouteMatchingConfig = DEFAULT_MATCHING_CONFIG,
): RouteMatchResult {
  const routePart = calculateRouteMatch(seeker, carrier);
  const datePart = calculateDateCompatibility(seeker, carrier);
  const capacityPart = calculateCapacityMatch(
    seeker.loadType ?? "parca-esya",
    carrier,
  );
  const vehiclePart = calculateVehicleCompatibility(
    seeker.loadType ?? "parca-esya",
    carrier.vehicleType,
    seeker.preferredVehicleType,
  );

  const reasons = [
    ...routePart.reasons,
    ...datePart.reasons,
    ...capacityPart.reasons,
    ...vehiclePart.reasons,
  ];

  if (carrier.hasTransportInsurance) reasons.push("insurance_match");
  if (carrier.hasLift) reasons.push("elevator_match");

  const uniqueReasons = [...new Set(reasons)];
  const w = config.weights;

  const total = Math.round(
    routePart.routeScore * w.route +
      datePart.score * w.date +
      capacityPart.score * w.capacity +
      vehiclePart.score * w.vehicle,
  );

  const clamped = Math.min(100, Math.max(0, total));

  return {
    routeType: routePart.routeType,
    routeScore: routePart.routeScore,
    dateScore: datePart.score,
    capacityScore: capacityPart.score,
    vehicleScore: vehiclePart.score,
    totalScore: clamped,
    qualityLabel: qualityFromScore(clamped),
    reasons: uniqueReasons,
    reasonLabels: uniqueReasons.map((c) => REASON_LABELS[c]),
  };
}

export function listingToSeekerInput(
  listing: Listing & { category: "nakliye-ariyorum" },
): RouteMatchInput {
  const d = listing.details;
  return {
    origin: { city: listing.cityFrom, district: listing.districtFrom },
    destination: { city: listing.cityTo ?? "", district: listing.districtTo },
    date: listing.availableDate,
    timeStart: listing.availableTimeStart,
    timeEnd: listing.availableTimeEnd,
    flexibleDate: d.flexibleDate,
    loadType: d.loadType,
    preferredVehicleType: d.preferredVehicleType,
  };
}

export function listingToCarrierInput(
  listing: Listing & { category: "nakliyeci-arac-ilani" },
): CarrierMatchInput {
  const d = listing.details;
  return {
    origin: { city: listing.cityFrom, district: listing.districtFrom },
    destination: { city: listing.cityTo ?? "", district: listing.districtTo },
    date: d.departureDate,
    timeStart: d.departureTimeStart,
    timeEnd: d.departureTimeEnd,
    flexibleDate: false,
    vehicleType: d.vehicleType,
    availableCapacityPercent: d.availableCapacityPercent,
    canTakeRoomEquivalent: d.canTakeRoomEquivalent,
    hasTransportInsurance: d.hasTransportInsurance,
    hasLift: d.hasLift,
    departureDate: d.departureDate,
    loadType: undefined,
  };
}

export function generateRouteSuggestions(
  source: Listing,
  candidates: Listing[],
  options?: GenerateSuggestionsOptions,
  config?: RouteMatchingConfig,
): RouteSuggestion[] {
  const cfg = config ?? DEFAULT_MATCHING_CONFIG;
  const limit = options?.limit ?? cfg.maxSuggestionsDefault;
  const minScore = options?.minScore ?? cfg.minScoreDefault;

  const suggestions: RouteSuggestion[] = [];

  if (source.category === "nakliye-ariyorum") {
    const seeker = listingToSeekerInput(source);
    for (const candidate of candidates) {
      if (candidate.category !== "nakliyeci-arac-ilani") continue;
      if (candidate.id === source.id) continue;
      const carrier = listingToCarrierInput(candidate);
      const match = calculateFullMatch(seeker, carrier, cfg);
      if (match.totalScore < minScore) continue;
      suggestions.push({
        listing: candidate,
        match,
        role: "carrier_for_seeker",
      });
    }
  } else if (source.category === "nakliyeci-arac-ilani") {
    const carrier = listingToCarrierInput(source);
    for (const candidate of candidates) {
      if (candidate.category !== "nakliye-ariyorum") continue;
      if (candidate.id === source.id) continue;
      const seeker = listingToSeekerInput(candidate);
      const match = calculateFullMatch(seeker, carrier, cfg);
      if (match.totalScore < minScore) continue;
      suggestions.push({
        listing: candidate,
        match,
        role: "seeker_for_carrier",
      });
    }
  }

  suggestions.sort((a, b) => b.match.totalScore - a.match.totalScore);
  return suggestions.slice(0, limit);
}

/** Skor rozeti rengi için yardımcı */
export function getScoreBadgeClass(score: number): string {
  if (score >= 90) return "bg-emerald-600 text-white";
  if (score >= 75) return "bg-sky-600 text-white";
  if (score >= 60) return "bg-navy-800 text-white";
  return "bg-cream-200 text-navy-800";
}
