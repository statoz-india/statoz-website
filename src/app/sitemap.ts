import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { ROUTES } from "@/lib/routes";

type Entry = [path: string, changeFrequency: "weekly" | "monthly" | "yearly", priority: number];

// No lastModified: stamping every URL with the build time teaches Google to
// ignore the field. Add real dates per page when content changes.
const PAGES: Entry[] = [
  ["/", "weekly", 1],
  [ROUTES.download, "monthly", 0.8],
  [ROUTES.faq, "monthly", 0.8],
  [ROUTES.predictionQuizGuide, "monthly", 0.8],
  [ROUTES.about, "monthly", 0.7],
  [ROUTES.blog, "weekly", 0.7],
  [ROUTES.iplJourney, "monthly", 0.7],
  [ROUTES.terms, "yearly", 0.3],
  [ROUTES.privacy, "yearly", 0.3],
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(([path, changeFrequency, priority]) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency,
    priority,
  }));
}
