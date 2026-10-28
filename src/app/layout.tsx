import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { HEAD_SCRIPT } from "@/lib/headScript";
import { asset, getBasePath, SITE_URL } from "@/lib/basePath";
import { shop } from "@/data/business";
import { IconProvider } from "@/components/ui/IconProvider";
import { Navbar } from "@/components/chrome/Navbar";
import { SettingsDrawer } from "@/components/chrome/SettingsDrawer";
import { Ticker } from "@/components/chrome/Ticker";
import { Toaster } from "@/components/chrome/Toaster";
import { DepthMeter } from "@/components/chrome/DepthMeter";
import { Footer } from "@/components/chrome/Footer";
import { GlobalKeys } from "@/components/chrome/GlobalKeys";
import { HtmlLang } from "@/i18n/client";
import { FilmTrail } from "@/components/effects/FilmTrail";
import { Toolbox } from "@/components/effects/Toolbox";
import { ToolCursor } from "@/components/effects/ToolCursor";
import { EasterEggs } from "@/components/effects/EasterEggs";

const anton = localFont({ src: "../fonts/anton-400.woff2", weight: "400", variable: "--font-anton", display: "swap" });
const archivo = localFont({ src: "../fonts/archivo-variable.woff2", weight: "100 900", variable: "--font-archivo", display: "swap" });
const jbmono = localFont({ src: "../fonts/jetbrains-mono-variable.woff2", weight: "100 800", variable: "--font-jbmono", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}${getBasePath()}`),
  title: { default: `${shop.name} | ${shop.motto}`, template: `%s | ${shop.name}` },
  description: `${shop.tagline} Full custom advertisement wraps, color changes, fleet graphics, marine graphics and brand identity in Warminster, PA. A drasticstatic labs showcase.`,
  icons: { icon: asset("/icon.svg") },
  openGraph: { type: "website", siteName: shop.name, title: `${shop.name} | THE CARPORT`, description: shop.tagline, images: [asset("/og/home.png")] },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#0a0a0e" }, { media: "(prefers-color-scheme: light)", color: "#f1efea" }], width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${anton.variable} ${archivo.variable} ${jbmono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: HEAD_SCRIPT }} />
      </head>
      <body>
        <IconProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[10001] focus:bg-panel focus:px-3 focus:py-2">Skip to content</a>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <DepthMeter />
          <Ticker />
          <SettingsDrawer />
          <Toaster />
          <GlobalKeys />
          <HtmlLang />
          <FilmTrail />
          <Toolbox />
          <ToolCursor />
          <EasterEggs />
        </IconProvider>
      </body>
    </html>
  );
}
