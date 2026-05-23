import { getAdminEmails } from "@/lib/admin/admin-emails";
import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  hasSupabaseEnv,
  hasSupabaseServiceRole,
} from "@/lib/supabase/env";
import { SITE_URL } from "@/lib/constants/site";

export type EnvCheckStatus = "ok" | "missing" | "warn";

export interface EnvCheckItem {
  id: string;
  label: string;
  status: EnvCheckStatus;
  hint: string;
}

export interface EnvValidationSummary {
  mode: "mock" | "supabase";
  nodeEnv: string;
  isProduction: boolean;
  siteUrl: string;
  siteUrlConfigured: boolean;
  adminEmailsCount: number;
  adminRouteProtected: boolean;
  serviceRoleClientSafe: boolean;
  checks: EnvCheckItem[];
  readyForBeta: boolean;
}

function siteUrlFromEnv(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || "";
}

/** Hassas değerleri asla döndürmez — yalnızca var/yok özeti */
export function getEnvValidationSummary(): EnvValidationSummary {
  const url = getSupabaseUrl();
  const anon = getSupabaseAnonKey();
  const hasUrl = Boolean(url);
  const hasAnon = Boolean(anon);
  const hasFullSupabase = hasSupabaseEnv();
  const hasService = hasSupabaseServiceRole();
  const siteUrlEnv = siteUrlFromEnv();
  const siteUrlConfigured = Boolean(siteUrlEnv && siteUrlEnv.startsWith("http"));
  const admins = getAdminEmails();
  const isProduction = process.env.NODE_ENV === "production";
  const nodeEnv = process.env.NODE_ENV ?? "development";

  const checks: EnvCheckItem[] = [
    {
      id: "supabase_url",
      label: "Supabase URL",
      status: hasUrl ? "ok" : "missing",
      hint: hasUrl ? "Tanımlı" : "NEXT_PUBLIC_SUPABASE_URL eksik",
    },
    {
      id: "supabase_anon",
      label: "Supabase anon key",
      status: hasAnon ? "ok" : "missing",
      hint: hasAnon ? "Tanımlı" : "NEXT_PUBLIC_SUPABASE_ANON_KEY eksik",
    },
    {
      id: "service_role",
      label: "Service role (sunucu)",
      status: hasService ? "ok" : hasFullSupabase ? "missing" : "warn",
      hint: hasService
        ? "Tanımlı — istemciye sızmaz"
        : hasFullSupabase
          ? "SUPABASE_SERVICE_ROLE_KEY eksik"
          : "Supabase modunda gerekli",
    },
    {
      id: "admin_emails",
      label: "ADMIN_EMAILS",
      status: admins.length > 0 ? "ok" : "missing",
      hint: admins.length > 0 ? `${admins.length} admin tanımlı` : "Admin listesi boş",
    },
    {
      id: "site_url",
      label: "NEXT_PUBLIC_SITE_URL",
      status: siteUrlConfigured ? "ok" : "warn",
      hint: siteUrlConfigured ? siteUrlEnv : "Varsayılan veya eksik — SEO için ayarlayın",
    },
    {
      id: "mock_mode",
      label: "Veri modu",
      status: hasFullSupabase ? "ok" : "warn",
      hint: hasFullSupabase ? "Supabase repository" : "Mock / demo veri",
    },
    {
      id: "environment",
      label: "NODE_ENV",
      status: "ok",
      hint: nodeEnv,
    },
  ];

  const adminRouteProtected =
    isProduction ? hasFullSupabase && admins.length > 0 : hasFullSupabase ? admins.length > 0 : true;

  const readyForBeta =
    hasFullSupabase &&
    hasService &&
    admins.length > 0 &&
    siteUrlConfigured &&
    (!isProduction || hasFullSupabase);

  return {
    mode: hasFullSupabase ? "supabase" : "mock",
    nodeEnv,
    isProduction,
    siteUrl: siteUrlConfigured ? siteUrlEnv : SITE_URL,
    siteUrlConfigured,
    adminEmailsCount: admins.length,
    adminRouteProtected,
    serviceRoleClientSafe: !process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
    checks,
    readyForBeta,
  };
}
