import { LocationScoreBadge } from "@/components/location/LocationScoreBadge";
import type { CityGuide } from "@/types/location-insights";

export function CityScoreGrid({ guide }: { guide: CityGuide }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <LocationScoreBadge score={guide.familyScore} label="Aile uyumu" />
      <LocationScoreBadge score={guide.singleOfficerScore} label="Bekâr memur" />
      <LocationScoreBadge score={guide.transportationScore} label="Ulaşım" />
      <LocationScoreBadge score={guide.rentLevelScore} label="Kira (uygunluk)" />
      <LocationScoreBadge score={guide.safetyScore} label="Güvenlik" />
      <LocationScoreBadge score={guide.socialLifeScore} label="Sosyal yaşam" />
    </div>
  );
}
