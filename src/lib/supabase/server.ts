import "server-only";

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import {
  getSupabaseAnonKey,
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
  hasSupabaseEnv,
  hasSupabaseServiceRole,
} from "@/lib/supabase/env";

/**
 * RLS uyumlu sunucu istemcisi (oturum çerezleri ile).
 */
export async function createSupabaseServerClient() {
  if (!hasSupabaseEnv()) return null;

  const url = getSupabaseUrl()!;
  const key = getSupabaseAnonKey()!;
  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Component'te set bazen yok sayılır — middleware ile tamamlanır
        }
      },
    },
  });
}

/**
 * Service role — yalnızca sunucu, admin/moderasyon işlemleri.
 * NEXT_PUBLIC olmayan anahtar; istemci bileşenlerinde kullanmayın.
 */
export function createSupabaseServiceClient() {
  if (!hasSupabaseServiceRole()) return null;

  const url = getSupabaseUrl()!;
  const key = getSupabaseServiceRoleKey()!;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Oturumsuz sunucu okuma (anon, RLS ile) */
export function createSupabaseAnonServerClient() {
  if (!hasSupabaseEnv()) return null;
  return createClient(getSupabaseUrl()!, getSupabaseAnonKey()!, {
    auth: { persistSession: false },
  });
}
