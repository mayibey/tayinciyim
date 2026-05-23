import {
  getTrustScoreBg,
  getTrustScoreColor,
  getTrustScoreLabel,
} from "@/lib/trust/trust-score";

interface UserTrustBadgeProps {
  score: number;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export function UserTrustBadge({
  score,
  showLabel = false,
  size = "sm",
}: UserTrustBadgeProps) {
  const label = getTrustScoreLabel(score);
  const color = getTrustScoreColor(score);
  const bg = getTrustScoreBg(score);

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ring-1 ${bg} ${color} ${
        size === "md" ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[10px] sm:text-xs"
      }`}
      title={label}
    >
      <span className="tabular-nums">Güven {score}</span>
      {showLabel && <span className="hidden font-medium opacity-80 sm:inline">· {label}</span>}
    </span>
  );
}
