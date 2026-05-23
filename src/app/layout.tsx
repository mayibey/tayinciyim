import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BetaBanner } from "@/components/layout/BetaBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SITE_URL } from "@/lib/constants/site";
import { AppProviders } from "@/components/providers/AppProviders";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants/site";
import { buildPageMetadata } from "@/lib/seo/metadata";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rootMeta = buildPageMetadata({
  title: "Tayin ve yer değiştirme ilanları",
  description: SITE_DESCRIPTION,
  path: "/",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Tayin ve yer değiştirme ilanları`,
    template: `%s | ${SITE_NAME}`,
  },
  description: rootMeta.description,
  openGraph: rootMeta.openGraph,
  twitter: rootMeta.twitter,
  alternates: rootMeta.alternates,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth`}>
      <body className="flex min-h-full flex-col overflow-x-hidden bg-cream-50 font-sans text-navy-900 antialiased">
        <AppProviders>
          <BetaBanner />
          <Header />
          <main className="min-w-0 flex-1">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
