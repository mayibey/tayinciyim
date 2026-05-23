import { MOCK_CITY_GUIDES } from "@/lib/mock-data/city-guides";
import {
  MOCK_HOME_LOCATION_INSIGHTS,
  buildHomeMatchKey,
} from "@/lib/mock-data/location-insights";
import { normalizeCity } from "@/lib/matching/city-proximity";
import type { Listing } from "@/types/listing";
import type {
  CityGuide,
  HomeLocationInsight,
  PointOfInterest,
  PointOfInterestType,
} from "@/types/location-insights";
import type { EvDevriDetails } from "@/types/listing-fields";

// TODO: gerçek harita API (Google Maps / Mapbox)
// TODO: Google Places POI entegrasyonu
// TODO: kurum mesafe hesaplama (geocoding)
// TODO: kullanıcı yorumlarından şehir puanı üretme
// TODO: moderasyonlu şehir tavsiyeleri
// TODO: tam adres gizlilik kontrolü

const POI_TYPE_LABELS: Record<PointOfInterestType, string> = {
  okul: "Okul",
  hastane: "Hastane",
  market: "Market",
  "toplu-tasima": "Toplu taşıma",
  park: "Park",
  avm: "AVM",
  kurum: "Kurum",
  "resmi-daire": "Resmi daire",
  terminal: "Terminal",
  havalimani: "Havalimanı",
  "sosyal-alan": "Sosyal alan",
};

export function getAllCityGuides(): CityGuide[] {
  return [...MOCK_CITY_GUIDES];
}

export function getCityGuide(city: string, district?: string): CityGuide | null {
  const slug = normalizeCity(city);
  const guides = MOCK_CITY_GUIDES.filter((g) => g.slug === slug);
  if (guides.length === 0) return null;
  if (!district) return guides[0];
  const dSlug = normalizeCity(district);
  return guides.find((g) => g.district && normalizeCity(g.district) === dSlug) ?? guides[0];
}

export function getCityGuideBySlug(slug: string): CityGuide | null {
  return MOCK_CITY_GUIDES.find((g) => g.slug === normalizeCity(slug)) ?? null;
}

export function searchCityGuides(query: string): CityGuide[] {
  const q = query.trim().toLowerCase();
  if (!q) return getAllCityGuides();
  return MOCK_CITY_GUIDES.filter(
    (g) =>
      g.city.toLowerCase().includes(q) ||
      g.slug.includes(normalizeCity(q)) ||
      g.summary.toLowerCase().includes(q),
  );
}

export function getHomeLocationInsight(listingId: string): HomeLocationInsight | null {
  const byId = MOCK_HOME_LOCATION_INSIGHTS.find((i) => i.listingId === listingId);
  return byId ?? null;
}

export function resolveHomeLocationInsight(
  listing: Listing,
): HomeLocationInsight | null {
  if (listing.category !== "ev-devri") return null;

  const key = buildHomeMatchKey(
    listing.cityFrom,
    listing.districtFrom,
    listing.details.neighborhood,
  );

  const stored =
    MOCK_HOME_LOCATION_INSIGHTS.find((i) => i.matchKey === key) ??
    MOCK_HOME_LOCATION_INSIGHTS.find(
      (i) => normalizeCity(i.neighborhood) === normalizeCity(listing.details.neighborhood) &&
        i.approximateAddress.toLowerCase().includes(normalizeCity(listing.cityFrom)),
    );

  if (stored) {
    return { ...stored, listingId: listing.id };
  }

  return buildFallbackHomeInsight(listing);
}

export function getNearbyPoints(listingId: string): PointOfInterest[] {
  const insight = getHomeLocationInsight(listingId);
  return insight?.nearbyPoints ?? [];
}

export function getNearbyPointsForListing(listing: Listing): PointOfInterest[] {
  return resolveHomeLocationInsight(listing)?.nearbyPoints ?? [];
}

function buildFallbackHomeInsight(
  listing: Listing & { category: "ev-devri" },
): HomeLocationInsight {
  const d = listing.details;
  const guide = getCityGuide(listing.cityFrom);
  const baseTransport = guide?.transportationScore ?? 70;
  const baseFamily = guide?.familyScore ?? 72;
  const baseSocial = guide?.socialLifeScore ?? 70;

  return {
    listingId: listing.id,
    matchKey: buildHomeMatchKey(listing.cityFrom, listing.districtFrom, d.neighborhood),
    approximateAddress: `${listing.districtFrom ?? listing.cityFrom} / ${d.neighborhood} (yaklaşık)`,
    neighborhood: d.neighborhood,
    latitude: 39.0,
    longitude: 35.0,
    distanceToInstitutionKm: d.nearInstitutionProximity ? 1.0 : 2.5,
    distanceToCityCenterKm: d.estimatedDistanceToCenterKm ?? 3.5,
    nearbyPoints: buildFallbackPois(listing.cityFrom, d),
    locationScore: Math.round((baseTransport + baseFamily) / 2),
    transportationScore: d.nearPublicTransport ? baseTransport : baseTransport - 10,
    familySuitabilityScore: d.familyFriendly ? baseFamily : baseFamily - 8,
    socialOpportunityScore: d.nearParkOrSocial ? baseSocial : baseSocial - 5,
    notes: "Otomatik oluşturulan örnek konum analizi; form ve şehir rehberi verilerine dayanır.",
  };
}

function buildFallbackPois(city: string, d: EvDevriDetails): PointOfInterest[] {
  const points: PointOfInterest[] = [];
  if (d.nearSchool) {
    points.push({
      id: "fb-school",
      name: "Yakın okul (örnek)",
      type: "okul",
      city,
      distanceKm: 0.6,
      estimatedMinutes: 8,
    });
  }
  if (d.nearMarket) {
    points.push({
      id: "fb-market",
      name: "Market (örnek)",
      type: "market",
      city,
      distanceKm: 0.3,
      estimatedMinutes: 4,
    });
  }
  if (d.nearPublicTransport) {
    points.push({
      id: "fb-transit",
      name: "Toplu taşıma (örnek)",
      type: "toplu-tasima",
      city,
      distanceKm: 0.4,
      estimatedMinutes: 5,
    });
  }
  if (d.nearParkOrSocial) {
    points.push({
      id: "fb-park",
      name: "Park / sosyal alan (örnek)",
      type: "park",
      city,
      distanceKm: 0.5,
      estimatedMinutes: 6,
    });
  }
  if (d.nearInstitutionProximity || d.nearbyInstitution) {
    points.push({
      id: "fb-kurum",
      name: "Kurum bölgesi (örnek)",
      type: "kurum",
      city,
      distanceKm: 1.0,
      estimatedMinutes: 12,
      note: d.nearbyInstitution,
    });
  }
  return points;
}

export type LocationScoreLabel =
  | "Çok İyi"
  | "İyi"
  | "Orta"
  | "Düşük";

export function getLocationScoreLabel(score: number): LocationScoreLabel {
  if (score >= 85) return "Çok İyi";
  if (score >= 70) return "İyi";
  if (score >= 55) return "Orta";
  return "Düşük";
}

export function getPointTypeLabel(type: PointOfInterestType): string {
  return POI_TYPE_LABELS[type];
}

export function formatDistanceKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1).replace(".", ",")} km`;
}

export function formatEstimatedMinutes(minutes: number | undefined): string {
  if (minutes == null) return "—";
  if (minutes < 60) return `~${minutes} dk`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `~${h} sa ${m} dk` : `~${h} sa`;
}
