import { SITE_URL } from "@/lib/site";

/* Shared article types. League pages build their body from ArticleBlock data;
   blog posts are MDX files in content/blog (see src/lib/blog.ts).

   Text in intro, p, quote, list items and table cells accepts two inline marks:
   [label](/path or https://url) for links and **text** for bold. */

export interface BlogStat {
  label: string;
  value: string;
}

export type ArticleBlock =
  | { kind: "intro"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "p"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "list"; items: string[]; ordered?: boolean }
  | {
      kind: "table";
      /** Read aloud by screen readers and printed above the table. */
      caption: string;
      head: string[];
      rows: string[][];
    };

/* Markdown links to site paths become absolute URLs, for llms-full.txt. */
export const absoluteLinks = (text: string) =>
  text.replace(/\]\((\/[^)\s]*)\)/g, (_, path: string) => `](${SITE_URL}${path})`);

const tableRow = (cells: string[]) => `| ${cells.map(absoluteLinks).join(" | ")} |`;

/* Markdown version of article blocks for llms-full.txt. */
export function blocksToMarkdown(blocks: ArticleBlock[]) {
  return blocks
    .map((block) => {
      switch (block.kind) {
        case "h2":
          return `### ${block.text}`;
        case "h3":
          return `#### ${block.text}`;
        case "quote":
          return `> ${absoluteLinks(block.text)}`;
        case "list":
          return block.items
            .map((item, i) => `${block.ordered ? `${i + 1}.` : "-"} ${absoluteLinks(item)}`)
            .join("\n");
        case "table":
          return [
            `${block.caption}:`,
            "",
            tableRow(block.head),
            tableRow(block.head.map(() => "---")),
            ...block.rows.map(tableRow),
          ].join("\n");
        default:
          return absoluteLinks(block.text);
      }
    })
    .join("\n\n");
}
