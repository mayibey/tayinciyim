import { ButtonLink } from "@/components/ui/Button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: "search" | "listings" | "inbox";
}

function EmptyIcon({ type }: { type: EmptyStateProps["icon"] }) {
  if (type === "search") {
    return (
      <svg className="h-12 w-12" fill="none" viewBox="0 0 48 48" aria-hidden>
        <circle cx="22" cy="22" r="12" stroke="currentColor" strokeWidth="2" className="text-navy-600/40" />
        <path d="M32 32l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-accent/60" />
      </svg>
    );
  }
  if (type === "inbox") {
    return (
      <svg className="h-12 w-12" fill="none" viewBox="0 0 48 48" aria-hidden>
        <rect x="8" y="12" width="32" height="24" rx="4" stroke="currentColor" strokeWidth="2" className="text-navy-600/40" />
        <path d="M8 18l16 10 16-10" stroke="currentColor" strokeWidth="2" className="text-accent/60" />
      </svg>
    );
  }
  return (
    <svg className="h-12 w-12" fill="none" viewBox="0 0 48 48" aria-hidden>
      <rect x="10" y="8" width="28" height="32" rx="4" stroke="currentColor" strokeWidth="2" className="text-navy-600/40" />
      <path d="M18 20h12M18 26h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-accent/60" />
    </svg>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  icon = "listings",
}: EmptyStateProps) {
  return (
    <div className="card-surface-lg flex flex-col items-center px-6 py-16 text-center sm:py-20">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-cream-100">
        <EmptyIcon type={icon} />
      </div>
      <h3 className="text-xl font-semibold text-navy-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{description}</p>
      {actionLabel && actionHref && (
        <ButtonLink href={actionHref} className="mt-8" size="md">
          {actionLabel}
        </ButtonLink>
      )}
    </div>
  );
}
