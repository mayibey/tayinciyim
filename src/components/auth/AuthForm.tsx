"use client";

import Link from "next/link";
import { useActionState } from "react";
import { HoneypotFields } from "@/components/security/HoneypotFields";
import { Button } from "@/components/ui/Button";
import { inputClassName, labelClassName } from "@/components/ui/form-styles";
import type { AuthFormState } from "@/app/auth/actions";

const initial: AuthFormState = { ok: false, message: "" };

interface AuthFormProps {
  mode: "signin" | "signup";
  disabled?: boolean;
  disabledMessage?: string;
  redirectNext?: string;
  action: (prev: AuthFormState, formData: FormData) => Promise<AuthFormState>;
}

export function AuthForm({
  mode,
  disabled,
  disabledMessage,
  redirectNext,
  action,
}: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, initial);

  if (disabled) {
    return (
      <div className="card-surface-lg p-8 text-center">
        <p className="text-sm leading-relaxed text-muted">{disabledMessage}</p>
        <Link href="/" className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
          Ana sayfaya dön
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="card-surface-lg relative space-y-5 p-6 sm:p-8">
      <HoneypotFields />
      {redirectNext && <input type="hidden" name="next" value={redirectNext} />}
      {mode === "signup" && (
        <div>
          <label className={labelClassName} htmlFor="fullName">
            Ad Soyad
          </label>
          <input id="fullName" name="fullName" className={inputClassName} autoComplete="name" />
        </div>
      )}
      <div>
        <label className={labelClassName} htmlFor="email">
          E-posta
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={inputClassName}
          autoComplete="email"
        />
      </div>
      <div>
        <label className={labelClassName} htmlFor="password">
          Şifre
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          className={inputClassName}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
      </div>

      {state.message && !state.ok && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {state.message}
        </p>
      )}

      {state.message && state.ok && (
        <p
          className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          role="status"
        >
          {state.message}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "İşleniyor…" : mode === "signup" ? "Kayıt ol" : "Giriş yap"}
      </Button>

      <p className="text-center text-sm text-muted">
        {mode === "signup" ? (
          <>
            Hesabınız var mı?{" "}
            <Link href="/giris" className="font-semibold text-accent hover:underline">
              Giriş yapın
            </Link>
          </>
        ) : (
          <>
            Hesabınız yok mu?{" "}
            <Link href="/kayit" className="font-semibold text-accent hover:underline">
              Kayıt olun
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
