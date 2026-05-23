import Link from "next/link";
import type { ReactNode } from "react";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { TrCitiesDatalist } from "@/components/location/TrCitiesDatalist";
import { CATEGORIES, getCategoryConfig } from "@/lib/categories";
import type { CategorySlug } from "@/types/listing";

interface ListingFilterPanelProps {
  activeCategory?: CategorySlug;
  searchParams: Record<string, string | undefined>;
}

export function ListingFilterPanel({
  activeCategory,
  searchParams,
}: ListingFilterPanelProps) {
  const config = activeCategory ? getCategoryConfig(activeCategory) : undefined;
  const hasFilters = Object.values(searchParams).some((v) => v && v !== "");

  const buildHref = (cat?: CategorySlug) => {
    if (!cat) return "/ilanlar";
    return `/ilanlar?kategori=${cat}`;
  };

  return (
    <aside className="card-surface-lg top-24 overflow-hidden p-0 lg:sticky lg:top-28">
      <div className="border-b border-[var(--border)] bg-navy-900 px-5 py-4">
        <h2 className="text-sm font-semibold text-white">Filtrele</h2>
        <p className="mt-0.5 text-xs text-cream-200/70">
          {config ? config.label : "Kategori seçin"}
        </p>
      </div>

      <div className="p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
          Kategori
        </p>
        <ul className="mb-6 flex flex-col gap-1.5">
          <li>
            <FilterLink href={buildHref()} active={!activeCategory} icon={null} label="Tüm ilanlar" />
          </li>
          {CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <FilterLink
                href={buildHref(cat.slug)}
                active={activeCategory === cat.slug}
                icon={<CategoryIcon slug={cat.slug} className="h-4 w-4" />}
                label={cat.label}
              />
            </li>
          ))}
        </ul>

        {config && (
          <form method="get" className="space-y-4 border-t border-[var(--border)] pt-5">
            <input type="hidden" name="kategori" value={activeCategory} />
            <TrCitiesDatalist />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              {config.label} filtreleri
            </p>
            {config.filterFields.map((field) => (
              <FilterField key={field.key} field={field} defaultValue={searchParams[field.key]} />
            ))}
            <button
              type="submit"
              className="w-full rounded-xl bg-navy-900 py-2.5 text-sm font-semibold text-white transition-smooth hover:bg-navy-800"
            >
              Filtrele
            </button>
          </form>
        )}

        {hasFilters && (
          <Link
            href={activeCategory ? `/ilanlar?kategori=${activeCategory}` : "/ilanlar"}
            className="mt-4 flex w-full justify-center rounded-xl border border-dashed border-navy-900/15 py-2 text-xs font-semibold text-muted hover:border-accent hover:text-accent"
          >
            Filtreleri temizle
          </Link>
        )}
      </div>
    </aside>
  );
}

function FilterField({
  field,
  defaultValue,
}: {
  field: { key: string; label: string; type: string; options?: { value: string; label: string }[]; placeholder?: string };
  defaultValue?: string;
}) {
  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-sm text-navy-800">
        <input
          type="checkbox"
          name={field.key}
          value="1"
          defaultChecked={defaultValue === "1"}
          className="rounded text-accent"
        />
        {field.label}
      </label>
    );
  }

  if (field.type === "select" && field.options) {
    return (
      <div>
        <label className="mb-1 block text-xs font-semibold text-navy-800">{field.label}</label>
        <select
          name={field.key}
          defaultValue={defaultValue ?? ""}
          className="w-full rounded-xl border border-navy-900/10 bg-cream-50/80 px-3 py-2 text-sm"
        >
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "city") {
    return (
      <div>
        <label className="mb-1 block text-xs font-semibold text-navy-800">{field.label}</label>
        <input
          type="text"
          name={field.key}
          defaultValue={defaultValue ?? ""}
          list="tr-cities"
          placeholder={field.placeholder}
          className="w-full rounded-xl border border-navy-900/10 bg-cream-50/80 px-3 py-2 text-sm"
        />
      </div>
    );
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-navy-800">{field.label}</label>
      <input
        type="text"
        name={field.key}
        defaultValue={defaultValue ?? ""}
        placeholder={field.placeholder}
        className="w-full rounded-xl border border-navy-900/10 bg-cream-50/80 px-3 py-2 text-sm"
      />
    </div>
  );
}

function FilterLink({
  href,
  active,
  icon,
  label,
}: {
  href: string;
  active: boolean;
  icon: ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-smooth ${
        active ? "bg-navy-900 text-white shadow-soft" : "text-navy-800 hover:bg-cream-100"
      }`}
    >
      {icon && <span className={active ? "text-accent-soft" : "text-accent"}>{icon}</span>}
      {label}
    </Link>
  );
}
