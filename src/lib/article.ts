import { SITE_URL } from "@/lib/site";

/* Shared building blocks for long-form pages: blog posts (MDX) and league
   pages (ArticleBlock lists rendered by <ArticleBlocks>). */

export interface BlogStat {
  label: string;
  value: string;
}

/* A league page body. "intro" is the answer-first opening paragraph that
   search engines and AI assistants quote, so it gets the larger intro style. */
export type ArticleBlock =
  | { kind: "intro"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "p"; text: string };

/* Turns site-relative Markdown links, [label](/predictions/ipl), into
   absolute ones for plain-text outputs such as llms-full.txt. */
export function absoluteLinks(markdown: string) {
  return markdown.replace(/\]\((\/[^)\s]*)\)/g, `](${SITE_URL}$1)`);
}

/* Plain Markdown for llms-full.txt. Headings sit one level under the page
   title (###), which llms.ts writes for each page. */
export function blocksToMarkdown(blocks: readonly ArticleBlock[]) {
  return blocks
    .map((block) => (block.kind === "h2" ? `#### ${block.text}` : block.text))
    .join("\n\n");
}
