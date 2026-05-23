import Link from "next/link";
import { EvLocationInsightSection } from "@/components/listings/detail/EvLocationInsightSection";
import { SehirSorusuGuideSection } from "@/components/listings/detail/SehirSorusuGuideSection";
import { PostMoveServicesSection } from "@/components/listings/detail/PostMoveServicesSection";
import { RouteSuggestionsSection } from "@/components/listings/matching/RouteSuggestionsSection";
import { getListings } from "@/lib/data/listings";
import { PUBLIC_LISTING_STATUS } from "@/lib/constants/listing-status";
import { CategoryDetailPanel } from "@/components/listings/detail/CategoryDetailPanel";
import { ListingContactCard } from "@/components/listings/detail/ListingContactCard";
import { ListingGallery } from "@/components/listings/detail/ListingGallery";
import { CategoryBadge } from "@/components/listings/CategoryBadge";
import { ListingStatusBadge } from "@/components/ui/Badge";
import { getCategoryBySlug } from "@/lib/categories";
import { getListingImages } from "@/lib/listing-images";
import { resolveListingAuthorAsync } from "@/lib/users/resolve-user-server";
import { formatDate } from "@/lib/utils";
import { getListingLocationFrom, getListingRoute } from "@/types/listing";
import type { Listing } from "@/types/listing";

export async function ListingDetailView({ listing }: { listing: Listing }) {
  const category = getCategoryBySlug(listing.category);
  const images = getListingImages(listing);
  const route = getListingRoute(listing);
  const location = getListingLocationFrom(listing);
  const author = await resolveListingAuthorAsync(listing);
  const allApproved =
    listing.category === "ev-devri"
      ? await getListings({ status: PUBLIC_LISTING_STATUS })
      : [];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
      <Link
        href="/ilanlar"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-navy-800 transition-smooth hover:text-accent"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        İlanlara dön
      </Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-6">
          {images.length > 0 && (
            <ListingGallery images={images} title={listing.title} />
          )}

          <div className="card-surface-lg overflow-hidden p-0">
            <div className={`h-1 w-full ${category?.accentBar ?? "bg-navy-800"}`} />
            <div className="p-6 sm:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <CategoryBadge slug={listing.category} size="md" />
                <ListingStatusBadge status={listing.status} />
                {listing.isUrgent && (
                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-white">
                    Acil
                  </span>
                )}
                <time className="text-sm text-muted" dateTime={listing.createdAt}>
                  {formatDate(listing.createdAt)}
                </time>
              </div>

              <h1 className="text-2xl font-bold leading-tight text-navy-900 sm:text-3xl lg:text-4xl">
                {listing.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-2">
                {route ? (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-900 ring-1 ring-sky-200">
                    {route}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-cream-100 px-3 py-1.5 text-sm font-medium text-navy-800">
                    {location}
                  </span>
                )}
              </div>

              <div className="mt-6 whitespace-pre-wrap text-base leading-relaxed text-navy-800/90">
                {listing.description}
              </div>
            </div>
          </div>

          <CategoryDetailPanel listing={listing} />

          {listing.category === "ev-devri" && (
            <EvLocationInsightSection listing={listing} />
          )}

          {listing.category === "ev-devri" && (
            <PostMoveServicesSection city={listing.cityFrom} allListings={allApproved} />
          )}

          {listing.category === "sehir-sorusu" && (
            <SehirSorusuGuideSection listing={listing} />
          )}

          <RouteSuggestionsSection listing={listing} />

          <div className="lg:hidden">
            <ListingContactCard listing={listing} author={author} />
          </div>
        </div>

        <div className="hidden min-w-0 lg:block">
          <ListingContactCard listing={listing} author={author} />
        </div>
      </div>
    </div>
  );
}
