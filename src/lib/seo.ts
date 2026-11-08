import type { Metadata } from "next";
import { SHARED_OPEN_GRAPH, SITE_NAME } from "@/lib/site";

/* The words fans actually type, grouped by intent. Pages pick the groups that
   fit them for their meta keywords; llms-full.txt prints every group as
   "Topics" so AI assistants learn the same vocabulary. Spelling variants
   (Statoz, Stat Oz, soccer/football) are deliberate. */
export const KEYWORDS = {
  core: [
    "sports prediction game",
    "free sports prediction game",
    "free prediction game",
    "sports prediction app",
    "match prediction quiz",
    "football prediction game",
    "soccer prediction game",
    "free-to-play prediction game",
    "prediction game India",
    "predict match results",
  ],
  worldCup: [
    "World Cup 2026 predictions",
    "FIFA World Cup 2026 prediction game",
    "World Cup 2026 predictor",
    "World Cup prediction app",
    "World Cup 2026 fixtures",
    "World Cup 2026 quiz",
    "48 nations 104 fixtures",
  ],
  leagues: [
    "EPL predictions",
    "Premier League prediction game",
    "IPL prediction game",
    "IPL 2026 predictions",
    "La Liga predictions",
    "NBA predictions",
    "cricket prediction game",
  ],
  mechanics: [
    "pre-match prediction quiz",
    "Oz Coins",
    "XP leaderboard",
    "global leaderboard",
    "match day leaderboard",
    "prediction streaks",
    "accuracy streak",
    "prediction boosters",
    "player cards",
  ],
  trust: [
    "no real money",
    "not gambling",
    "not a betting app",
    "no deposits",
    "skill-based game",
    "virtual coins",
    "free to play 18+",
  ],
  audience: [
    "football fans",
    "cricket fans",
    "sports fans in India",
    "fantasy sports players",
    "sports quiz lovers",
  ],
  comparisons: [
    "free alternative to fantasy sports",
    "prediction game vs fantasy sports",
    "prediction game without betting",
  ],
  brand: ["StatOz", "Statoz", "Stat Oz", "StatOz app"],
} as const;

export const KEYWORD_GROUP_LABELS: Record<keyof typeof KEYWORDS, string> = {
  core: "Core",
  worldCup: "FIFA World Cup 2026",
  leagues: "Leagues and tournaments",
  mechanics: "How the game works",
  trust: "Free and not gambling",
  audience: "Audience",
  comparisons: "Comparisons",
  brand: "Brand",
};

type PageMetadataInput = {
  /** Shown in the tab via the root template ("%s · StatOz") unless absolute. */
  title: string;
  absoluteTitle?: boolean;
  description: string;
  path: string;
  keywords?: readonly string[];
  type?: "website" | "article";
  /** Share-card description when it should differ from the meta description. */
  shareDescription?: string;
  publishedTime?: string;
  modifiedTime?: string;
};

/* One place that builds a page's head tags. A page's openGraph and twitter
   replace the parent's wholesale, so every page goes through here to keep its
   own title, canonical, keywords and 1200×630 share card. */
export function pageMetadata({
  title,
  absoluteTitle = false,
  description,
  path,
  keywords = [],
  type = "website",
  shareDescription = description,
  publishedTime,
  modifiedTime,
}: PageMetadataInput): Metadata {
  const shareTitle = absoluteTitle ? title : `${title} · ${SITE_NAME}`;
  const allKeywords = [...new Set([...keywords, ...KEYWORDS.brand.slice(0, 2)])];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: allKeywords,
    alternates: { canonical: path },
    openGraph: {
      ...SHARED_OPEN_GRAPH,
      type,
      title: shareTitle,
      description: shareDescription,
      url: path,
      ...(type === "article" && { publishedTime, modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description: shareDescription,
      images: SHARED_OPEN_GRAPH.images,
    },
  };
}
