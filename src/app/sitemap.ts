import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants/site";
import { getListings } from "@/lib/data/listings";
import { PUBLIC_LISTING_STATUS } from "@/lib/constants/listing-status";
import { getAllCityGuides } from "@/lib/location/location-insights";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await getListings({ status: PUBLIC_LISTING_STATUS });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/ilanlar`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/ilan-ver`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/sehir-rehberi`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
  ];

  const cityGuideRoutes: MetadataRoute.Sitemap = getAllCityGuides().map((g) => ({
    url: `${SITE_URL}/sehir-rehberi/${g.slug}`,
    lastModified: new Date(g.lastUpdatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const listingRoutes: MetadataRoute.Sitemap = listings.map((l) => ({
    url: `${SITE_URL}/ilanlar/${l.id}`,
    lastModified: new Date(l.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...cityGuideRoutes, ...listingRoutes];
}
