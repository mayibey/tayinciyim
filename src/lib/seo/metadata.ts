import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants/site";

const defaultOgImage = `${SITE_URL}/og-default.svg`;

type BuildMetadataOptions = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

export function buildPageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "",
  image,
  noIndex = false,
}: BuildMetadataOptions): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImage = image ?? defaultOgImage;

  return {
    title,
    description,
    ...(noIndex && { robots: { index: false, follow: false } }),
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url,
      siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [ogImage],
    },
    alternates: { canonical: url },
  };
}

export function buildListingMetadata(listing: {
  title: string;
  description: string;
  id: string;
  cityFrom: string;
  images?: { url: string }[];
}): Metadata {
  const shortDesc =
    listing.description.length > 160
      ? `${listing.description.slice(0, 157)}...`
      : listing.description;

  return buildPageMetadata({
    title: listing.title,
    description: `${listing.cityFrom} — ${shortDesc}`,
    path: `/ilanlar/${listing.id}`,
    image: listing.images?.[0]?.url,
  });
}
