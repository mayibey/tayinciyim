import { HomeLocationInsightPanel } from "@/components/location/HomeLocationInsightPanel";
import { resolveHomeLocationInsight } from "@/lib/location/location-insights";
import type { Listing } from "@/types/listing";

export function EvLocationInsightSection({
  listing,
}: {
  listing: Listing & { category: "ev-devri" };
}) {
  const insight = resolveHomeLocationInsight(listing);
  if (!insight) return null;
  return <HomeLocationInsightPanel insight={insight} />;
}
