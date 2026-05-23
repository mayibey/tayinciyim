/**
 * Şehir yakınlık — mock bölge grafiği.
 * Gelecek: Google Maps / Mapbox mesafe matrisi ile değiştirilebilir.
 */

const CITY_REGION: Record<string, string> = {
  istanbul: "marmara",
  bursa: "marmara",
  kocaeli: "marmara",
  tekirdag: "marmara",
  sakarya: "marmara",
  izmir: "ege",
  aydin: "ege",
  manisa: "ege",
  denizli: "ege",
  mugla: "ege",
  antalya: "akdeniz",
  mersin: "akdeniz",
  adana: "akdeniz",
  hatay: "akdeniz",
  ankara: "icanadolu",
  konya: "icanadolu",
  kayseri: "icanadolu",
  eskisehir: "icanadolu",
  samsun: "karadeniz",
  trabzon: "karadeniz",
  rize: "karadeniz",
  ordu: "karadeniz",
  erzurum: "dogu",
  van: "dogu",
  agri: "dogu",
  diyarbakir: "guneydogu",
  mardin: "guneydogu",
  siirt: "guneydogu",
  sanliurfa: "guneydogu",
  gaziantep: "guneydogu",
  malatya: "dogu",
  elazig: "dogu",
  batman: "guneydogu",
};

/** Komşu bölgeler — güzergâh üstü / yakın rota için */
const REGION_NEIGHBORS: Record<string, string[]> = {
  marmara: ["icanadolu", "karadeniz", "ege"],
  ege: ["marmara", "akdeniz", "icanadolu"],
  akdeniz: ["ege", "guneydogu", "icanadolu"],
  icanadolu: ["marmara", "ege", "akdeniz", "karadeniz", "dogu"],
  karadeniz: ["marmara", "icanadolu", "dogu"],
  dogu: ["karadeniz", "icanadolu", "guneydogu"],
  guneydogu: ["akdeniz", "dogu", "icanadolu"],
};

export function normalizeCity(city: string): string {
  return city
    .trim()
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/İ/g, "i");
}

export function getCityRegion(city: string): string | null {
  return CITY_REGION[normalizeCity(city)] ?? null;
}

export function areSameCity(a: string, b: string): boolean {
  return normalizeCity(a) === normalizeCity(b);
}

export function areNearbyCities(a: string, b: string): boolean {
  if (areSameCity(a, b)) return true;
  const ra = getCityRegion(a);
  const rb = getCityRegion(b);
  if (!ra || !rb) return false;
  if (ra === rb) return true;
  return REGION_NEIGHBORS[ra]?.includes(rb) ?? false;
}

export interface RouteProximityResult {
  type: "exact" | "near_destination" | "corridor" | "same_origin" | "alternative";
  score: number;
}

/**
 * İki rota arası yakınlık skoru (0–100).
 */
export function calculateRouteProximity(
  fromA: string,
  toA: string,
  fromB: string,
  toB: string,
): RouteProximityResult {
  const sameFrom = areSameCity(fromA, fromB);
  const sameTo = areSameCity(toA, toB);
  const nearTo = areNearbyCities(toA, toB);
  const nearFrom = areNearbyCities(fromA, fromB);

  if (sameFrom && sameTo) {
    return { type: "exact", score: 100 };
  }

  if (sameFrom && nearTo) {
    return { type: "near_destination", score: 88 };
  }

  if (sameFrom && !sameTo) {
    const ra = getCityRegion(toA);
    const rb = getCityRegion(toB);
    if (ra && rb && (ra === rb || REGION_NEIGHBORS[ra]?.includes(rb))) {
      return { type: "corridor", score: 78 };
    }
    return { type: "near_destination", score: 72 };
  }

  if (nearFrom && sameTo) {
    return { type: "corridor", score: 70 };
  }

  if (nearFrom && nearTo) {
    return { type: "corridor", score: 65 };
  }

  if (sameFrom || sameTo || nearFrom || nearTo) {
    return { type: "alternative", score: 55 };
  }

  return { type: "alternative", score: 25 };
}
