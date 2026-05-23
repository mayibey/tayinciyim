import { notFound } from "next/navigation";
import { ListingDetailView } from "@/components/listings/detail/ListingDetailView";
import { getListingImages } from "@/lib/listing-images";
import { buildListingMetadata } from "@/lib/seo/metadata";
import { getListingById } from "@/lib/data/listings";
import { PUBLIC_LISTING_STATUS } from "@/lib/constants/listing-status";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) {
    return { title: "İlan bulunamadı" };
  }
  return buildListingMetadata({
    ...listing,
    images: getListingImages(listing),
  });
}

export default async function IlanDetayPage({ params }: PageProps) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing || listing.status !== PUBLIC_LISTING_STATUS) {
    notFound();
  }

  return <ListingDetailView listing={listing} />;
}
