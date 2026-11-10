import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { EcwidProvider } from "@/components/ecwid-provider";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ecwid, site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Julie Fleur", template: "%s | Julie Fleur" },
  description: site.description,
  robots: { index: site.launched, follow: site.launched },
  icons: {
    icon: [
      { url: "/favicon.ico?v=20261102jf", type: "image/x-icon", sizes: "16x16 32x32 48x48" },
      { url: "/favicon-32x32.png?v=20261102jf", type: "image/png", sizes: "32x32" },
      { url: "/favicon.png?v=20261102jf", type: "image/png", sizes: "192x192" },
    ],
    apple: { url: "/apple-touch-icon.png?v=20261102jf", type: "image/png", sizes: "180x180" },
  },
  openGraph: { type: "website", locale: "nl_NL", siteName: site.name, title: "Julie Fleur", description: site.description },
};
export const viewport: Viewport = { themeColor: "#F7D0D6", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData={"@context":"https://schema.org","@type":"WebSite",name:site.name,url:site.url,inLanguage:"nl-NL"};
  return <html lang="nl"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData).replace(/</g,"\\u003c")}} />{ecwid.enabled && <Script id="ecwid-defer" strategy="beforeInteractive">{'window.ecwid_script_defer=true;window.ecwidMessages={"BreadCrumbs.your_bag":"Winkelmandje","Minicart.shopping_bag":"Winkelmandje","ShoppingCartView.shopping_bag":"Winkelmandje","EmptyShoppingCartPanel.empty":"Je winkelmandje is nog leeg."};'}</Script>}<EcwidProvider><a className="skip-link" href="#inhoud">Direct naar de inhoud</a><Header /><main id="inhoud" tabIndex={-1}>{children}</main><Footer /></EcwidProvider></body></html>;
}
