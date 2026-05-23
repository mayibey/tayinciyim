import { RouteMatchCard } from "@/components/listings/matching/RouteMatchCard";
import type { RouteSuggestion } from "@/types/matching";

interface RouteSuggestionListProps {
  title: string;
  subtitle?: string;
  suggestions: RouteSuggestion[];
  sourceTitle?: string;
  emptyMessage?: string;
}

export function RouteSuggestionList({
  title,
  subtitle,
  suggestions,
  sourceTitle,
  emptyMessage,
}: RouteSuggestionListProps) {
  if (suggestions.length === 0) {
    if (!emptyMessage) return null;
    return (
      <section className="card-surface-lg p-6 sm:p-8">
        <h2 className="text-xl font-bold text-navy-900">{title}</h2>
        <p className="mt-3 text-sm text-muted">{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section className="card-surface-lg overflow-hidden p-0">
      <div className="h-1 w-full bg-gradient-to-r from-navy-800 via-sky-600 to-accent" />
      <div className="border-b border-[var(--border)] px-6 py-5 sm:px-8">
        <h2 className="text-xl font-bold text-navy-900 sm:text-2xl">{title}</h2>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{subtitle}</p>
        )}
        <p className="mt-2 text-xs font-semibold text-navy-800/70">
          {suggestions.length} öneri · Skorlar rota, tarih, kapasite ve araç tipine göre hesaplanır
        </p>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-2 xl:gap-5">
        {suggestions.map((s) => (
          <RouteMatchCard
            key={s.listing.id}
            suggestion={s}
            sourceTitle={sourceTitle}
          />
        ))}
      </div>
    </section>
  );
}
