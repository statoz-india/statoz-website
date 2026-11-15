import type { Metadata } from "next";
import BlogChrome from "@/components/BlogChrome";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FAQ_ITEMS } from "@/lib/faqData";
import { shouldShowLayout } from "@/lib/layoutSearchParam";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about StatOz — free sports predictions, Oz Coins, XP, and how the game works. No real money, not gambling.",
  alternates: { canonical: ROUTES.faq },
  openGraph: {
    title: "FAQ · StatOz",
    description:
      "Answers about StatOz — free sports predictions, Oz Coins, XP, and how the game works.",
    url: ROUTES.faq,
  },
};

type FaqPageProps = {
  searchParams?: Promise<{ layout?: string | string[] }>;
};

export default async function FaqPage({ searchParams }: FaqPageProps) {
  const resolvedSearchParams = await searchParams;
  const showLayout = shouldShowLayout(resolvedSearchParams);

  return (
    <BlogChrome showLayout={showLayout}>
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
              <details className="qa" key={item.q}>
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
