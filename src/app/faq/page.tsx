import BlogChrome from "@/components/BlogChrome";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { FAQ_ITEMS } from "@/lib/faqData";
import { shouldShowLayout } from "@/lib/layoutSearchParam";
import { ROUTES } from "@/lib/routes";
import { KEYWORDS, pageMetadata } from "@/lib/seo";
import { faqJsonLd } from "@/lib/structuredData";

export const metadata = pageMetadata({
  title: "FAQ",
  description:
    "Answers about StatOz — free sports predictions, Oz Coins, XP, and how the game works. No real money, not gambling.",
  shareDescription:
    "Answers about StatOz — free sports predictions, Oz Coins, XP, and how the game works.",
  path: ROUTES.faq,
  keywords: [
    "is StatOz free",
    "is StatOz gambling",
    "what are Oz Coins",
    ...KEYWORDS.trust,
    KEYWORDS.core[0],
    KEYWORDS.worldCup[0],
  ],
});

type FaqPageProps = {
  searchParams?: Promise<{ layout?: string | string[] }>;
};

export default async function FaqPage({ searchParams }: FaqPageProps) {
  const resolvedSearchParams = await searchParams;
  const showLayout = shouldShowLayout(resolvedSearchParams);

  return (
    <BlogChrome showLayout={showLayout}>
      <JsonLd data={faqJsonLd(FAQ_ITEMS)} />
      <section className="blog-hero">
        <div className="blog-hero__orb blog-hero__orb--one" aria-hidden />
        <div className="blog-hero__orb blog-hero__orb--two" aria-hidden />
        <div className="wrap">
          <Breadcrumbs
            items={[{ label: "Home", href: ROUTES.home }, { label: "FAQ" }]}
          />
          <span className="blog-kicker">// BRIEFING</span>
          <h1>
            Before you <span className="grad">kick off</span>
          </h1>
          <p>
            Everything you need to know about StatOz — free to play, virtual
            coins only, and built for fans who read the game.
          </p>
        </div>
      </section>

      <section className="section faq" aria-labelledby="faq-heading">
        <div className="wrap">
          <header className="sec-head reveal">
            <span className="sec-head__tag">FREQUENTLY ASKED</span>
            <h2 className="sec-head__title" id="faq-heading">
              Common questions
            </h2>
          </header>
          <div className="faq__list reveal">
            {FAQ_ITEMS.map((item) => (
              <details className="qa" key={item.q} data-faq-location="faq_page">
                <summary>
                  {item.q}
                  <i />
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </BlogChrome>
  );
}
