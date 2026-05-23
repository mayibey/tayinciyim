interface UserRatingSummaryProps {
  average: number;
  count: number;
  compact?: boolean;
}

export function UserRatingSummary({
  average,
  count,
  compact = false,
}: UserRatingSummaryProps) {
  if (count === 0) {
    return (
      <span className={`text-muted ${compact ? "text-[10px] sm:text-xs" : "text-xs"}`}>
        Henüz puan yok
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-0.5 font-semibold text-navy-800 ${
        compact ? "text-[10px] sm:text-xs" : "text-xs sm:text-sm"
      }`}
      title={`${count} değerlendirme`}
    >
      <span className="text-amber-500" aria-hidden>
        ★
      </span>
      <span className="tabular-nums">{average.toFixed(1)}</span>
      {!compact && (
        <span className="font-medium text-muted">({count})</span>
      )}
    </span>
  );
}
