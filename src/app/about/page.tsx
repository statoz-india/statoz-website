import BlogChrome from "@/components/BlogChrome";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ABOUT_LEAD, ABOUT_SECTIONS, type AboutBlock } from "@/lib/about";
import { shouldShowLayout } from "@/lib/layoutSearchParam";
import { ROUTES } from "@/lib/routes";
import { KEYWORDS, pageMetadata } from "@/lib/seo";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "Learn about StatOz, a gaming-first company building fun, social, and immersive sports experiences. StatOz is not a gambling platform.",
  shareDescription:
    "StatOz is a gaming-first company building a unified sports gaming platform for fans. No gambling, no real money, and no real-money prizes.",
  path: ROUTES.about,
  type: "article",
  keywords: [...KEYWORDS.trust, KEYWORDS.core[0], "sports gaming company India"],
});

const TOC = [
  ...ABOUT_SECTIONS.map((section) => ({ id: section.id, t: section.title })),
  { id: "contact", t: "Contact" },
];

function Block({ block }: { block: AboutBlock }) {
  if ("h3" in block) return <h3>{block.h3}</h3>;
  if ("ul" in block)
    return (
      <ul>
        {block.ul.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  return <p>{block.p}</p>;
}

type AboutPageProps = {
  searchParams?: Promise<{ layout?: string | string[] }>;
};

export default async function AboutPage({ searchParams }: AboutPageProps) {
  const resolvedSearchParams = await searchParams;
  const showLayout = shouldShowLayout(resolvedSearchParams);

  return (
    <BlogChrome showLayout={showLayout}>
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
            <p className="article-hero__lead">{ABOUT_LEAD}</p>
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
            {ABOUT_SECTIONS.map((section, index) => (
              <section className="legal-section" id={section.id} key={section.id}>
                <h2>{`${index + 1}. ${section.title}`}</h2>
                {section.blocks.map((block, blockIndex) => (
                  <Block block={block} key={blockIndex} />
                ))}
              </section>
            ))}

            <section className="legal-section" id="contact">
              <h2>{`${ABOUT_SECTIONS.length + 1}. Contact`}</h2>
              <p>
                For questions about StatOz, partnerships, support, or platform
                safety, contact us at{" "}
                <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
              </p>
              <p>
                Platform:{" "}
                <a href="https://statoz.in" target="_blank" rel="noopener">
                  statoz.in
                </a>
              </p>
            </section>

            <p className="legal-foot-note">
              StatOz is a gaming-first sports entertainment company. We are not
              a gambling platform. No real money or real-money prizes can be
              won on StatOz.
            </p>
          </div>
        </div>
      </article>
    </BlogChrome>
  );
}
