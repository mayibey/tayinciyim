interface SecurityNoticeProps {
  message: string;
  variant?: "warning" | "info";
}

export function SecurityNotice({ message, variant = "warning" }: SecurityNoticeProps) {
  const styles =
    variant === "warning"
      ? "border-amber-200/80 bg-amber-50 text-amber-900"
      : "border-navy-900/10 bg-cream-100 text-navy-800";

  return (
    <div
      className={`flex gap-3 rounded-2xl border px-4 py-3 text-sm leading-relaxed ${styles}`}
      role="note"
    >
      <svg
        className="mt-0.5 h-5 w-5 shrink-0 text-accent"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        />
      </svg>
      <p>{message}</p>
    </div>
  );
}
