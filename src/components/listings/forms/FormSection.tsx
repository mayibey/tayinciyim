import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <fieldset className="space-y-4 rounded-2xl border border-[var(--border)] bg-cream-50/50 p-5 sm:p-6">
      <legend className="px-1 text-base font-bold text-navy-900">{title}</legend>
      {description && (
        <p className="-mt-2 text-sm text-muted">{description}</p>
      )}
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}
