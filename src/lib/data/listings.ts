/**
 * İlan veri katmanı — listings-repository üzerinden mock/Supabase geçişi.
 */
export {
  getListings,
  getListingById,
  getListingContactWhatsApp,
  createListing,
  updateListingStatus,
  updateListingImages,
  reportListing,
  getListingsByUserId,
  getRelatedListings,
  getListingStats,
  type GetListingsOptions,
  type ReportListingInput,
  type RelatedListingsInput,
} from "@/lib/data/listings-repository";
