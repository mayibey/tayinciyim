import Link from "next/link";
import type { CityGuide } from "@/types/location-insights";

interface CityGuideCardProps {
  guide: CityGuide;
}

export function CityGuideCard({ guide }: CityGuideCardProps) {
  return (
    <article className="card-surface flex flex-col overflow-hidden transition-smooth hover:shadow-card-hover">
      <div className="h-1 w-full bg-gradient-to-r from-navy-800 to-sky-600" />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h2 className="text-xl font-bold text-navy-900">{guide.city}</h2>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
          {guide.summary}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <ScorePill label="Aile" value={guide.familyScore} />
          <ScorePill label="Bekâr memur" value={guide.singleOfficerScore} />
          <ScorePill label="Ulaşım" value={guide.transportationScore} />
          <ScorePill label="Sosyal" value={guide.socialLifeScore} />
        </div>

        <p className="mt-3 text-xs font-medium text-navy-800">{guide.averageRentNote}</p>

        <Link
          href={`/sehir-rehberi/${guide.slug}`}
          className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white transition-smooth hover:bg-navy-800"
        >
          Detayı gör
        </Link>
      </div>
    </article>
  );
}

function ScorePill({ label, value }: { label: string; value: number }) {
  return (
    <span className="rounded-lg bg-cream-100 px-2 py-1 font-semibold text-navy-800">
      {label}: <span className="tabular-nums text-accent">{value}</span>
    </span>
  );
}
