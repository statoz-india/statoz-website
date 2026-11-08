import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogChrome from "@/components/BlogChrome";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { BLOG_POSTS, getPost, type ArticleBlock } from "@/lib/blog";
import { ROUTES } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { articleJsonLd } from "@/lib/structuredData";

type PostPageProps = { params: Promise<{ slug: string }> };

// Only the posts in BLOG_POSTS exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
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
  });
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.kind) {
    case "intro":
      return <p className="article-copy__intro">{block.text}</p>;
    case "h2":
      return <h2>{block.text}</h2>;
    case "quote":
      return (
        <blockquote>
          <p>{block.text}</p>
        </blockquote>
      );
    default:
      return <p>{block.text}</p>;
  }
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((other) => other.slug !== post.slug);

  return (
    <BlogChrome>
      <JsonLd data={articleJsonLd(post)} />
      <article className="article-page">
        <header
          className={`article-hero${post.visual.variant === "quiz" ? " article-hero--quiz" : ""}`}
        >
          <div className="article-hero__grid" aria-hidden />
          <div className="wrap">
            <Breadcrumbs
              items={[
                { label: "Home", href: ROUTES.home },
                { label: "Blog", href: ROUTES.blog },
                { label: post.title },
              ]}
            />
            <span className="blog-kicker">{post.eyebrow}</span>
            <h1>
              {post.titleLead} <span className="grad">{post.titleGrad}</span>
            </h1>
            <p className="article-hero__lead">{post.summary}</p>
          </div>
        </header>

        <div className="wrap article-layout">
          <section className="article-copy" aria-label={post.title}>
            {post.body.map((block, index) => (
              <Block block={block} key={index} />
            ))}

            {related.length > 0 && (
              <>
                <h2>Read next</h2>
                <ul>
                  {related.map((other) => (
                    <li key={other.slug}>
                      <Link
                        href={other.href}
                        data-analytics-event="blog_post_click"
                        data-analytics-post-slug={other.slug}
                        data-analytics-post-title={other.title}
                      >
                        {other.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <Link
              className="btn btn--primary article-cta"
              href={ROUTES.download}
              data-analytics-event="download_cta_click"
              data-analytics-cta-label={post.cta}
              data-analytics-cta-location={`blog_${post.slug}`}
            >
              {post.cta}
            </Link>
          </section>

          <aside
            className="article-stats"
            aria-label={`${post.statsPanel.heading} summary`}
          >
            <div className="article-stats__panel" data-hud>
              <span className="article-stats__label">
                {post.statsPanel.label}
              </span>
              <h2>{post.statsPanel.heading}</h2>
              <dl>
                {post.stats.map((stat) => (
                  <div key={stat.label}>
                    <dt>{stat.label}</dt>
                    <dd>{stat.value}</dd>
                  </div>
                ))}
              </dl>
              {post.statsPanel.note && (
                <p className="article-stats__note">{post.statsPanel.note}</p>
              )}
            </div>
          </aside>
        </div>
      </article>
    </BlogChrome>
  );
}
