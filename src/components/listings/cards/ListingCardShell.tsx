import Image from "next/image";
import Link from "next/link";
import { ListingAuthorTrustStrip } from "@/components/users/ListingAuthorTrustStrip";
import { resolveListingAuthor } from "@/lib/users/resolve-user";
import { CategoryBadge } from "@/components/listings/CategoryBadge";
import { getCategoryBySlug } from "@/lib/categories";
import { getListingCoverImage } from "@/lib/listing-images";
import { formatRelativeDate } from "@/lib/utils";
import type { Listing } from "@/types/listing";
import type { ReactNode } from "react";

interface ListingCardShellProps {
  listing: Listing;
  meta?: ReactNode;
  footer?: ReactNode;
  imageOverlay?: ReactNode;
}

export function ListingCardShell({
  listing,
  meta,
  footer,
  imageOverlay,
}: ListingCardShellProps) {
  const category = getCategoryBySlug(listing.category);
  const cover = getListingCoverImage(listing);
  const author = resolveListingAuthor(listing);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-card shadow-card transition-smooth hover:-translate-y-1 hover:shadow-card-hover sm:rounded-3xl">
      {cover && (
        <div className="relative aspect-[16/10] overflow-hidden bg-cream-200">
          <Image
            src={cover.url}
            alt={cover.alt ?? listing.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 via-transparent to-transparent" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <CategoryBadge slug={listing.category} />
            {listing.isUrgent && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white">
                Acil
              </span>
            )}
          </div>
          {imageOverlay}
        </div>
      )}

      {!cover && (
        <div className="flex items-center gap-2 border-b border-[var(--border)] bg-cream-50 px-4 py-3">
          <CategoryBadge slug={listing.category} />
        </div>
      )}

      <div className={`h-0.5 w-full ${category?.accentBar ?? "bg-navy-800"}`} />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-2 flex items-center justify-between gap-2">
          <time className="text-xs font-medium text-muted">
            {formatRelativeDate(listing.createdAt)}
          </time>
        </div>

        <h2 className="mb-2 line-clamp-2 text-base font-semibold leading-snug text-navy-900 transition-smooth group-hover:text-accent sm:text-lg">
          <Link href={`/ilanlar/${listing.id}`} className="after:absolute after:inset-0">
            {listing.title}
          </Link>
        </h2>

        {meta && <div className="mb-3 flex flex-wrap gap-2">{meta}</div>}

        <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
          {listing.description}
        </p>

        {footer ?? (
          <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
            <div className="relative z-10 min-w-0 flex-1">
              <ListingAuthorTrustStrip
                author={author}
                contactName={listing.contactName}
                compact
              />
            </div>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-100 text-navy-800 transition-smooth group-hover:bg-accent group-hover:text-white">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
