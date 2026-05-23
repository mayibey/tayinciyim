interface NeighborhoodListProps {
  title: string;
  items: string[];
  variant: "recommended" | "caution";
}

export function NeighborhoodList({ title, items, variant }: NeighborhoodListProps) {
  if (items.length === 0) return null;

  const styles =
    variant === "recommended"
      ? "border-emerald-200/80 bg-emerald-50/50"
      : "border-amber-200/80 bg-amber-50/50";

  return (
    <div className={`rounded-2xl border p-4 sm:p-5 ${styles}`}>
      <h3 className="text-sm font-bold text-navy-900">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-navy-800/90">
            <span className="text-accent" aria-hidden>
              {variant === "recommended" ? "✓" : "!"}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
