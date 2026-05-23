"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOutAction } from "@/app/auth/actions";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export function AuthNav() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const client = createSupabaseBrowserClient();
    if (!client) return;
    client.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  if (!hasSupabaseEnv()) {
    return (
      <Link
        href="/giris"
        className="hidden rounded-xl px-3 py-2 text-sm font-medium text-muted transition-smooth hover:bg-cream-100 hover:text-navy-900 sm:inline-flex"
      >
        Giriş
      </Link>
    );
  }

  if (email) {
    return (
      <div className="hidden items-center gap-2 sm:flex">
        <span className="max-w-[120px] truncate text-xs text-muted" title={email}>
          {email}
        </span>
        <form action={signOutAction}>
          <button
            type="submit"
            className="rounded-xl px-3 py-2 text-sm font-medium text-muted transition-smooth hover:bg-cream-100 hover:text-navy-900"
          >
            Çıkış
          </button>
        </form>
      </div>
    );
  }

  return (
    <Link
      href="/giris"
      className="hidden rounded-xl px-3 py-2 text-sm font-medium text-muted transition-smooth hover:bg-cream-100 hover:text-navy-900 sm:inline-flex"
    >
      Giriş
    </Link>
  );
}
