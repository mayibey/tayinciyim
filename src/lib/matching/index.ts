export {
  calculateRouteMatch,
  calculateCapacityMatch,
  calculateDateCompatibility,
  calculateVehicleCompatibility,
  calculateFullMatch,
  generateRouteSuggestions,
  getScoreBadgeClass,
  DEFAULT_MATCHING_CONFIG,
} from "@/lib/matching/route-matching";
export {
  normalizeCity,
  getCityRegion,
  areNearbyCities,
  calculateRouteProximity,
} from "@/lib/matching/city-proximity";
export { getRouteMatchCandidates } from "@/lib/matching/get-candidates";
