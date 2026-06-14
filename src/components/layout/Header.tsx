"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthNav } from "@/components/auth/AuthNav";
import { ButtonLink } from "@/components/ui/Button";
import { SesliOkuButton } from "@/components/reader/SesliOkuButton";

const navLinks = [
  { href: "/ilanlar", label: "İlanlar" },
  { href: "/sehir-rehberi", label: "Şehir Rehberi" },
  { href: "/ilan-ver", label: "İlan Ver" },
  { href: "/admin", label: "Admin" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-navy-900/8 bg-card/90 shadow-soft backdrop-blur-md">
      <div className="mx-auto flex h-[4.25rem] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" onClick={closeMenu} className="group flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-sm font-bold text-white shadow-soft transition-smooth group-hover:bg-navy-800">
            T
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-base font-bold tracking-tight text-navy-900 sm:text-lg">
              tayinciyim<span className="text-accent">.net</span>
            </span>
            <span className="hidden text-[11px] font-medium text-muted sm:block">
              Kamu tayini platformu
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-smooth ${
                  active
                    ? "bg-navy-900/8 text-navy-900"
                    : "text-muted hover:bg-cream-100 hover:text-navy-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <SesliOkuButton />
          <AuthNav />
          <ButtonLink href="/ilan-ver" size="sm" className="hidden sm:inline-flex">
            İlan Ver
          </ButtonLink>

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-navy-900/10 text-navy-900 transition-smooth hover:bg-cream-100 md:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
          >
            {menuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 top-[4.25rem] z-40 bg-navy-950/40 backdrop-blur-sm md:hidden"
            onClick={closeMenu}
            aria-hidden
          />
          <nav className="fixed left-0 right-0 top-[4.25rem] z-50 border-b border-navy-900/8 bg-card p-4 shadow-card md:hidden">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className={`flex rounded-xl px-4 py-3 text-base font-medium transition-smooth ${
                        active
                          ? "bg-navy-900/8 text-navy-900"
                          : "text-muted hover:bg-cream-100"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li className="mt-2 border-t border-[var(--border)] pt-3">
                <ButtonLink href="/ilan-ver" onClick={closeMenu} className="w-full">
                  İlan Ver
                </ButtonLink>
              </li>
            </ul>
          </nav>
        </>
      )}
    </header>
  );
}
