interface OfficerTipsProps {
  tips: string[];
}

export function OfficerTips({ tips }: OfficerTipsProps) {
  if (tips.length === 0) return null;

  return (
    <div className="card-surface-lg p-6 sm:p-8">
      <h2 className="text-lg font-bold text-navy-900">Memur tavsiyeleri</h2>
      <ul className="mt-4 space-y-3">
        {tips.map((tip) => (
          <li
            key={tip}
            className="flex gap-3 rounded-xl bg-cream-50 px-4 py-3 text-sm leading-relaxed text-navy-800/90 ring-1 ring-[var(--border)]"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white">
              i
            </span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
