import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/blog";
import { GAMES } from "@/lib/games";
import { LEAGUE_PAGES } from "@/lib/leagues";
import { ROUTES } from "@/lib/routes";
import { SITE_URL } from "@/lib/site";

export const dynamic = 'force-static';

type Entry = MetadataRoute.Sitemap[number];

/* Static pages carry no lastModified on purpose: stamping every URL with the
   build time teaches Google to ignore the field. Posts use their real
   `updated` date. League pages, games and posts come from their data files,
   so adding one adds it here. */
const PAGES: (Omit<Entry, "url"> & { path: string })[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: ROUTES.download, changeFrequency: "monthly", priority: 0.8 },
  { path: ROUTES.faq, changeFrequency: "monthly", priority: 0.8 },
  { path: ROUTES.about, changeFrequency: "monthly", priority: 0.7 },
  { path: ROUTES.blog, changeFrequency: "weekly", priority: 0.7 },
  { path: ROUTES.terms, changeFrequency: "yearly", priority: 0.3 },
  { path: ROUTES.privacy, changeFrequency: "yearly", priority: 0.3 },
];

const url = (path: string) => `${SITE_URL}${path === "/" ? "/" : path}`;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PAGES.map(({ path, ...entry }) => ({ url: url(path), ...entry })),
    ...LEAGUE_PAGES.map((league) => ({
      url: url(league.href),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...GAMES.map((game) => ({
      url: url(game.href),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...getPosts().map((post) => ({
      url: url(post.href),
      lastModified: post.updated,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
