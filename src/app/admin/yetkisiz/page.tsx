import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Yetkisiz erişim",
  path: "/admin/yetkisiz",
  noIndex: true,
});

interface PageProps {
  searchParams: Promise<{ reason?: string }>;
}

export default async function AdminYetkisizPage({ searchParams }: PageProps) {
  const { reason } = await searchParams;
  const isMock = reason === "mock";

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:py-24">
      <EmptyState
        icon="inbox"
        title="Yetkisiz erişim"
        description={
          isMock
            ? "Geliştirme modunda admin paneli için Supabase ve ADMIN_EMAILS yapılandırması gerekir. Production'da bu sayfa yalnızca yetkisiz kullanıcılar görür."
            : "Bu alana erişim yetkiniz bulunmuyor. Yalnızca tanımlı admin hesapları panele girebilir."
        }
        actionLabel="Ana sayfaya dön"
        actionHref="/"
      />
      <div className="mt-6 flex justify-center gap-4 text-sm font-semibold">
        <Link href="/giris?next=/admin" className="text-accent hover:underline">
          Giriş yap
        </Link>
        <Link href="/ilanlar" className="text-navy-800 hover:underline">
          İlanlar
        </Link>
      </div>
    </div>
  );
}
