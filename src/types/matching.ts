import type { Listing } from "@/types/listing";
import type { LoadType, VehicleType } from "@/types/listing-fields";

export type RouteMatchType =
  | "exact"
  | "near_destination"
  | "corridor"
  | "alternative"
  | "same_origin";

export type MatchQualityLabel =
  | "Mükemmel Uyum"
  | "Yakın Rota"
  | "İyi Uyum"
  | "Alternatif Rota";

export type MatchReasonCode =
  | "same_route"
  | "near_route"
  | "corridor_route"
  | "date_exact"
  | "date_close"
  | "date_flexible"
  | "capacity_fit"
  | "capacity_partial"
  | "vehicle_fit"
  | "vehicle_small"
  | "insurance_match"
  | "elevator_match";

export interface RoutePoint {
  city: string;
  district?: string;
}

export interface RouteMatchInput {
  origin: RoutePoint;
  destination: RoutePoint;
  date?: string;
  timeStart?: string;
  timeEnd?: string;
  flexibleDate?: boolean;
  loadType?: LoadType;
  preferredVehicleType?: string;
}

export interface CarrierMatchInput extends RouteMatchInput {
  vehicleType: VehicleType;
  availableCapacityPercent: number;
  canTakeRoomEquivalent: string;
  hasTransportInsurance: boolean;
  hasLift: boolean;
  departureDate?: string;
}

export interface RouteScoreBreakdown {
  route: number;
  date: number;
  capacity: number;
  vehicle: number;
  total: number;
}

export interface RouteMatchResult {
  routeType: RouteMatchType;
  routeScore: number;
  dateScore: number;
  capacityScore: number;
  vehicleScore: number;
  totalScore: number;
  qualityLabel: MatchQualityLabel;
  reasons: MatchReasonCode[];
  reasonLabels: string[];
}

export interface RouteSuggestion {
  listing: Listing;
  match: RouteMatchResult;
  /** Nakliye arıyorum ↔ nakliyeci eşleşmesinde hangi taraf önerildi */
  role: "carrier_for_seeker" | "seeker_for_carrier";
}

export interface GenerateSuggestionsOptions {
  limit?: number;
  minScore?: number;
  /** Gelecek: harita mesafesi km */
  useMapDistance?: boolean;
}
