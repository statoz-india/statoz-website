import { AboutContent } from "@/features/home/city-documents";
import type { Metadata } from "next";
import BlogChrome from "@/components/BlogChrome";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about StatOz, a gaming-first company building fun, social, and immersive sports experiences. StatOz is not a gambling platform.",
  alternates: { canonical: ROUTES.about },
  openGraph: {
    type: "article",
    title: "About Us - StatOz",
    description:
      "StatOz is a gaming-first company building a unified sports gaming platform for fans. No gambling, no real money, and no real-money prizes.",
    url: ROUTES.about,
  },
};

const TOC = [
  { id: "who-we-are", t: "Who We Are" },
  { id: "not-gambling", t: "Not Gambling" },
  { id: "what-we-are-building", t: "What We Are Building" },
  { id: "fan-experience", t: "Fan Experience" },
  { id: "free-to-play-economy", t: "Free-To-Play Economy" },
  { id: "contact", t: "Contact" },
];

export default function AboutPage() {
  return (
    <BlogChrome queryLayout>
      <article className="legal-page">
        <header className="article-hero legal-hero">
          <div className="article-hero__grid" aria-hidden />
          <div className="wrap">
            <Breadcrumbs
              items={[
                { label: "Home", href: ROUTES.home },
                { label: "About Us" },
              ]}
            />
            <span className="blog-kicker">// COMPANY - ABOUT STATOZ</span>
            <h1>
              About <span className="grad">StatOz</span>
            </h1>
            <p className="legal-hero__meta">
              Gaming-first sports experiences - Free-to-play entertainment - No
              gambling
            </p>
            <p className="article-hero__lead">
              StatOz exists to make sports more fun, social, and immersive for
              fans. We are building a unified sports gaming platform where
              fandom feels alive before, during, and after every match.
            </p>
          </div>
        </header>

        <div className="wrap legal-layout">
          <aside className="legal-toc" aria-label="Table of contents">
            <div className="legal-toc__panel" data-hud>
              <span className="legal-toc__label">On this page</span>
              <ol>
                {TOC.map((section, index) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>
                      <span className="legal-toc__no">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {section.t}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          <div className="legal-body">
            <AboutContent />
          </div>
        </div>
      </article>
    </BlogChrome>
  );
}
