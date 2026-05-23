/**
 * Gelecek harita / mesafe sağlayıcıları için arayüz.
 * Google Maps, Mapbox veya AI öneri motoru bu kontrata uyarlanabilir.
 */

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface RouteDistanceResult {
  distanceKm: number;
  durationMinutes?: number;
  /** 0–100, rota skoruna eklenebilir */
  proximityScore?: number;
}

export interface MapRouteProvider {
  readonly id: "mock" | "google" | "mapbox";
  getDistanceBetweenCities(
    fromCity: string,
    toCity: string,
  ): Promise<RouteDistanceResult | null>;
  /** İki şehir aynı koridorda mı (canlı rota) */
  isOnCorridor?(
    origin: string,
    destination: string,
    viaCity: string,
  ): Promise<boolean>;
}
