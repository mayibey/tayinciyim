import type { ReactNode } from "react";

export function DetailTable({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="card-surface-lg overflow-hidden p-0">
      <div className="border-b border-[var(--border)] bg-cream-50 px-5 py-3 sm:px-6">
        <h2 className="font-bold text-navy-900">{title}</h2>
      </div>
      <dl className="divide-y divide-[var(--border)]">{children}</dl>
    </div>
  );
}

export function DetailRow({
  label,
  value,
  full,
}: {
  label: string;
  value?: string | number | null;
  full?: boolean;
}) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div
      className={`grid gap-1 px-5 py-3 sm:grid-cols-3 sm:gap-4 sm:px-6 ${full ? "sm:grid-cols-1" : ""}`}
    >
      <dt className="text-sm font-semibold text-muted">{label}</dt>
      <dd
        className={`text-sm text-navy-900 ${full ? "" : "sm:col-span-2"}`}
      >
        {value}
      </dd>
    </div>
  );
}
