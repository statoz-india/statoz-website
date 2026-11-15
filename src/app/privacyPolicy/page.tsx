import { PrivacyContent } from "@/features/home/city-documents";
import type { Metadata } from "next";
import BlogChrome from "@/components/BlogChrome";
import Breadcrumbs from "@/components/Breadcrumbs";
import { shouldShowLayout } from "@/lib/layoutSearchParam";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how the Statoz mobile application collects, uses, retains, and protects your information.",
  alternates: { canonical: ROUTES.privacy },
  openGraph: {
    type: "article",
    title: "Privacy Policy · Statoz",
    description:
      "Learn how the Statoz mobile application collects, uses, retains, and protects your information.",
    url: ROUTES.privacy,
  },
};

const TOC = [
  { id: "information-collection", t: "Information Collection and Use" },
  { id: "third-party-access", t: "Third Party Access" },
  { id: "opt-out", t: "Opt-Out Rights" },
  { id: "data-retention", t: "Data Retention Policy" },
  { id: "children", t: "Children" },
  { id: "security", t: "Security" },
  { id: "changes", t: "Changes" },
  { id: "consent", t: "Your Consent" },
  { id: "contact", t: "Contact Us" },
];

type PrivacyPolicyPageProps = {
  searchParams?: Promise<{ layout?: string | string[] }>;
};

export default async function PrivacyPolicyPage({
  searchParams,
}: PrivacyPolicyPageProps) {
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
                { label: "Privacy Policy" },
              ]}
            />
            <span className="blog-kicker">// LEGAL · PRIVACY POLICY</span>
            <h1>
              Privacy <span className="grad">Policy</span>
            </h1>
            <p className="legal-hero__meta">
              Application: Statoz · Effective January 29, 2026
            </p>
            <p className="article-hero__lead">
              This Privacy Policy explains how information is collected, used,
              retained, and protected when you use the Statoz mobile
              application.
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
            <PrivacyContent />
          </div>
        </div>
      </article>
    </BlogChrome>
  );
}
