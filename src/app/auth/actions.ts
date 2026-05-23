"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { assertSecureFormSubmission } from "@/lib/security/form-guard";
import { RATE_LIMITS } from "@/lib/security/rate-limit";
import { sanitizePlainText } from "@/lib/security/sanitize";

export type AuthFormState = {
  ok: boolean;
  message: string;
};

export async function signInAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Demo modda giriş devre dışı. Supabase env ekleyin." };
  }

  const security = await assertSecureFormSubmission(formData, {
    rateLimit: { key: "auth", ...RATE_LIMITS.auth },
    minSubmitMs: 1000,
  });
  if (!security.ok) return { ok: false, message: security.message };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, message: "E-posta ve şifre zorunludur." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, message: "Supabase bağlantısı kurulamadı." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/", "layout");
  const next = String(formData.get("next") ?? "").trim();
  redirect(next && next.startsWith("/") ? next : "/");
}

export async function signUpAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Demo modda kayıt devre dışı. Supabase env ekleyin." };
  }

  const security = await assertSecureFormSubmission(formData, {
    rateLimit: { key: "auth", ...RATE_LIMITS.auth },
    minSubmitMs: 1000,
  });
  if (!security.ok) return { ok: false, message: security.message };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const fullName = sanitizePlainText(String(formData.get("fullName") ?? ""), 80);

  if (!email || !password) {
    return { ok: false, message: "E-posta ve şifre zorunludur." };
  }
  if (password.length < 6) {
    return { ok: false, message: "Şifre en az 6 karakter olmalıdır." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, message: "Supabase bağlantısı kurulamadı." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  if (data.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      full_name: fullName || email.split("@")[0],
      display_name: fullName || email.split("@")[0],
      email,
      user_type: "bireysel",
      officer_group: "none",
    });
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOutAction(): Promise<void> {
  if (!hasSupabaseEnv()) return;
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
