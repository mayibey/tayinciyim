import { ListingCard } from "@/components/listings/ListingCard";
import { ListingFilterPanel } from "@/components/listings/ListingFilterPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { CATEGORIES, getCategoryConfig } from "@/lib/categories";
import { getListings } from "@/lib/data/listings";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { CategorySlug } from "@/types/listing";

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateMetadata({ searchParams }: PageProps) {
  const params = await searchParams;
  if (params.kategori === "hizmet-verenler") {
    return buildPageMetadata({
      title: "Tayin Sonrası Temizlik, Boya ve Ev Onarım Hizmetleri",
      description:
        "Temizlik, boya badana, tesisat, elektrik, montaj ve yerleşme hizmetleri — tayin sonrası güvenilir hizmet verenler.",
      path: "/ilanlar?kategori=hizmet-verenler",
    });
  }
  return buildPageMetadata({
    title: "İlanlar",
    description:
      "Ev devri, eşya devri, nakliye, şehir soruları ve hizmet verenler — kamu tayini ilanları.",
    path: "/ilanlar",
  });
}

export default async function IlanlarPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const categoryParam = params.kategori;
  const validCategory = CATEGORIES.some((c) => c.slug === categoryParam)
    ? (categoryParam as CategorySlug)
    : undefined;

  const listings = await getListings({
    category: validCategory,
    searchParams: params,
  });

  const activeCategoryName = validCategory
    ? getCategoryConfig(validCategory)?.label
    : null;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
      <PageHeader
        badge="İlanlar"
        title={activeCategoryName ?? "Tüm İlanlar"}
        description={
          validCategory
            ? `${listings.length} ilan listeleniyor.`
            : "Ev devri, eşya devri, nakliye ve şehir soruları — memur topluluğundan güncel paylaşımlar."
        }
      />

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        <div className="min-w-0 lg:w-72 lg:shrink-0">
          <ListingFilterPanel activeCategory={validCategory} searchParams={params} />
        </div>

        <div className="min-w-0 flex-1">
          {listings.length > 0 ? (
            <>
              <p className="mb-5 text-sm font-medium text-muted">
                {listings.length} ilan bulundu
              </p>
              <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              icon="search"
              title="Bu kritere uygun ilan bulunamadı"
              description="Bu kritere uygun ilan bulunamadı. İlk ilanı sen verebilirsin."
              actionLabel="İlan Ver"
              actionHref="/ilan-ver"
            />
          )}
        </div>
      </div>
    </div>
  );
}
