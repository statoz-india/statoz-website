import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Orbitron,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Script from "next/script";

const siteName = "Statoz";
const siteUrl = "https://statoz.in";
const defaultTitle = "Statoz | F2P Sports Prediction Market & Skill-Based Play";
const defaultDescription =
  "Statoz is a free-to-play sports prediction market where fans play skill-based prediction games, track live odds, climb leaderboards, and win rewards across cricket and football.";
const defaultImage = "/StatOz%20Cover%20Image.webp";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  applicationName: siteName,
  keywords: [
    "f2p prediction market",
    "free to play sports game",
    "sports prediction app",
    "skill-based sports gaming",
    "cricket prediction game",
    "football prediction game",
    "live odds sports game",
    "Statoz",
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/statoz%20logo.png",
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    siteName,
    type: "website",
    images: [
      {
        url: defaultImage,
        width: 1200,
        height: 630,
        alt: "Statoz free-to-play sports prediction market",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [defaultImage],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: siteUrl,
  description: defaultDescription,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/allblogs?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}/statoz%20logo.png`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${plusJakartaSans.variable} antialiased`}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T436Z2PL"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7KH0GEDEFX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7KH0GEDEFX');
          `}
        </Script>
        <Script
          id="structured-data-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Script
          id="structured-data-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
