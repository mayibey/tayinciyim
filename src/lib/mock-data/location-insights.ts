import { normalizeCity } from "@/lib/matching/city-proximity";
import type { HomeLocationInsight, PointOfInterest } from "@/types/location-insights";

export function buildHomeMatchKey(
  city: string,
  district: string | undefined,
  neighborhood: string,
): string {
  return [normalizeCity(city), normalizeCity(district ?? ""), normalizeCity(neighborhood)].join(
    "|",
  );
}

function poi(
  partial: Omit<PointOfInterest, "id"> & { id?: string },
): PointOfInterest {
  return { id: partial.id ?? `poi-${partial.name.slice(0, 8)}`, ...partial };
}

const ANKARA_POIS: PointOfInterest[] = [
  poi({
    name: "Örnek İlkokul",
    type: "okul",
    city: "Ankara",
    district: "Çankaya",
    neighborhood: "Kızılay",
    distanceKm: 0.4,
    estimatedMinutes: 6,
  }),
  poi({
    name: "Örnek Devlet Hastanesi",
    type: "hastane",
    city: "Ankara",
    distanceKm: 1.2,
    estimatedMinutes: 8,
  }),
  poi({
    name: "Zincir Market",
    type: "market",
    city: "Ankara",
    distanceKm: 0.2,
    estimatedMinutes: 3,
  }),
  poi({
    name: "Metro / Otobüs Durağı",
    type: "toplu-tasima",
    city: "Ankara",
    distanceKm: 0.3,
    estimatedMinutes: 4,
    note: "Kızılay hattına yakın (demo)",
  }),
  poi({
    name: "Kurtuluş Parkı",
    type: "park",
    city: "Ankara",
    distanceKm: 0.6,
    estimatedMinutes: 8,
  }),
  poi({
    name: "Kamu Kurumu Bölgesi",
    type: "kurum",
    city: "Ankara",
    distanceKm: 0.8,
    estimatedMinutes: 10,
    note: "Bakanlık bölgesine örnek mesafe",
  }),
];

export const MOCK_HOME_LOCATION_INSIGHTS: HomeLocationInsight[] = [
  {
    matchKey: buildHomeMatchKey("Ankara", "Çankaya", "Kızılay"),
    approximateAddress: "Çankaya / Kızılay çevresi (mahalle düzeyi)",
    neighborhood: "Kızılay",
    latitude: 39.9208,
    longitude: 32.8541,
    distanceToInstitutionKm: 0.8,
    distanceToCityCenterKm: 1.2,
    nearbyPoints: ANKARA_POIS,
    locationScore: 88,
    transportationScore: 92,
    familySuitabilityScore: 85,
    socialOpportunityScore: 90,
    notes: "Merkezi konum; ulaşım ve sosyal imkânlar güçlü (örnek veri).",
  },
  {
    matchKey: buildHomeMatchKey("İzmir", "Bornova", "Erzene"),
    approximateAddress: "Bornova / Erzene mahallesi çevresi",
    neighborhood: "Erzene",
    latitude: 38.4622,
    longitude: 27.2208,
    distanceToInstitutionKm: 1.5,
    distanceToCityCenterKm: 8.5,
    nearbyPoints: [
      poi({ name: "Örnek Ortaokul", type: "okul", city: "İzmir", distanceKm: 0.5, estimatedMinutes: 7 }),
      poi({ name: "Eğitim Hastanesi", type: "hastane", city: "İzmir", distanceKm: 2.1, estimatedMinutes: 12 }),
      poi({ name: "Market", type: "market", city: "İzmir", distanceKm: 0.3, estimatedMinutes: 4 }),
      poi({ name: "Tramvay Durağı", type: "toplu-tasima", city: "İzmir", distanceKm: 0.7, estimatedMinutes: 9 }),
      poi({ name: "Spor Parkı", type: "park", city: "İzmir", distanceKm: 0.9, estimatedMinutes: 11 }),
    ],
    locationScore: 82,
    transportationScore: 78,
    familySuitabilityScore: 86,
    socialOpportunityScore: 80,
    notes: "Üniversite ve okul bölgesine yakın (demo).",
  },
  {
    matchKey: buildHomeMatchKey("Antalya", "Muratpaşa", "Şirinyalı"),
    approximateAddress: "Muratpaşa / Şirinyalı",
    neighborhood: "Şirinyalı",
    latitude: 36.8841,
    longitude: 30.7056,
    distanceToInstitutionKm: 2.5,
    distanceToCityCenterKm: 3.0,
    nearbyPoints: [
      poi({ name: "Sahil Parkı", type: "park", city: "Antalya", distanceKm: 0.4, estimatedMinutes: 5 }),
      poi({ name: "Market", type: "market", city: "Antalya", distanceKm: 0.5, estimatedMinutes: 6 }),
      poi({ name: "Otobüs Hattı", type: "toplu-tasima", city: "Antalya", distanceKm: 0.3, estimatedMinutes: 4 }),
      poi({ name: "Örnek AVM", type: "avm", city: "Antalya", distanceKm: 1.8, estimatedMinutes: 15 }),
    ],
    locationScore: 79,
    transportationScore: 72,
    familySuitabilityScore: 70,
    socialOpportunityScore: 84,
    notes: "Denize yakın; yaz sezonu yoğun (demo).",
  },
  {
    matchKey: buildHomeMatchKey("Erzurum", "Yakutiye", "Yenişehir"),
    approximateAddress: "Yakutiye / Yenişehir",
    neighborhood: "Yenişehir",
    latitude: 39.9043,
    longitude: 41.2679,
    distanceToInstitutionKm: 1.0,
    distanceToCityCenterKm: 2.2,
    nearbyPoints: [
      poi({ name: "Lojman Bölgesi", type: "kurum", city: "Erzurum", distanceKm: 0.6, estimatedMinutes: 8 }),
      poi({ name: "Devlet Hastanesi", type: "hastane", city: "Erzurum", distanceKm: 1.4, estimatedMinutes: 10 }),
      poi({ name: "Market", type: "market", city: "Erzurum", distanceKm: 0.4, estimatedMinutes: 5 }),
      poi({ name: "Otobüs Durağı", type: "toplu-tasima", city: "Erzurum", distanceKm: 0.5, estimatedMinutes: 6 }),
      poi({ name: "Mahalle Parkı", type: "park", city: "Erzurum", distanceKm: 0.3, estimatedMinutes: 4 }),
    ],
    locationScore: 80,
    transportationScore: 74,
    familySuitabilityScore: 82,
    socialOpportunityScore: 68,
    notes: "Kış koşullarına uygun merkez mahalle (demo).",
  },
  {
    matchKey: buildHomeMatchKey("Trabzon", "Ortahisar", "Boztepe altı"),
    approximateAddress: "Ortahisar / Boztepe altı",
    neighborhood: "Boztepe altı",
    latitude: 41.0053,
    longitude: 39.7307,
    distanceToInstitutionKm: 2.0,
    distanceToCityCenterKm: 2.8,
    nearbyPoints: [
      poi({ name: "İlkokul", type: "okul", city: "Trabzon", distanceKm: 0.7, estimatedMinutes: 10 }),
      poi({ name: "Hastane", type: "hastane", city: "Trabzon", distanceKm: 2.5, estimatedMinutes: 14 }),
      poi({ name: "Market", type: "market", city: "Trabzon", distanceKm: 0.6, estimatedMinutes: 8 }),
      poi({ name: "Manzara Parkı", type: "park", city: "Trabzon", distanceKm: 0.2, estimatedMinutes: 3 }),
    ],
    locationScore: 76,
    transportationScore: 68,
    familySuitabilityScore: 88,
    socialOpportunityScore: 72,
    notes: "Geniş aile evleri için uygun profil (demo).",
  },
];
