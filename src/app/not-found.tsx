import { EmptyState } from "@/components/ui/EmptyState";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:py-24">
      <EmptyState
        icon="search"
        title="Sayfa bulunamadı"
        description="Aradığınız sayfa veya ilan kaldırılmış ya da hiç var olmamış olabilir."
        actionLabel="Ana sayfaya dön"
        actionHref="/"
      />
    </div>
  );
}
