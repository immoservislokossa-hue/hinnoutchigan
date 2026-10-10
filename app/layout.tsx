import type { Metadata, Viewport } from "next";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@fontsource/poppins/latin-600.css";
import "@fontsource/poppins/latin-700.css";
import "@fontsource/poppins/latin-400-italic.css";
import "@fontsource-variable/space-grotesk/wght.css";
import "./globals.css";
import { site } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} (${site.short}) · ${site.motto}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "Sénat des Jeunes du Bénin",
    "SJB",
    "jeunesse béninoise",
    "engagement citoyen",
    "leadership",
    "association",
    "Bénin",
  ],
  openGraph: {
    type: "website",
    locale: "fr_BJ",
    siteName: site.name,
    title: `${site.name} (${site.short})`,
    description: site.description,
    images: [{ url: "/logo.jpg", width: 680, height: 708, alt: `Logo du ${site.name}` }],
  },
  twitter: { card: "summary", title: `${site.name} (${site.short})`, description: site.description, images: ["/logo.jpg"] },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0d3a1d",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: site.name,
  alternateName: site.short,
  slogan: site.motto,
  url: site.url,
  logo: `${site.url}/logo.jpg`,
  description: site.description,
  address: { "@type": "PostalAddress", addressLocality: "Parakou", addressCountry: "BJ" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.setAttribute('data-js','')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
