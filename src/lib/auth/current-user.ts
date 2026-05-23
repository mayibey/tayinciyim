import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserById } from "@/lib/users/resolve-user";
import type { UserProfile } from "@/types/user-profile";

// TODO: Supabase Auth — tam oturum senkronizasyonu
// TODO: middleware protection /admin
// TODO: audit log

export interface CurrentUser {
  id: string;
  email?: string;
}

/**
 * Oturum açmış kullanıcı — yoksa null (misafir ilan verebilir).
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!hasSupabaseEnv()) return null;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;
  return { id: user.id, email: user.email };
}

export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id ?? null;
}

export async function getCurrentProfile(): Promise<UserProfile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  // TODO: profiles tablosundan Supabase select
  return getUserById(user.id);
}

/** @deprecated requireAdmin / getCurrentAdmin kullanın */
export async function requireAdminMockOrRole(): Promise<boolean> {
  const { getCurrentAdmin } = await import("@/lib/admin/admin-auth");
  const admin = await getCurrentAdmin();
  return admin != null;
}
