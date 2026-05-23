import Link from "next/link";
import { ListingCard } from "@/components/listings/ListingCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { PUBLIC_LISTING_STATUS } from "@/lib/constants/listing-status";
import { getListings } from "@/lib/data/listings";

export async function RecentListings() {
  const recentListings = (
    await getListings({ status: PUBLIC_LISTING_STATUS })
  ).slice(0, 6);
  const isEmpty = recentListings.length === 0;

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">Son İlanlar</h2>
          <p className="mt-1 text-muted">Topluluktan güncel paylaşımlar</p>
        </div>
        {!isEmpty && (
          <Link
            href="/ilanlar"
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent transition-smooth hover:gap-2"
          >
            Tümünü gör
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
      {isEmpty ? (
        <EmptyState
          icon="listings"
          title="Henüz ilan yok"
          description="İlk ilanı sen ver — topluluk seninle başlasın."
          actionLabel="İlan Ver"
          actionHref="/ilan-ver"
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recentListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </>
  );
}
