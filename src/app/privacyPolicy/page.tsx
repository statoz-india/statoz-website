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
            <p>
              This privacy policy applies to the Statoz app (hereby referred to
              as the &quot;Application&quot;) for mobile devices that was created
              by the Service Provider as a free service. This service is
              intended for use &quot;AS IS&quot;.
            </p>

            <section className="legal-section" id="information-collection">
              <h2>1. Information Collection and Use</h2>
              <p>
                The Application collects information when you download and use
                it. This information may include:
              </p>
              <ul>
                <li>
                  Your device&apos;s Internet Protocol address (e.g. IP address)
                </li>
                <li>
                  The pages of the Application that you visit, the time and date
                  of your visit, and the time spent on those pages
                </li>
                <li>The time spent on the Application</li>
                <li>The operating system you use on your mobile device</li>
              </ul>
              <p>
                The Application does not gather precise information about the
                location of your mobile device.
              </p>
              <p>
                The Service Provider may use the information you provided to
                contact you from time to time to provide you with important
                information, required notices, and marketing promotions.
              </p>
              <p>
                For a better experience, while using the Application, the
                Service Provider may require you to provide certain personally
                identifiable information. The information that the Service
                Provider requests will be retained by them and used as described
                in this Privacy Policy.
              </p>
            </section>

            <section className="legal-section" id="third-party-access">
              <h2>2. Third Party Access</h2>
              <p>
                Only aggregated, anonymized data is periodically transmitted to
                external services to aid the Service Provider in improving the
                Application and their service. The Service Provider may share
                your information with third parties in the ways described in
                this privacy statement.
              </p>
              <p>
                The Service Provider may disclose User Provided and
                Automatically Collected Information:
              </p>
              <ul>
                <li>
                  As required by law, such as to comply with a subpoena or
                  similar legal process
                </li>
                <li>
                  When they believe in good faith that disclosure is necessary
                  to protect their rights, protect your safety or the safety of
                  others, investigate fraud, or respond to a government request
                </li>
                <li>
                  With their trusted service providers who work on their behalf,
                  do not have an independent use of the information disclosed to
                  them, and have agreed to adhere to the rules set forth in this
                  privacy statement
                </li>
              </ul>
            </section>

            <section className="legal-section" id="opt-out">
              <h2>3. Opt-Out Rights</h2>
              <p>
                You can stop all collection of information by the Application
                easily by uninstalling it. You may use the standard uninstall
                processes available as part of your mobile device or via the
                mobile application marketplace or network.
              </p>
            </section>

            <section className="legal-section" id="data-retention">
              <h2>4. Data Retention Policy</h2>
              <p>
                The Service Provider will retain User Provided data for as long
                as you use the Application and for a reasonable time thereafter.
                If you would like them to delete User Provided Data that you
                have provided via the Application, please contact them at{" "}
                <a href="mailto:support@statoz.in">support@statoz.in</a>, and
                they will respond in a reasonable time.
              </p>
            </section>

            <section className="legal-section" id="children">
              <h2>5. Children</h2>
              <p>
                The Service Provider does not use the Application to knowingly
                solicit data from or market to children under the age of 13.
              </p>
              <p>
                The Service Provider does not knowingly collect personally
                identifiable information from children. The Service Provider
                encourages all children to never submit any personally
                identifiable information through the Application and/or
                Services. The Service Provider encourages parents and legal
                guardians to monitor their children&apos;s Internet usage and to
                help enforce this Policy by instructing their children never to
                provide personally identifiable information through the
                Application and/or Services without their permission.
              </p>
              <p>
                If you have reason to believe that a child has provided
                personally identifiable information to the Service Provider
                through the Application and/or Services, please contact the
                Service Provider at{" "}
                <a href="mailto:support@statoz.in">support@statoz.in</a> so they
                can take the necessary actions. You must also be at least 16
                years of age to consent to the processing of your personally
                identifiable information in your country. In some countries, a
                parent or guardian may do so on your behalf.
              </p>
            </section>

            <section className="legal-section" id="security">
              <h2>6. Security</h2>
              <p>
                The Service Provider is concerned about safeguarding the
                confidentiality of your information. The Service Provider
                provides physical, electronic, and procedural safeguards to
                protect the information they process and maintain.
              </p>
            </section>

            <section className="legal-section" id="changes">
              <h2>7. Changes</h2>
              <p>
                This Privacy Policy may be updated from time to time for any
                reason. The Service Provider will notify you of any changes by
                updating this page with the new Privacy Policy. You are advised
                to consult this Privacy Policy regularly for any changes, as
                continued use is deemed approval of all changes.
              </p>
              <p>This Privacy Policy is effective as of January 29, 2026.</p>
            </section>

            <section className="legal-section" id="consent">
              <h2>8. Your Consent</h2>
              <p>
                By using the Application, you consent to the processing of your
                information as set forth in this Privacy Policy now and as
                amended by us.
              </p>
            </section>

            <section className="legal-section" id="contact">
              <h2>9. Contact Us</h2>
              <p>
                If you have any questions regarding privacy while using the
                Application, or have questions about the Service
                Provider&apos;s practices, please contact the Service Provider
                via email at{" "}
                <a href="mailto:support@statoz.in">support@statoz.in</a>.
              </p>
            </section>

            <p className="legal-foot-note">
              Effective January 29, 2026 · For privacy questions or data
              requests, contact support@statoz.in.
            </p>
          </div>
        </div>
      </article>
    </BlogChrome>
  );
}
