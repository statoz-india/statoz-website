import { aboutToMarkdown, ABOUT_LEAD } from "@/lib/about";
import { BLOG_POSTS, postToMarkdown } from "@/lib/blog";
import { AI_QUESTIONS, FAQ_ITEMS } from "@/lib/faqData";
import { ROUTES } from "@/lib/routes";
import { KEYWORDS, KEYWORD_GROUP_LABELS } from "@/lib/seo";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  BRAND_NAMES,
  SUPPORT_EMAIL,
} from "@/lib/site";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/storeLinks";
import { APP_ICON_URL, LOGO_URL, SOCIAL_PROFILES } from "@/lib/structuredData";

/* llms.txt and llms-full.txt (https://llmstxt.org): plain-markdown briefs for
   AI assistants, built from the same data the pages render so they can never
   drift from the site. */

const link = (path: string) => `${SITE_URL}${path}`;

const SOCIAL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  reddit: "Reddit",
  linkedin: "LinkedIn",
};

const socialLinks = SOCIAL_PROFILES.map((url) => {
  const key = Object.keys(SOCIAL_LABELS).find((k) => url.includes(k));
  return `[${key ? SOCIAL_LABELS[key] : url}](${url})`;
}).join(" · ");

const INTRO = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

${SITE_NAME} is a free-to-play sports prediction game for Android and iOS, made by StatOz, a gaming-first sports entertainment company based in India. Players answer a short pre-match quiz on real fixtures, back their best calls with Oz Coins, and earn XP for correct answers to climb a global leaderboard.`;

const BRAND = `## Brand

![${SITE_NAME} logo](${LOGO_URL})

- Names: ${BRAND_NAMES.join(", ")}. Website: ${SITE_URL.replace("https://", "")}
- Logo (PNG, 1200×1200): ${LOGO_URL}
- App icon (PNG, 1200×1200): ${APP_ICON_URL}
- Official profiles: ${socialLinks}
- Contact: ${SUPPORT_EMAIL}`;

const KEY_FACTS = `## Key facts

- Price: free. No deposits, entry fees or cash payouts.
- Not gambling: Oz Coins and XP are virtual, earned in-app, and have no cash value.
- Sports: FIFA World Cup 2026 (48 nations, 104 fixtures), EPL, IPL, NBA, La Liga and more.
- How a match works: four pre-match questions, answers lock at kickoff, automatic settlement at full-time, XP for every correct answer.
- Platforms: Android (Google Play) and iOS (App Store). Age 18+.`;

const DOWNLOAD = `## Download

- [Google Play (Android)](${PLAY_STORE_URL})
- [App Store (iPhone, iPad)](${APP_STORE_URL})
- [download.statoz.in](https://download.statoz.in): opens the right store for the visitor's device`;

const PAGES = `## Pages

- [Home](${link("/")}): what StatOz is and how the game works
- [FAQ](${link(ROUTES.faq)}): common questions about pricing, coins, XP and gambling
- [About](${link(ROUTES.about)}): the company and its no-gambling stance
- [Download](${link(ROUTES.download)}): get the app on Android or iOS
- [Blog](${link(ROUTES.blog)}): product guides and community reports ([RSS](${link("/blog/rss.xml")}))
${BLOG_POSTS.map((post) => `- [${post.title}](${link(post.href)}): ${post.summary}`).join("\n")}`;

const LEGAL = `## Optional

- [Terms & Conditions](${link(ROUTES.terms)})
- [Privacy Policy](${link(ROUTES.privacy)})`;

export function buildLlmsTxt() {
  return `${INTRO}

${BRAND}

${KEY_FACTS}

${DOWNLOAD}

${PAGES}

## Full content

- [llms-full.txt](${link("/llms-full.txt")}): every page in plain text, plus topics and answers to common questions

${LEGAL}
`;
}

export function buildLlmsFullTxt() {
  const faq = FAQ_ITEMS.map((item) => `### ${item.q}\n\n${item.a}`).join("\n\n");
  const questions = AI_QUESTIONS.map((item) => `### ${item.q}\n\n${item.a}`).join("\n\n");
  const topics = (Object.keys(KEYWORDS) as (keyof typeof KEYWORDS)[])
    .map((group) => `- ${KEYWORD_GROUP_LABELS[group]}: ${KEYWORDS[group].join(" · ")}`)
    .join("\n");
  const posts = BLOG_POSTS.map(
    (post) =>
      `### ${post.title}\n\nURL: ${link(post.href)} · Published ${post.published} · Updated ${post.updated}\n\n${postToMarkdown(post)}`,
  ).join("\n\n");

  return `${INTRO}

${BRAND}

${KEY_FACTS}

${DOWNLOAD}

## Questions people ask, answered

${questions}

## FAQ

Source: ${link(ROUTES.faq)}

${faq}

## About StatOz

Source: ${link(ROUTES.about)}

${ABOUT_LEAD}

${aboutToMarkdown()}

## Blog

Source: ${link(ROUTES.blog)}

${posts}

## Topics

The words fans use when they look for StatOz:

${topics}

${LEGAL}
`;
}

export function markdownResponse(body: string) {
  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
