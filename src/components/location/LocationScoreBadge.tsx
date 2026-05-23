import { getLocationScoreLabel } from "@/lib/location/location-insights";

interface LocationScoreBadgeProps {
  score: number;
  label: string;
}

export function LocationScoreBadge({ score, label }: LocationScoreBadgeProps) {
  const quality = getLocationScoreLabel(score);
  const color =
    score >= 85
      ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
      : score >= 70
        ? "bg-sky-50 text-sky-800 ring-sky-200"
        : score >= 55
          ? "bg-amber-50 text-amber-900 ring-amber-200"
          : "bg-cream-200 text-navy-800 ring-[var(--border)]";

  return (
    <div className={`rounded-2xl px-4 py-3 ring-1 ${color}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{score}</p>
      <p className="text-xs font-medium opacity-90">{quality}</p>
    </div>
  );
}
