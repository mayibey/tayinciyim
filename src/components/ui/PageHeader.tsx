interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
}

export function PageHeader({ title, description, badge }: PageHeaderProps) {
  return (
    <div className="mb-8 sm:mb-10">
      {badge && (
        <span className="mb-3 inline-flex rounded-full bg-navy-900/8 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy-800">
          {badge}
        </span>
      )}
      <h1 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
