import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";
import { ROUTES } from "@/lib/routes";

type Entry = [path: string, changeFrequency: "weekly" | "monthly" | "yearly", priority: number];

// No lastModified on static pages: stamping every URL with the build time
// teaches Google to ignore the field. Blog posts carry their real dates.
const PAGES: Entry[] = [
  ["/", "weekly", 1],
  [ROUTES.download, "monthly", 0.8],
  [ROUTES.faq, "monthly", 0.8],
  [ROUTES.about, "monthly", 0.7],
  [ROUTES.blog, "weekly", 0.7],
  [ROUTES.terms, "yearly", 0.3],
  [ROUTES.privacy, "yearly", 0.3],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = PAGES.map(([path, changeFrequency, priority]) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency,
    priority,
  }));

  // Every post in BLOG_POSTS is listed automatically.
  const posts = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}${post.href}`,
    lastModified: post.updated,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...pages, ...posts];
}
