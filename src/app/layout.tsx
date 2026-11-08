import type { Metadata } from "next";
import Script from "next/script";
import { Orbitron, Onest, Space_Mono } from "next/font/google";
import AnalyticsEvents from "@/components/AnalyticsEvents";
import JsonLd from "@/components/JsonLd";
import { KEYWORDS } from "@/lib/seo";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_LANGUAGE,
  SHARED_OPEN_GRAPH,
  APP_ICON_PATH,
} from "@/lib/site";
import { SITE_GRAPH } from "@/lib/structuredData";
import "./globals.css";

const disp = Orbitron({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-disp",
  display: "swap",
});
const ui = Onest({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-ui",
  display: "swap",
});
const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

const GTM_ID = "GTM-T436Z2PL";
const GA_MEASUREMENT_ID = "G-7KH0GEDEFX";
const ADSENSE_CLIENT = "ca-pub-6501993109896836";

const TITLE = "StatOz – Free Sports Prediction Game";
const DESCRIPTION = SITE_DESCRIPTION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s · StatOz" },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    ...KEYWORDS.core,
    ...KEYWORDS.worldCup.slice(0, 4),
    ...KEYWORDS.leagues.slice(0, 3),
    "not gambling",
    "no real money",
    ...KEYWORDS.brand,
  ],
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/blog/rss.xml" },
  },
  category: "games",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: { icon: APP_ICON_PATH, apple: APP_ICON_PATH },
  openGraph: {
    ...SHARED_OPEN_GRAPH,
    type: "website",
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: SHARED_OPEN_GRAPH.images,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang={SITE_LANGUAGE}
      className={`${disp.variable} ${ui.variable} ${mono.variable}`}
    >
      <head>
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <JsonLd data={SITE_GRAPH} />
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <AnalyticsEvents />
        {children}
      </body>
    </html>
  );
}
