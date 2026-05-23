import { ListingForm } from "@/components/listings/ListingForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "İlan Ver",
  description: "Ücretsiz ilan verin — ev devri, eşya devri, ortak nakliye veya şehir sorusu paylaşın.",
  path: "/ilan-ver",
});

export default function IlanVerPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <PageHeader
        badge="Yeni ilan"
        title="İlan Ver"
        description="Ev devri, eşya devri, ortak nakliye veya şehir sorusu paylaşın. İlanınız incelendikten sonra yayınlanır."
      />

      <div className="card-surface-lg p-6 sm:p-8">
        <ListingForm />
      </div>
    </div>
  );
}
