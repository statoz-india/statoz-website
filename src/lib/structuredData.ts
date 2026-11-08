import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_LANGUAGE,
  BRAND_NAMES,
  SUPPORT_EMAIL,
  LOGO_PATH,
  APP_ICON_PATH,
  BRAND_IMAGE_SIZE,
} from "@/lib/site";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/storeLinks";
import { ROUTES } from "@/lib/routes";
import type { BlogPost } from "@/lib/blog";

/* schema.org JSON-LD shared by every page. Entities reference each other by
   @id so search engines and LLMs resolve one StatOz, not several. */

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const APP_ID = `${SITE_URL}/#app`;
const BLOG_ID = `${SITE_URL}${ROUTES.blog}#blog`;

export const LOGO_URL = `${SITE_URL}${LOGO_PATH}`;
export const APP_ICON_URL = `${SITE_URL}${APP_ICON_PATH}`;
const SHARE_IMAGE_URL = `${SITE_URL}/opengraph-image`;

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

const pngImage = (url: string) => ({
  "@type": "ImageObject",
  url,
  contentUrl: url,
  width: BRAND_IMAGE_SIZE,
  height: BRAND_IMAGE_SIZE,
  encodingFormat: "image/png",
});

export const SITE_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: SITE_NAME,
      alternateName: BRAND_NAMES.filter((name) => name !== SITE_NAME),
      url: SITE_URL,
      logo: { ...pngImage(LOGO_URL), caption: `${SITE_NAME} logo` },
      image: pngImage(APP_ICON_URL),
      email: SUPPORT_EMAIL,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: SUPPORT_EMAIL,
        availableLanguage: ["English"],
      },
      description:
        "StatOz is a gaming-first sports entertainment company building free-to-play sports prediction games. It is not a gambling platform.",
      knowsAbout: [
        "Sports prediction games",
        "FIFA World Cup 2026",
        "Premier League",
        "Indian Premier League",
        "Football",
        "Cricket",
      ],
      sameAs: [...SOCIAL_PROFILES, PLAY_STORE_URL, APP_STORE_URL],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: SITE_NAME,
      alternateName: BRAND_NAMES.filter((name) => name !== SITE_NAME),
      description: SITE_DESCRIPTION,
      inLanguage: SITE_LANGUAGE,
      publisher: { "@id": ORG_ID },
    },
    {
      "@type": "MobileApplication",
      "@id": APP_ID,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      image: APP_ICON_URL,
      applicationCategory: "GameApplication",
      applicationSubCategory: "Sports prediction game",
      operatingSystem: "Android, iOS",
      installUrl: [PLAY_STORE_URL, APP_STORE_URL],
      inLanguage: SITE_LANGUAGE,
      contentRating: "18+",
      isAccessibleForFree: true,
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

function postingFields(post: BlogPost) {
  const url = absolute(post.href);
  return {
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    headline: post.title,
    description: post.description,
    url,
    datePublished: post.published,
    dateModified: post.updated,
    image: { "@type": "ImageObject", url: SHARE_IMAGE_URL, width: 1200, height: 630 },
    keywords: post.keywords.join(", "),
    inLanguage: SITE_LANGUAGE,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}

export function articleJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    ...postingFields(post),
    mainEntityOfPage: absolute(post.href),
    about: { "@id": APP_ID },
    isPartOf: { "@id": BLOG_ID },
  };
}

export function blogJsonLd(posts: BlogPost[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": BLOG_ID,
    name: `${SITE_NAME} Blog`,
    url: absolute(ROUTES.blog),
    inLanguage: SITE_LANGUAGE,
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
    blogPost: posts.map(postingFields),
  };
}
