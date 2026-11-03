import { BLOG_POSTS } from "@/lib/blog";
import { FAQ_ITEMS } from "@/lib/faqData";
import { ROUTES } from "@/lib/routes";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/storeLinks";

/* llms.txt (https://llmstxt.org): a plain-markdown brief for LLMs and AI
   answer engines, built from the same data the pages render. */

export const dynamic = "force-static";

const link = (path: string) => `${SITE_URL}${path}`;

const BODY = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

${SITE_NAME} is a free-to-play sports prediction game for Android and iOS, made by StatOz, a gaming-first sports entertainment company based in India. Players answer a short pre-match quiz on real fixtures, back their best calls with Oz Coins, and earn XP for correct answers to climb a global leaderboard.

Key facts:
- Price: free. No deposits, entry fees or cash payouts.
- Not gambling: Oz Coins and XP are virtual, earned in-app, and have no cash value.
- Sports: FIFA World Cup 2026 (48 nations, 104 fixtures), EPL, IPL, NBA, La Liga and more.
- Platforms: Android (Google Play) and iOS (App Store). Age 18+.
- Contact: support@statoz.in

## Download

- [Google Play (Android)](${PLAY_STORE_URL})
- [App Store (iPhone, iPad)](${APP_STORE_URL})
- [download.statoz.in](https://download.statoz.in): opens the right store for the visitor's device

## Pages

- [Home](${link("/")}): what StatOz is and how the game works
- [FAQ](${link(ROUTES.faq)}): common questions about pricing, coins, XP and gambling
- [About](${link(ROUTES.about)}): the company and its no-gambling stance
- [Blog](${link(ROUTES.blog)}): product guides and community reports
${BLOG_POSTS.map((post) => `- [${post.title}](${link(post.href)}): ${post.summary}`).join("\n")}

## FAQ

${FAQ_ITEMS.map((item) => `### ${item.q}\n\n${item.a}`).join("\n\n")}

## Optional

- [Terms & Conditions](${link(ROUTES.terms)})
- [Privacy Policy](${link(ROUTES.privacy)})
`;

export function GET() {
  return new Response(BODY, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
