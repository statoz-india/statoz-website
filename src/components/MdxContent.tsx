import { evaluate } from "@mdx-js/mdx";
import type { MDXComponents } from "mdx/types";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import SmartLink from "@/components/SmartLink";

/* Compiles a post's MDX body on the server. Posts are prerendered at build
   time, so this never runs in the browser and a broken post fails the build.

   To give posts a custom component, add it to COMPONENTS and use it in any
   .mdx file as <Name prop="…" />. Keep posts mostly plain Markdown: the same
   text feeds llms-full.txt, where components appear as raw tags. */

const COMPONENTS: MDXComponents = {
  a: SmartLink,
  // Wide tables scroll inside this box instead of the whole page.
  table: (props) => (
    <div className="article-table" role="region" aria-label="Table" tabIndex={0}>
      <table {...props} />
    </div>
  ),
};

export default async function MdxContent({ source, file }: { source: string; file: string }) {
  let Content;
  try {
    ({ default: Content } = await evaluate(source, {
      ...runtime,
      remarkPlugins: [remarkGfm],
    }));
  } catch (error) {
    throw new Error(`Could not compile ${file}: ${(error as Error).message}`);
  }
  return (
    <div className="article-mdx">
      <Content components={COMPONENTS} />
    </div>
  );
}
