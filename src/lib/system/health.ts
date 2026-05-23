import "server-only";

import { getEnvValidationSummary } from "@/lib/env/validation";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseAnonServerClient } from "@/lib/supabase/server";

export interface SystemHealthReport {
  status: "healthy" | "degraded" | "mock";
  summary: ReturnType<typeof getEnvValidationSummary>;
  supabaseReachable: boolean | null;
  supabaseMessage: string;
  deployChecklist: { label: string; done: boolean }[];
}

export async function getSystemHealthReport(): Promise<SystemHealthReport> {
  const summary = getEnvValidationSummary();

  let supabaseReachable: boolean | null = null;
  let supabaseMessage = "Supabase yapılandırılmadı (mock mod)";

  if (hasSupabaseEnv()) {
    const client = createSupabaseAnonServerClient();
    if (!client) {
      supabaseReachable = false;
      supabaseMessage = "İstemci oluşturulamadı";
    } else {
      const { error } = await client.from("listings").select("id").limit(1);
      supabaseReachable = !error;
      supabaseMessage = error
        ? "Veritabanına erişilemedi (RLS veya ağ)"
        : "Veritabanı erişilebilir";
    }
  }

  const status: SystemHealthReport["status"] = !hasSupabaseEnv()
    ? "mock"
    : supabaseReachable
      ? "healthy"
      : "degraded";

  const deployChecklist = [
    { label: "Supabase URL + anon key", done: summary.checks[0].status === "ok" && summary.checks[1].status === "ok" },
    { label: "Service role (sunucu)", done: summary.checks[2].status === "ok" },
    { label: "ADMIN_EMAILS", done: summary.adminEmailsCount > 0 },
    { label: "Site URL (SEO)", done: summary.siteUrlConfigured },
    { label: "Admin route koruması", done: summary.adminRouteProtected },
    { label: "Service role istemcide yok", done: summary.serviceRoleClientSafe },
    { label: "Supabase DB erişimi", done: supabaseReachable === true },
  ];

  return {
    status,
    summary,
    supabaseReachable,
    supabaseMessage,
    deployChecklist,
  };
}
