import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingCardRouter } from "@/components/listings/cards/ListingCardRouter";
import { CarrierProfilePanel } from "@/components/users/CarrierProfilePanel";
import { ServiceProviderProfilePanel } from "@/components/users/ServiceProviderProfilePanel";
import { ReviewList } from "@/components/users/ReviewList";
import { TransactionHistoryList } from "@/components/users/TransactionHistoryList";
import { UserProfileCard } from "@/components/users/UserProfileCard";
import { SecurityNotice } from "@/components/listings/SecurityNotice";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  getActiveListingsForUser,
  getReviewsForUserProfile,
  getTransactionsForUserProfile,
  getUserProfileById,
} from "@/lib/data/users";
import { getCarrierProfile } from "@/lib/users/resolve-user";
import { SECURITY_MESSAGES } from "@/lib/constants/site";
import { buildPageMetadata } from "@/lib/seo/metadata";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const user = await getUserProfileById(id);
  if (!user) return { title: "Profil bulunamadı" };
  return buildPageMetadata({
    title: `${user.displayName} — Profil`,
    description: user.bio ?? `${user.displayName} kullanıcı profili ve ilanları.`,
    path: `/profil/${id}`,
  });
}

export default async function ProfilPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getUserProfileById(id);

  if (!user) {
    notFound();
  }

  const [listings, reviews, transactions] = await Promise.all([
    getActiveListingsForUser(id),
    getReviewsForUserProfile(id),
    getTransactionsForUserProfile(id),
  ]);

  const carrier = user.userType === "nakliyeci" ? getCarrierProfile(id) : null;
  const serviceListings = listings.filter(
    (l): l is typeof l & { category: "hizmet-verenler" } => l.category === "hizmet-verenler",
  );
  const completedTx = transactions.filter((t) => t.status === "tamamlandi");

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

      <UserProfileCard user={user} />

      <div className="mt-4">
        <SecurityNotice message={SECURITY_MESSAGES.detail} variant="info" />
      </div>

      {carrier && (
        <div className="mt-8">
          <CarrierProfilePanel carrier={carrier} user={user} />
        </div>
      )}

      {(user.userType === "hizmet-veren" || serviceListings.length > 0) && (
        <div className="mt-8">
          <ServiceProviderProfilePanel user={user} serviceListings={serviceListings} />
        </div>
      )}

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-navy-900">Aktif ilanlar</h2>
        {listings.length === 0 ? (
          <EmptyState
            icon="inbox"
            title="Aktif ilan yok"
            description="Bu kullanıcının şu an yayında ilanı bulunmuyor."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCardRouter key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-navy-900">Tamamlanan işlemler</h2>
        <TransactionHistoryList transactions={completedTx} />
      </section>

      <section className="mt-10 card-surface-lg p-6 sm:p-8">
        <h2 className="mb-4 text-xl font-bold text-navy-900">Yorumlar</h2>
        <ReviewList reviews={reviews} />
      </section>
    </div>
  );
}
