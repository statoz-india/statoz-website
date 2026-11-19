import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleView from "@/components/ArticleView";
import JsonLd from "@/components/JsonLd";
import MdxContent from "@/components/MdxContent";
import { getPosts, getPost } from "@/lib/blog";
import { ROUTES } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { articleJsonLd } from "@/lib/structuredData";

type PostPageProps = { params: Promise<{ slug: string }> };

// Only the posts in content/blog exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};

  return pageMetadata({
    title: post.title,
    description: post.description,
    shareDescription: post.summary,
    path: post.href,
    keywords: post.keywords,
    type: "article",
    publishedTime: post.published,
    modifiedTime: post.updated,
    image: { url: `${post.href}/opengraph-image`, alt: post.title },
  });
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd data={articleJsonLd(post)} />
      <ArticleView
        id={`blog_${post.slug}`}
        variant={post.visual.variant}
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Blog", href: ROUTES.blog },
          { label: post.title },
        ]}
        eyebrow={post.eyebrow}
        titleLead={post.titleLead}
        titleGrad={post.titleGrad}
        lead={post.summary}
        faq={post.faq}
        related={getPosts().filter((other) => other.slug !== post.slug)}
        cta={post.cta}
        stats={post.stats}
        statsPanel={post.statsPanel}
      >
        <MdxContent source={post.content} file={`content/blog/${post.slug}.mdx`} />
      </ArticleView>
    </>
  );
}
