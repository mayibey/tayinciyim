import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl, hasSupabaseEnv } from "@/lib/supabase/env";

/**
 * Tarayıcı Supabase istemcisi (Auth, istemci tarafı Storage).
 * Env yoksa null döner — hata fırlatılmaz.
 */
export function createSupabaseBrowserClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}

/** @deprecated hasSupabaseEnv kullanın */
export function isSupabaseConfigured(): boolean {
  return hasSupabaseEnv();
}

export { hasSupabaseEnv } from "@/lib/supabase/env";
