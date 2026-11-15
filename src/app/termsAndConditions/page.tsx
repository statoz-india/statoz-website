import { TermsContent } from "@/features/home/city-documents";
import type { Metadata } from "next";
import BlogChrome from "@/components/BlogChrome";
import Breadcrumbs from "@/components/Breadcrumbs";
import { shouldShowLayout } from "@/lib/layoutSearchParam";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The Terms & Conditions for StatOz -a 100% free-to-play, skill-based sports prediction gaming platform. No real money, no gambling, virtual coins only.",
  alternates: { canonical: ROUTES.terms },
  openGraph: {
    type: "article",
    title: "Terms & Conditions · StatOz",
    description:
      "The Terms & Conditions for StatOz -a 100% free-to-play, skill-based sports prediction gaming platform.",
    url: ROUTES.terms,
  },
};

const TOC = [
  { id: "about", t: "About StatOz" },
  { id: "eligibility", t: "Eligibility" },
  { id: "registration", t: "Account Registration" },
  { id: "economy", t: "Virtual Economy: Oz Coins & XP" },
  { id: "giveaways", t: "Giveaways & Rewards" },
  { id: "predictions", t: "Prediction Markets & Quizzes" },
  { id: "acceptable-use", t: "Acceptable Use Policy" },
  { id: "ip", t: "Intellectual Property" },
  { id: "privacy", t: "Privacy & Data" },
  { id: "third-party", t: "Third-Party Services" },
  { id: "disclaimers", t: "Disclaimers" },
  { id: "liability", t: "Limitation of Liability" },
  { id: "termination", t: "Account Termination" },
  { id: "law", t: "Governing Law & Disputes" },
  { id: "amendments", t: "Amendments" },
  { id: "contact", t: "Contact Us" },
];

type TermsPageProps = {
  searchParams?: Promise<{ layout?: string | string[] }>;
};

export default async function TermsPage({ searchParams }: TermsPageProps) {
  const resolvedSearchParams = undefined;
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
                { label: "Terms & Conditions" },
              ]}
            />
            <span className="blog-kicker">// LEGAL · TERMS OF USE</span>
            <h1>
              Terms &amp; <span className="grad">Conditions</span>
            </h1>
            <p className="legal-hero__meta">
              Platform: StatOz -Sports Prediction Gaming Platform · Version 1.4
              · Effective March 2026 · Jurisdiction: Republic of India
            </p>
            <p className="article-hero__lead">
              Please read these Terms carefully before using StatOz. By
              accessing or using the platform, you agree to be bound by these
              Terms.
            </p>
          </div>
        </header>

        <div className="wrap legal-layout">
          <aside className="legal-toc" aria-label="Table of contents">
            <div className="legal-toc__panel" data-hud>
              <span className="legal-toc__label">On this page</span>
              <ol>
                {TOC.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`}>
                      <span className="legal-toc__no">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {s.t}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          <div className="legal-body">
            <TermsContent />
          </div>
        </div>
      </article>
    </BlogChrome>
  );
}
