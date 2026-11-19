import type { ReactNode } from "react";
import SmartLink from "@/components/SmartLink";
import type { ArticleBlock } from "@/lib/article";

/* Renders ArticleBlock data (used by league pages). Blog posts are MDX and
   render through MdxContent instead. */

/* Inline marks inside block text: [label](href) and **bold**. */
const INLINE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;

function Rich({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE)) {
    const at = match.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    const [, label, href, bold] = match;
    out.push(
      bold ? (
        <strong key={at}>{bold}</strong>
      ) : (
        <SmartLink key={at} href={href}>
          {label}
        </SmartLink>
      ),
    );
    last = at + match[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.kind) {
    case "intro":
      return (
        <p className="article-copy__intro">
          <Rich text={block.text} />
        </p>
      );
    case "h2":
      return <h2>{block.text}</h2>;
    case "h3":
      return <h3>{block.text}</h3>;
    case "quote":
      return (
        <blockquote>
          <p>
            <Rich text={block.text} />
          </p>
        </blockquote>
      );
    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List>
          {block.items.map((item, i) => (
            <li key={i}>
              <Rich text={item} />
            </li>
          ))}
        </List>
      );
    }
    case "table":
      return (
        // Wide tables scroll inside this box instead of the whole page.
        <div className="article-table" role="region" aria-label={block.caption} tabIndex={0}>
          <table>
            <caption>{block.caption}</caption>
            <thead>
              <tr>
                {block.head.map((cell) => (
                  <th key={cell} scope="col">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) =>
                    c === 0 ? (
                      <th key={c} scope="row">
                        <Rich text={cell} />
                      </th>
                    ) : (
                      <td key={c}>
                        <Rich text={cell} />
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return (
        <p>
          <Rich text={block.text} />
        </p>
      );
  }
}

export default function ArticleBlocks({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => (
        <Block block={block} key={index} />
      ))}
    </>
  );
}
