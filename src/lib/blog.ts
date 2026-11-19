import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { absoluteLinks, type BlogStat } from "@/lib/article";
import { blogPostPath } from "@/lib/routes";

/* Every blog post is one MDX file in content/blog/<slug>.mdx: YAML front
   matter for the metadata, Markdown (plus GitHub tables) for the body.
   /blog/[slug] renders it, and the sitemap, RSS feed, llms.txt, llms-full.txt
   and BlogPosting schema all read getPosts(), so adding a file is all it takes.
   Front matter is checked when the site builds; a bad field fails the build
   with the file name. See content/blog/README.md for the fields. */

export type { BlogStat };

export interface BlogPost {
  /** The file name without .mdx. */
  slug: string;
  /** Always /blog/<slug>. */
  href: string;
  eyebrow: string;
  title: string;
  /** h1 is split so the second half can carry the gradient. */
  titleLead: string;
  titleGrad: string;
  summary: string;
  /** Meta description: answer-first, under ~160 characters. */
  description: string;
  keywords: readonly string[];
  /** ISO dates (YYYY-MM-DD). */
  published: string;
  updated: string;
  visual: {
    top: string;
    main: string;
    badge: string;
    variant: "season" | "quiz";
  };
  linkText: string;
  stats: BlogStat[];
  statsPanel: { label: string; heading: string; note?: string };
  /** Shown at the end of the post with FAQPage schema. Facts from the post only. */
  faq: { q: string; a: string }[];
  cta: string;
  /** The MDX body, without front matter. */
  content: string;
}

const POSTS_DIR = path.join(process.cwd(), "content", "blog");
const VARIANTS = ["season", "quiz"] as const;

/* ---- Front matter validation ------------------------------------------ */

type Data = Record<string, unknown>;

class PostError extends Error {
  constructor(file: string, message: string) {
    super(`content/blog/${file}: ${message}`);
  }
}

function text(data: Data, key: string, file: string, optional = false) {
  const value = data[key];
  if (value === undefined && optional) return undefined;
  if (typeof value !== "string" || !value.trim()) {
    throw new PostError(file, `"${key}" must be a non-empty string.`);
  }
  return value.trim();
}

function record(data: Data, key: string, file: string): Data {
  const value = data[key];
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new PostError(file, `"${key}" must be an object.`);
  }
  return value as Data;
}

function list(data: Data, key: string, file: string): unknown[] {
  const value = data[key];
  if (!Array.isArray(value) || value.length === 0) {
    throw new PostError(file, `"${key}" must be a non-empty list.`);
  }
  return value;
}

function isoDate(data: Data, key: string, file: string) {
  // YAML turns an unquoted 2026-11-19 into a Date; accept both forms.
  const raw = data[key];
  const value = raw instanceof Date ? raw.toISOString().slice(0, 10) : raw;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new PostError(file, `"${key}" must be a date like "2026-11-19".`);
  }
  return value;
}

function parsePost(file: string): BlogPost {
  const slug = file.replace(/\.mdx$/, "");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new PostError(file, "file names must be lowercase words joined by hyphens.");
  }

  const { data, content } = matter(fs.readFileSync(path.join(POSTS_DIR, file), "utf8"));
  const visual = record(data, "visual", file);
  const variant = text(visual, "variant", file)!;
  if (!(VARIANTS as readonly string[]).includes(variant)) {
    throw new PostError(file, `"visual.variant" must be one of: ${VARIANTS.join(", ")}.`);
  }
  const panel = record(data, "statsPanel", file);
  const published = isoDate(data, "published", file);
  const updated = isoDate(data, "updated", file);
  if (updated < published) {
    throw new PostError(file, `"updated" (${updated}) is before "published" (${published}).`);
  }
  if (!content.trim()) throw new PostError(file, "the post has no body.");

  return {
    slug,
    href: blogPostPath(slug),
    eyebrow: text(data, "eyebrow", file)!,
    title: text(data, "title", file)!,
    titleLead: text(data, "titleLead", file)!,
    titleGrad: text(data, "titleGrad", file)!,
    summary: text(data, "summary", file)!,
    description: text(data, "description", file)!,
    keywords: list(data, "keywords", file).map((keyword) => text({ keyword }, "keyword", file)!),
    published,
    updated,
    visual: {
      top: text(visual, "top", file)!,
      main: text(visual, "main", file)!,
      badge: text(visual, "badge", file)!,
      variant: variant as BlogPost["visual"]["variant"],
    },
    linkText: text(data, "linkText", file)!,
    stats: list(data, "stats", file).map((item) => {
      const stat = record({ stat: item }, "stat", file);
      return { label: text(stat, "label", file)!, value: text(stat, "value", file)! };
    }),
    statsPanel: {
      label: text(panel, "label", file)!,
      heading: text(panel, "heading", file)!,
      note: text(panel, "note", file, true),
    },
    faq: list(data, "faq", file).map((item) => {
      const qa = record({ qa: item }, "qa", file);
      return { q: text(qa, "q", file)!, a: text(qa, "a", file)! };
    }),
    cta: text(data, "cta", file)!,
    content: content.trim(),
  };
}

/* Newest first; same-day posts by last update, then slug, so the order is
   stable from build to build. */
function loadPosts(): BlogPost[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map(parsePost)
    .sort(
      (a, b) =>
        b.published.localeCompare(a.published) ||
        b.updated.localeCompare(a.updated) ||
        a.slug.localeCompare(b.slug),
    );
}

let cache: BlogPost[] | undefined;

/* Every post, newest first. A production build reads the folder once. In
   development it re-reads on every call: Next doesn't watch content/, so this
   is what makes an edited post show up on the next reload. */
export function getPosts(): BlogPost[] {
  if (process.env.NODE_ENV !== "production") return loadPosts();
  return (cache ??= loadPosts());
}

export function getPost(slug: string) {
  return getPosts().find((post) => post.slug === slug);
}

/* For code that links to a specific post: a renamed or deleted file fails the
   build instead of leaving a broken link. */
export function requirePost(slug: string) {
  const post = getPost(slug);
  if (!post) throw new Error(`No blog post at content/blog/${slug}.mdx`);
  return post;
}

/* Plain-text version of a post for llms-full.txt. Headings drop one level so
   they sit under the post title, MDX comments are removed and site links
   become absolute. */
export function postToMarkdown(post: BlogPost) {
  const body = absoluteLinks(
    post.content
      .replace(/\{\/\*[\s\S]*?\*\/\}\n?/g, "")
      .replace(/^(#{2,5}) /gm, "#$1 "),
  );
  const stats = post.stats.map((s) => `- ${s.label}: ${s.value}`).join("\n");
  const faq = post.faq.map((item) => `**${item.q}** ${item.a}`).join("\n\n");
  return `${body}\n\n${post.statsPanel.heading}:\n${stats}${faq ? `\n\n${faq}` : ""}`;
}
