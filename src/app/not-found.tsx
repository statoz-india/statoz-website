import type { Metadata } from "next";
import Link from "next/link";
import BlogChrome from "@/components/BlogChrome";
import { BLOG_POSTS } from "@/lib/blog";
import { LEAGUE_PAGES } from "@/lib/leagues";
import { ROUTES } from "@/lib/routes";

/* Shown for any unknown URL. Next.js sends it with a 404 status and a
   noindex tag; the links give visitors and crawlers a way back in. */

export const metadata: Metadata = {
  title: "Page not found",
};

const LINKS = [
  { href: "/", t: "Home" },
  ...LEAGUE_PAGES.map((league) => ({ href: league.href, t: league.title })),
  { href: ROUTES.faq, t: "FAQ" },
  { href: ROUTES.blog, t: "Blog" },
  ...BLOG_POSTS.map((post) => ({ href: post.href, t: post.title })),
];

export default function NotFound() {
  return (
    <BlogChrome>
      <section className="blog-hero">
        <div className="blog-hero__orb blog-hero__orb--one" aria-hidden />
        <div className="blog-hero__orb blog-hero__orb--two" aria-hidden />
        <div className="wrap">
          <span className="blog-kicker">// 404 · OFFSIDE</span>
          <h1>
            This page is <span className="grad">off the pitch.</span>
          </h1>
          <p>
            The link may be old or mistyped. StatOz is the free sports
            prediction game: try one of these instead.
          </p>
          <div className="hero__actions" style={{ marginTop: 28 }}>
            <Link className="btn btn--primary btn--lg" href="/">
              Back to home
            </Link>
            <Link
              className="btn btn--ghost btn--lg"
              href={ROUTES.download}
              data-analytics-event="download_cta_click"
              data-analytics-cta-label="Get the app"
              data-analytics-cta-location="not_found"
            >
              Get the app
            </Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="not-found-links">
        <div className="wrap article-copy">
          <h2 id="not-found-links">Popular pages</h2>
          <ul>
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.t}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </BlogChrome>
  );
}
