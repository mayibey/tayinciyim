import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/admin/admin-emails";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export { getAdminEmails, isAdminEmail } from "@/lib/admin/admin-emails";

export interface AdminSession {
  email: string;
  userId: string;
}

export function isProductionEnv(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * Oturum açmış admin — yoksa null.
 */
export async function getCurrentAdmin(): Promise<AdminSession | null> {
  if (!hasSupabaseEnv()) return null;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !isAdminEmail(user.email)) return null;

  return { email: user.email, userId: user.id };
}

/**
 * Admin panel erişimi — production'da zorunlu auth + ADMIN_EMAILS.
 * Mock modda (development, Supabase yok) erişim reddedilir.
 */
export async function requireAdmin(): Promise<AdminSession> {
  if (isProductionEnv()) {
    if (!hasSupabaseEnv()) {
      redirect("/giris?next=/admin");
    }
  } else if (!hasSupabaseEnv()) {
    redirect("/admin/yetkisiz?reason=mock");
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect("/giris?next=/admin");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/giris?next=/admin");
  }

  if (!isAdminEmail(user.email)) {
    redirect("/admin/yetkisiz");
  }

  return { email: user.email, userId: user.id };
}

/** Server action'larda admin doğrulama */
export async function assertAdminAction(): Promise<AdminSession> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    if (isProductionEnv()) {
      throw new Error("Yetkisiz işlem");
    }
    throw new Error("Admin oturumu gerekli");
  }
  return admin;
}
