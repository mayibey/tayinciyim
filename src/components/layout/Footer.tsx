import Link from "next/link";
import { hasSupabaseEnv } from "@/lib/supabase/env";

const footerLinks = {
  Platform: [
    { href: "/ilanlar", label: "İlanlar" },
    { href: "/sehir-rehberi", label: "Şehir Rehberi" },
    { href: "/sehir-rehberi#guvenli-tasinma", label: "Güvenli Taşınma Rehberi" },
    { href: "/ilan-ver", label: "İlan Ver" },
    { href: "/admin", label: "Admin Panel" },
    { href: "/sistem-durumu", label: "Sistem Durumu" },
  ],
  Kategoriler: [
    { href: "/ilanlar?kategori=ev-devri", label: "Ev Devri" },
    { href: "/ilanlar?kategori=esya-devri", label: "Eşya Devri / Satış" },
    { href: "/ilanlar?kategori=nakliye-ariyorum", label: "Nakliye Arıyorum" },
    { href: "/ilanlar?kategori=nakliyeci-arac-ilani", label: "Nakliyeci Araç" },
    { href: "/ilanlar?kategori=sehir-sorusu", label: "Şehir Sorusu" },
    { href: "/ilanlar?kategori=hizmet-verenler", label: "Hizmet Verenler" },
  ],
};

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-navy-900 text-cream-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-sm font-bold text-white">
                T
              </span>
              <span className="text-lg font-bold text-white">
                tayinciyim<span className="text-accent">.net</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-200/80">
              Kamu memurları ve tayin sürecindeki aileler için güvenilir ilan
              platformu. Ev devri, eşya, nakliye ve şehir rehberi tek adreste.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-cream-200/70">
              Beta sürüm — güvenliğiniz için kapora göndermeden önce doğrulama yapın.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-cream-100">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Güvenli topluluk ilanları
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-cream-200/60">
                {title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream-100/80 transition-smooth hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-cream-200/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} tayinciyim.net — Tüm hakları saklıdır.</p>
          <p>{hasSupabaseEnv() ? "MVP · Beta" : "MVP · Mock veri modu"}</p>
        </div>
      </div>
    </footer>
  );
}
