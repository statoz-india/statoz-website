import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/* Crawlers welcomed by name so a future blanket rule can't shut StatOz out of
   search, AI answers or link previews by accident. */
const NAMED_CRAWLERS = [
  // Search engines
  "Googlebot",
  "Bingbot",
  "Applebot",
  "DuckDuckBot",
  "YandexBot",
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
  // Google Gemini, Apple Intelligence, Amazon
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  // Meta, Mistral, DuckDuckGo, You.com, Cohere, ByteDance, Common Crawl
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "MistralAI-User",
  "DuckAssistBot",
  "YouBot",
  "cohere-ai",
  "Bytespider",
  "CCBot",
  // Link previews in chat and social apps
  "facebookexternalhit",
  "Twitterbot",
  "LinkedInBot",
  "WhatsApp",
  "TelegramBot",
  "Slackbot",
  "Discordbot",
];

// /get is the device redirect behind download.statoz.in, not a page.
const DISALLOW = ["/get"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      { userAgent: NAMED_CRAWLERS, allow: "/", disallow: DISALLOW },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
