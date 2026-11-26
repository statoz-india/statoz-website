import type { ArticleBlock } from "@/lib/article";

/* Renders a league page body inside <ArticleView>. Blog posts use
   <MdxContent> instead. */
export default function ArticleBlocks({ blocks }: { blocks: readonly ArticleBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.kind) {
          case "intro":
            return (
              <p key={index} className="article-copy__intro">
                {block.text}
              </p>
            );
          case "h2":
            return <h2 key={index}>{block.text}</h2>;
          case "p":
            return <p key={index}>{block.text}</p>;
        }
      })}
    </>
  );
}
