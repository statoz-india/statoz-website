import type { Metadata } from "next";
import Link from "next/link";
import BlogChrome from "@/components/BlogChrome";
import Breadcrumbs from "@/components/Breadcrumbs";
import { BLOG_POSTS } from "@/lib/blog";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Stories, community reports, and prediction insights from StatOz.",
  alternates: { canonical: ROUTES.blog },
  openGraph: {
    title: "StatOz Blog",
    description: "Stories and prediction insights from the StatOz community.",
    url: ROUTES.blog,
  },
};

export default function BlogPage() {
  return (
    <BlogChrome>
      <section className="blog-hero">
        <div className="blog-hero__orb blog-hero__orb--one" aria-hidden />
        <div className="blog-hero__orb blog-hero__orb--two" aria-hidden />
        <div className="wrap">
          <Breadcrumbs
            items={[
              { label: "Home", href: ROUTES.home },
              { label: "Blog" },
            ]}
          />
          <span className="blog-kicker">From the StatOz arena</span>
          <h1>Stories behind <span className="grad">the predictions.</span></h1>
          <p>
            Community milestones, product updates, and the moments that make
            reading the game more rewarding.
          </p>
        </div>
      </section>

      <section className="blog-list section" aria-labelledby="latest-stories">
        <div className="wrap">
          <div className="sec-head">
            <span className="sec-head__tag">LATEST STORIES</span>
            <h2 className="sec-head__title" id="latest-stories">
              From the pitch
            </h2>
          </div>

          <div className="blog-grid">
            {BLOG_POSTS.map((post) => (
              <article className="blog-card reveal" data-hud key={post.slug}>
                <div
                  className={`blog-card__visual blog-card__visual--${post.visual.variant}`}
                  aria-hidden
                >
                  <span>{post.visual.top}</span>
                  <strong>{post.visual.main}</strong>
                  <i>{post.visual.badge}</i>
                </div>
                <div className="blog-card__body">
                  <span className="blog-card__eyebrow">{post.eyebrow}</span>
                  <h3>{post.title}</h3>
                  <p>{post.summary}</p>
                  <Link
                    className="blog-card__link"
                    href={post.href}
                    data-analytics-event="blog_post_click"
                    data-analytics-post-slug={post.slug}
                    data-analytics-post-title={post.title}
                  >
                    {post.linkText} <span aria-hidden>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </BlogChrome>
  );
}
