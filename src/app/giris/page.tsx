import { AuthForm } from "@/components/auth/AuthForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { signInAction } from "@/app/auth/actions";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Giriş",
  description: "tayinciyim.com hesabınıza giriş yapın.",
  path: "/giris",
  noIndex: true,
});

interface PageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function GirisPage({ searchParams }: PageProps) {
  const { next } = await searchParams;
  const enabled = hasSupabaseEnv();

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:py-14">
      <PageHeader
        badge="Hesap"
        title="Giriş yap"
        description="İlanlarınızı yönetmek ve güvenilir profil oluşturmak için giriş yapın."
      />
      <div className="mt-8">
        <AuthForm
          mode="signin"
          action={signInAction}
          redirectNext={next}
          disabled={!enabled}
          disabledMessage="Demo modda giriş devre dışı. Supabase ortam değişkenlerini (.env.local) yapılandırdıktan sonra giriş açılır."
        />
      </div>
    </div>
  );
}
