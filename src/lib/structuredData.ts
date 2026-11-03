import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/storeLinks";
import type { BlogPost } from "@/lib/blog";

/* schema.org JSON-LD shared by every page. Entities reference each other by
   @id so search engines and LLMs resolve one StatOz, not several. */

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const APP_ID = `${SITE_URL}/#app`;
const LOGO_URL = `${SITE_URL}/assets/brand/app-icon.png`;

export const SOCIAL_PROFILES = [
  "https://www.instagram.com/statozindia/",
  "https://www.youtube.com/@StatozIndia",
  "https://www.reddit.com/r/f2p__predictionmarket/",
  "https://www.linkedin.com/company/statoz/",
];

const absolute = (href: string) => {
  const url = new URL(href, SITE_URL);
  url.hash = "";
  return url.toString();
};

export const SITE_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: SITE_NAME,
      alternateName: "Statoz",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: LOGO_URL, width: 1200, height: 1200 },
      email: "support@statoz.in",
      description:
        "StatOz is a gaming-first sports entertainment company building free-to-play sports prediction games. It is not a gambling platform.",
      sameAs: [...SOCIAL_PROFILES, PLAY_STORE_URL, APP_STORE_URL],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": ORG_ID },
    },
    {
      "@type": "MobileApplication",
      "@id": APP_ID,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      image: LOGO_URL,
      applicationCategory: "GameApplication",
      applicationSubCategory: "Sports prediction game",
      operatingSystem: "Android, iOS",
      installUrl: [PLAY_STORE_URL, APP_STORE_URL],
      publisher: { "@id": ORG_ID },
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      // Must match the real store ratings, or Google can issue a manual action.
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "5000",
      },
    },
  ],
};

export function faqJsonLd(items: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbJsonLd(items: { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href && { item: absolute(item.href) }),
    })),
  };
}

export function articleJsonLd(post: BlogPost, description: string) {
  const url = absolute(post.href);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description,
    url,
    mainEntityOfPage: url,
    image: absolute("/opengraph-image"),
    inLanguage: "en",
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    about: { "@id": APP_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}
