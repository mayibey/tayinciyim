import { SecurityNotice } from "@/components/listings/SecurityNotice";
import { LOCATION_DEMO_DISCLAIMER } from "@/lib/constants/location-disclaimer";

export function CityGuideDisclaimer() {
  return <SecurityNotice message={LOCATION_DEMO_DISCLAIMER} variant="info" />;
}
