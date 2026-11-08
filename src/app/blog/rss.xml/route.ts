import { BLOG_POSTS } from "@/lib/blog";
import { ROUTES } from "@/lib/routes";
import { SITE_URL, SITE_NAME } from "@/lib/site";

/* RSS 2.0 feed for readers and aggregators, built from BLOG_POSTS. */

export const dynamic = "force-static";

const escapeXml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const rfc822 = (isoDate: string) => new Date(`${isoDate}T00:00:00Z`).toUTCString();

export function GET() {
  const feedUrl = `${SITE_URL}/blog/rss.xml`;
  const latest = BLOG_POSTS.map((post) => post.updated).sort().at(-1);

  const items = BLOG_POSTS.map((post) => {
    const url = `${SITE_URL}${post.href}`;
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(post.published)}</pubDate>
      <category>${escapeXml(post.eyebrow)}</category>
      <description>${escapeXml(post.summary)}</description>
    </item>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} Blog</title>
    <link>${SITE_URL}${ROUTES.blog}</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <description>Product guides, community reports and prediction insights from ${SITE_NAME}, the free sports prediction game.</description>
    <language>en-IN</language>
${latest ? `    <lastBuildDate>${rfc822(latest)}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
