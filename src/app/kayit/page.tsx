import { AuthForm } from "@/components/auth/AuthForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { signUpAction } from "@/app/auth/actions";
import { SITE_NAME } from "@/lib/constants/site";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Kayıt ol",
  description: `${SITE_NAME} ücretsiz hesap oluşturun.`,
  path: "/kayit",
  noIndex: true,
});

export default function KayitPage() {
  const enabled = hasSupabaseEnv();

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:py-14">
      <PageHeader
        badge="Hesap"
        title="Kayıt ol"
        description="Üyelik zorunlu değil; ilan vermek için kayıt olmanız önerilir."
      />
      <div className="mt-8">
        <AuthForm
          mode="signup"
          action={signUpAction}
          disabled={!enabled}
          disabledMessage="Demo modda kayıt devre dışı. Supabase env yapılandırması sonrası kayıt açılır."
        />
      </div>
    </div>
  );
}
