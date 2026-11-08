import Link from "next/link";
import BlogChrome from "@/components/BlogChrome";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqList, { type FaqItem } from "@/components/FaqList";
import type { ArticleBlock, BlogStat } from "@/lib/blog";
import { ROUTES } from "@/lib/routes";

/* The article layout shared by blog posts and league pages: hero, body copy,
   FAQ, related links, download CTA and a stats sidebar. */

export type ArticleViewProps = {
  /** Unique id, used for analytics locations. */
  id: string;
  variant: "season" | "quiz";
  breadcrumbs: { label: string; href?: string }[];
  eyebrow: string;
  titleLead: string;
  titleGrad: string;
  lead: string;
  body: ArticleBlock[];
  faq: readonly FaqItem[];
  related: { href: string; title: string; slug: string }[];
  cta: string;
  stats: BlogStat[];
  statsPanel: { label: string; heading: string; note?: string };
};

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

export default function ArticleView(props: ArticleViewProps) {
  return (
    <BlogChrome>
      <article className="article-page">
        <header
          className={`article-hero${props.variant === "quiz" ? " article-hero--quiz" : ""}`}
        >
          <div className="article-hero__grid" aria-hidden />
          <div className="wrap">
            <Breadcrumbs items={props.breadcrumbs} />
            <span className="blog-kicker">{props.eyebrow}</span>
            <h1>
              {props.titleLead} <span className="grad">{props.titleGrad}</span>
            </h1>
            <p className="article-hero__lead">{props.lead}</p>
          </div>
        </header>

        <div className="wrap article-layout">
          <section
            className="article-copy"
            aria-label={`${props.titleLead} ${props.titleGrad}`}
          >
            {props.body.map((block, index) => (
              <Block block={block} key={index} />
            ))}

            <FaqList items={props.faq} location={props.id} />

            {props.related.length > 0 && (
              <>
                <h2>Read next</h2>
                <ul>
                  {props.related.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        data-analytics-event="blog_post_click"
                        data-analytics-post-slug={link.slug}
                        data-analytics-post-title={link.title}
                      >
                        {link.title}
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
              data-analytics-cta-label={props.cta}
              data-analytics-cta-location={props.id}
            >
              {props.cta}
            </Link>
          </section>

          <aside
            className="article-stats"
            aria-label={`${props.statsPanel.heading} summary`}
          >
            <div className="article-stats__panel" data-hud>
              <span className="article-stats__label">{props.statsPanel.label}</span>
              <h2>{props.statsPanel.heading}</h2>
              <dl>
                {props.stats.map((stat) => (
                  <div key={stat.label}>
                    <dt>{stat.label}</dt>
                    <dd>{stat.value}</dd>
                  </div>
                ))}
              </dl>
              {props.statsPanel.note && (
                <p className="article-stats__note">{props.statsPanel.note}</p>
              )}
            </div>
          </aside>
        </div>
      </article>
    </BlogChrome>
  );
}
