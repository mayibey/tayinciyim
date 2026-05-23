export type PointOfInterestType =
  | "okul"
  | "hastane"
  | "market"
  | "toplu-tasima"
  | "park"
  | "avm"
  | "kurum"
  | "resmi-daire"
  | "terminal"
  | "havalimani"
  | "sosyal-alan";

export interface CityGuide {
  city: string;
  district?: string;
  slug: string;
  summary: string;
  familyScore: number;
  singleOfficerScore: number;
  transportationScore: number;
  rentLevelScore: number;
  safetyScore: number;
  socialLifeScore: number;
  averageRentNote: string;
  recommendedNeighborhoods: string[];
  cautionNeighborhoods: string[];
  publicTransportNote: string;
  schoolNote: string;
  hospitalNote: string;
  marketNote: string;
  socialLifeNote: string;
  officerTips: string[];
  lastUpdatedAt: string;
}

export interface PointOfInterest {
  id: string;
  name: string;
  type: PointOfInterestType;
  city: string;
  district?: string;
  neighborhood?: string;
  distanceKm: number;
  estimatedMinutes?: number;
  note?: string;
}

export interface HomeLocationInsight {
  listingId?: string;
  matchKey: string;
  approximateAddress: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  distanceToInstitutionKm?: number;
  distanceToCityCenterKm: number;
  nearbyPoints: PointOfInterest[];
  locationScore: number;
  transportationScore: number;
  familySuitabilityScore: number;
  socialOpportunityScore: number;
  notes?: string;
}
