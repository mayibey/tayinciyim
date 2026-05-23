import { AdminListingTable } from "@/components/admin/AdminListingTable";
import { ProductionChecklist } from "@/components/admin/ProductionChecklist";
import { CategoryBadge } from "@/components/listings/CategoryBadge";
import { PageHeader } from "@/components/ui/PageHeader";
import { CATEGORIES } from "@/lib/categories";
import { getListingStats, getListings } from "@/lib/data/listings";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Admin Panel",
  path: "/admin",
  noIndex: true,
});

export default async function AdminPage() {
  const [listings, stats] = await Promise.all([
    getListings({ includeAllStatuses: true }),
    getListingStats(),
  ]);

  const supabaseReady = hasSupabaseEnv();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <ProductionChecklist />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          badge="Yönetim"
          title="Admin Panel"
          description="İlanları yönetin, durumlarını güncelleyin ve kategori dağılımını izleyin."
        />
        <span
          className={`inline-flex w-fit shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold ${
            supabaseReady
              ? "bg-navy-900/8 text-navy-800 ring-1 ring-navy-900/10"
              : "bg-accent-soft text-accent ring-1 ring-accent/20"
          }`}
        >
          Supabase: {supabaseReady ? "Bağlı" : "Mock veri"}
        </span>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Toplam ilan" value={stats.total} accent />
        <StatCard label="Yayında" value={stats.approved} />
        <StatCard label="Beklemede" value={stats.pending} />
        <StatCard label="Reddedildi" value={stats.rejected} />
      </div>

      <div className="card-surface-lg mb-8 p-6">
        <h2 className="font-semibold text-navy-900">Kategoriye göre</h2>
        <div className="mt-4 flex flex-wrap gap-6">
          {CATEGORIES.map((cat) => (
            <div key={cat.slug} className="flex items-center gap-3">
              <CategoryBadge slug={cat.slug} size="md" />
              <span className="text-2xl font-bold text-navy-900">
                {stats.byCategory[cat.slug] ?? 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-navy-900">Tüm ilanlar</h2>
      <AdminListingTable listings={listings} />
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`card-surface-lg p-6 transition-smooth hover:shadow-card-hover ${
        accent ? "border-accent/20 bg-gradient-to-br from-card to-accent-soft/30" : ""
      }`}
    >
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${accent ? "text-accent" : "text-navy-900"}`}>
        {value}
      </p>
    </div>
  );
}
