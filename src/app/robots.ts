import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = 'force-static';

/* Everything is open except /get (the device redirect behind
   download.statoz.in). Search engines, AI assistants and link-preview bots
   are also allowed by name, so a future blanket rule can't shut them out. */
const NAMED_AGENTS = [
  // OpenAI
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google Gemini
  "Google-Extended",
  // Apple
  "Applebot",
  "Applebot-Extended",
  // Other AI assistants and crawlers
  "Amazonbot",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "MistralAI-User",
  "DuckAssistBot",
  "YouBot",
  "cohere-ai",
  "Bytespider",
  "CCBot",
  // Search engines
  "Googlebot",
  "Bingbot",
  "DuckDuckBot",
  "YandexBot",
  // Link previews
  "facebookexternalhit",
  "Twitterbot",
  "LinkedInBot",
  "WhatsApp",
  "TelegramBot",
  "Slackbot",
  "Discordbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/get" },
      { userAgent: NAMED_AGENTS, allow: "/", disallow: "/get" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
