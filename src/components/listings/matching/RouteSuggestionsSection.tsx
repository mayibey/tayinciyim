import { RouteSuggestionList } from "@/components/listings/matching/RouteSuggestionList";
import { getRouteMatchCandidates } from "@/lib/matching/get-candidates";
import { generateRouteSuggestions } from "@/lib/matching/route-matching";
import type { Listing } from "@/types/listing";

const SECTION_COPY = {
  "nakliye-ariyorum": {
    title: "Bu rotaya uygun araçlar",
    subtitle:
      "Aynı rota, yakın rota ve güzergâh üzerindeki nakliyeci araç ilanları; tarih ve kapasite uyumuna göre sıralanır.",
  },
  "nakliyeci-arac-ilani": {
    title: "Bu araç için uygun yük arayanlar",
    subtitle:
      "Rotanıza ve boş kapasitenize uygun nakliye arayan ilanlar; eşleşme skoru ile önceliklendirilir.",
  },
} as const;

export async function RouteSuggestionsSection({ listing }: { listing: Listing }) {
  if (
    listing.category !== "nakliye-ariyorum" &&
    listing.category !== "nakliyeci-arac-ilani"
  ) {
    return null;
  }

  const candidates = await getRouteMatchCandidates(listing);
  const suggestions = generateRouteSuggestions(listing, candidates, {
    limit: 6,
    minScore: 55,
  });

  if (suggestions.length === 0) return null;

  const copy = SECTION_COPY[listing.category];

  return (
    <RouteSuggestionList
      title={copy.title}
      subtitle={copy.subtitle}
      suggestions={suggestions}
      sourceTitle={listing.title}
    />
  );
}
