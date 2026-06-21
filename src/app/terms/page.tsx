import type { Metadata } from "next";
import BlogChrome from "@/components/BlogChrome";
import Breadcrumbs from "@/components/Breadcrumbs";
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

export default function TermsPage() {
  return (
    <BlogChrome>
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
            <section className="legal-section" id="about">
              <h2>1. About StatOz</h2>
              <p>
                StatOz (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;, or
                &quot;the Platform&quot;) is a completely free-to-play sports
                prediction gaming platform. Users predict match outcomes,
                participate in match quizzes, and compete on leaderboards, all
                powered by a virtual coin economy.
              </p>
              <h3>StatOz is</h3>
              <ul>
                <li>
                  A skill-based sports knowledge and prediction entertainment
                  platform.
                </li>
                <li>A free-to-play gamified app.</li>
                <li>
                  A legal, non-gambling product classified under entertainment.
                </li>
              </ul>
              <h3>StatOz is not</h3>
              <ul>
                <li>A gambling platform.</li>
                <li>A fantasy sports app.</li>
                <li>A real-money product of any kind.</li>
                <li>A crypto or NFT product.</li>
                <li>A payment instrument.</li>
              </ul>
              <p>
                StatOz does not charge users any fees, does not accept payments
                of any kind, and does not involve the wagering of real money.
                Virtual currency on the Platform cannot be purchased, sold, or
                exchanged for cash under any circumstances.
              </p>
            </section>

            <section className="legal-section" id="eligibility">
              <h2>2. Eligibility</h2>
              <h3>Age Requirement</h3>
              <p>
                You must be at least 13 years of age to create an account and
                use StatOz. Users between the ages of 13 and 18 must have the
                consent of a parent or legal guardian. By registering, you
                confirm that you meet this requirement.
              </p>
              <h3>Geographic Access</h3>
              <p>
                StatOz is currently available to users in India. Access from
                other jurisdictions is permitted but at the user&apos;s own
                risk. Local laws regarding online gaming entertainment may
                apply. StatOz makes no representation that the Platform is
                appropriate or legally permissible in all locations.
              </p>
              <h3>One Account Per User</h3>
              <p>
                Each user may maintain only one (1) account. Creating multiple
                accounts to exploit rewards, referral bonuses, leaderboards, or
                any other platform feature is strictly prohibited and will
                result in permanent suspension of all associated accounts.
              </p>
              <h3>Compliance Declaration</h3>
              <p>By using StatOz, you confirm that:</p>
              <ul>
                <li>(a) you are of eligible age,</li>
                <li>
                  (b) you are using the Platform for entertainment purposes
                  only,
                </li>
                <li>
                  (c) your use does not violate any applicable law in your
                  jurisdiction, and
                </li>
                <li>(d) you will comply with these Terms at all times.</li>
              </ul>
            </section>

            <section className="legal-section" id="registration">
              <h2>3. Account Registration</h2>
              <h3>Creating Your Account</h3>
              <p>
                To access the full features of StatOz, you must register for an
                account. You agree to provide accurate, current, and complete
                information during registration and to keep your details updated
                thereafter. Registration is free and requires no payment
                information of any kind.
              </p>
              <h3>Account Security</h3>
              <p>
                You are responsible for maintaining the confidentiality of your
                login credentials. You agree to notify us immediately at{" "}
                <a href="mailto:support@statoz.in">support@statoz.in</a> if you
                suspect any unauthorised access. StatOz will not be liable for
                any loss arising from your failure to maintain account security.
              </p>
              <h3>Your Player ID</h3>
              <p>
                Upon registration, you will be assigned a unique Player ID. This
                ID is permanent and non-transferable. It may be used by other
                users to find your profile on the Platform.
              </p>
              <h3>No Account Transfers</h3>
              <p>
                Accounts, Player IDs, virtual balances, and progress are
                personal and non-transferable. You may not sell, gift, trade, or
                otherwise transfer your account or any in-platform assets to
                another person.
              </p>
            </section>

            <section className="legal-section" id="economy">
              <h2>4. Virtual Economy: Oz Coins and XP</h2>
              <p>
                StatOz operates a virtual economy comprising two in-platform
                units. These units have absolutely no real-world monetary value
                and exist solely to enhance the gaming and competition
                experience.
              </p>
              <h3>Oz Coins</h3>
              <p>
                Earned exclusively through participation in prediction markets
                on the Platform. Oz Coins currently serve as a record of your
                prediction activity and performance. Oz Coins cannot be
                converted to cash, transferred to another account, or redeemed
                for anything of real monetary value.
              </p>
              <p>
                Please note that features allowing users to spend Oz Coins
                within the Platform are currently under development and have not
                yet been made available. Any such features, if and when
                introduced, will be communicated to users in advance and will be
                subject to these Terms.
              </p>
              <h3>XP (Experience Points)</h3>
              <p>
                Earned exclusively through completing match quizzes on the
                Platform. XP drives your leaderboard ranking and serves as a
                record of your quiz performance and sports knowledge. XP cannot
                be spent; it is purely a competitive and status metric.
              </p>
              <h3>No Real-Money Value, Ever</h3>
              <p>Oz Coins and XP are virtual, non-monetary units. They:</p>
              <ul>
                <li>Cannot be purchased with real money in any form</li>
                <li>
                  Cannot be exchanged for real money or transferred to any bank
                  account
                </li>
                <li>Cannot be transferred between user accounts</li>
                <li>
                  Are not refundable under any circumstances, including account
                  termination
                </li>
                <li>
                  Do not constitute property, securities, or any financial
                  instrument
                </li>
                <li>
                  Do not represent any debt or obligation on the part of StatOz
                </li>
              </ul>
              <h3>StatOz Does Not Accept Payments</h3>
              <p>
                StatOz does not charge users for any feature or content on the
                Platform. We do not accept payments, deposits, in-app purchases,
                or any form of monetary transaction from users. There are no
                premium tiers, subscription plans, or paid features. Everything
                on StatOz is free, always.
              </p>
              <h3>Economy Adjustments</h3>
              <p>
                StatOz reserves the right to rebalance earn rates and the
                availability of virtual items at any time to maintain a healthy
                platform economy. We will provide reasonable advance notice of
                material changes.
              </p>
            </section>

            <section className="legal-section" id="giveaways">
              <h2>5. Giveaways and Rewards</h2>
              <h3>Gift Card Giveaways</h3>
              <p>
                StatOz may, at its sole discretion, conduct periodic giveaways
                and reward events for top-performing users, leaderboard
                finishers, or event winners. All such rewards are issued
                exclusively in the form of gift cards (e.g. Amazon, Swiggy,
                Zomato, or similar). No cash prizes, bank transfers, or monetary
                compensation of any kind will ever be awarded.
              </p>
              <h3>No Guarantee of Rewards</h3>
              <p>
                Participation in any StatOz giveaway or reward event does not
                guarantee a prize. Giveaways are conducted at StatOz&apos;s
                discretion, subject to availability, and may be discontinued at
                any time without notice.
              </p>
              <h3>Eligibility for Giveaways</h3>
              <p>To be eligible for any giveaway or reward, you must:</p>
              <ul>
                <li>
                  (a) have a verified, active StatOz account in good standing,
                </li>
                <li>(b) not be in violation of these Terms, and</li>
                <li>
                  (c) meet any additional eligibility criteria communicated at
                  the time of the specific event.
                </li>
              </ul>
              <h3>Gift Card Terms</h3>
              <p>
                Gift cards issued as rewards are subject to the terms and
                conditions of the respective issuing brand. StatOz is not
                responsible for expired, lost, or misused gift cards once
                delivered to the winner. Gift cards are non-transferable and
                cannot be exchanged for cash.
              </p>
              <h3>Winner Verification</h3>
              <p>
                StatOz reserves the right to verify the eligibility of any
                winner before issuing a reward. If a winner is found to have
                violated these Terms, exploited the Platform, or provided false
                information, the reward will be forfeited without liability to
                StatOz.
              </p>
            </section>

            <section className="legal-section" id="predictions">
              <h2>6. Prediction Markets and Quizzes</h2>
              <h3>Nature of Predictions</h3>
              <p>
                StatOz offers virtual prediction markets and match quizzes.
                These are skill-based entertainment features that test your
                sports knowledge. All participation is free; no real money is
                involved at any stage.
              </p>
              <h3>Prediction Markets</h3>
              <p>
                Users may place virtual predictions on match outcomes using Oz
                Coins. All prediction activity is conducted using virtual
                currency only. No real money is staked, won, or lost at any
                point. Outcomes are determined solely by actual match results as
                reported by our data providers.
              </p>
              <h3>Match Quizzes</h3>
              <p>
                Users may answer match-based quiz questions before a match
                begins to earn XP. Quiz performance reflects sports knowledge
                and prediction accuracy, not chance.
              </p>
              <h3>No Accuracy Guarantee</h3>
              <p>
                StatOz does not guarantee the accuracy, completeness, or
                timeliness of match data, odds, or quiz questions. Sports events
                are inherently unpredictable. Any reliance on Platform content
                for real-world decision-making is entirely at your own risk.
              </p>
              <h3>Quiz Submissions</h3>
              <p>
                Answers may be edited until the match begins. Once a match
                starts, submissions are locked and cannot be changed. XP rewards
                are distributed after match completion and result verification.
                StatOz reserves the right to withhold or reverse rewards if
                technical errors, data feed failures, or user manipulation are
                detected.
              </p>
              <h3>Legal Classification</h3>
              <p>
                The prediction and quiz features on StatOz are classified as
                skill-based entertainment gaming under applicable Indian law.
                Accuracy of sports knowledge and prediction skill are the sole
                determinants of reward outcomes, not chance. No state-level
                gaming bans are applicable to this product category. No RBI
                payment gateway restrictions apply as no monetary transactions
                take place.
              </p>
            </section>

            <section className="legal-section" id="acceptable-use">
              <h2>7. Acceptable Use Policy</h2>
              <h3>Permitted Use</h3>
              <p>
                StatOz is provided for personal, non-commercial entertainment
                use only. You may use the Platform to participate in
                predictions, quizzes, and community features as designed.
              </p>
              <h3>Prohibited Conduct</h3>
              <p>You agree that you will not:</p>
              <ul>
                <li>
                  Create multiple accounts to exploit bonuses, referrals, or
                  leaderboards
                </li>
                <li>
                  Use bots, scripts, automation, or any artificial means to
                  interact with the Platform
                </li>
                <li>
                  Attempt to reverse-engineer, decompile, or extract source code
                  from the Platform
                </li>
                <li>
                  Circumvent, disable, or interfere with Platform security
                  features
                </li>
                <li>
                  Use the Platform to transmit spam, malware, or any harmful
                  content
                </li>
                <li>
                  Post content that is defamatory, abusive, obscene,
                  threatening, or unlawful
                </li>
                <li>Impersonate any person, entity, or StatOz team member</li>
                <li>
                  Attempt to sell, monetise, or commercially exploit virtual
                  currency or account access in any way
                </li>
                <li>
                  Use the Platform in any way that violates applicable Indian
                  law or the laws of your jurisdiction
                </li>
              </ul>
              <h3>Community Standards</h3>
              <p>
                The StatOz community, including the Community Reel feed,
                comments, and social features, is expected to maintain a
                respectful, sporting environment. Content that promotes hatred,
                discrimination, violence, or illegal activity will be removed
                without notice.
              </p>
              <h3>Enforcement</h3>
              <p>
                StatOz reserves the right to investigate suspected violations
                and take appropriate action, including content removal, account
                suspension, or permanent ban, without prior notice and without
                liability to you.
              </p>
            </section>

            <section className="legal-section" id="ip">
              <h2>8. Intellectual Property</h2>
              <h3>Our Content</h3>
              <p>
                All content on StatOz, including the &quot;StatOz&quot; name,
                logo, interface design, graphics, animations, text, quiz
                questions, game mechanics, and software, is the exclusive
                intellectual property of StatOz or its licensors, protected
                under Indian and international copyright, trademark, and
                intellectual property laws.
              </p>
              <h3>Your Licence</h3>
              <p>
                StatOz grants you a limited, non-exclusive, non-transferable,
                revocable licence to access and use the Platform for personal,
                non-commercial entertainment purposes, subject to these Terms.
                This licence does not permit copying, reproducing, distributing,
                creating derivative works of, or commercially exploiting any
                Platform content.
              </p>
              <h3>User-Generated Content</h3>
              <p>
                By submitting any content to the Platform (comments,
                predictions, community posts), you grant StatOz a worldwide,
                royalty-free, perpetual, non-exclusive licence to use,
                reproduce, modify, and display such content in connection with
                the Platform&apos;s operation and promotion. You retain
                ownership of your content but warrant that it does not infringe
                any third-party rights.
              </p>
              <h3>Third-Party Sports Data</h3>
              <p>
                Match data, player statistics, and sports information displayed
                on StatOz may be sourced from third-party data providers. StatOz
                does not claim ownership over such data. All sports team names,
                logos, and related marks are the property of their respective
                owners.
              </p>
            </section>

            <section className="legal-section" id="privacy">
              <h2>9. Privacy and Data</h2>
              <p>
                Your use of StatOz is subject to our Privacy Policy,
                incorporated into these Terms by reference.
              </p>
              <h3>Data We Collect</h3>
              <ul>
                <li>
                  Registration data: username, email address, date of birth
                </li>
                <li>
                  Usage data: quiz activity, prediction history, session
                  duration, device information
                </li>
                <li>
                  Analytics data: app interactions used to improve the Platform
                </li>
              </ul>
              <p>
                StatOz does not collect, store, or process any payment or
                financial information, as no monetary transactions take place on
                the Platform.
              </p>
              <h3>How We Use Your Data</h3>
              <ul>
                <li>To operate, personalise, and improve the Platform</li>
                <li>To manage leaderboard rankings and reward eligibility</li>
                <li>To deliver relevant advertising on the Platform</li>
                <li>
                  To comply with legal obligations and prevent fraud or abuse
                </li>
              </ul>
              <h3>Your Rights</h3>
              <p>
                Under applicable law, you have the right to access, correct, or
                request deletion of your personal data. Contact{" "}
                <a href="mailto:support@statoz.in">support@statoz.in</a>. We
                will respond within 30 days of a verified request.
              </p>
            </section>

            <section className="legal-section" id="third-party">
              <h2>10. Third-Party Services</h2>
              <h3>Affiliate Partners</h3>
              <p>
                StatOz may feature third-party brands within the Platform in
                relation to giveaways or community events. The terms of any such
                offers are governed by the respective brand&apos;s own policies.
                StatOz is not liable for any disputes arising from third-party
                brand offers.
              </p>
              <h3>External Links</h3>
              <p>
                The Platform may contain links to third-party websites or
                services. StatOz is not responsible for the content, accuracy,
                or practices of any third-party site. Visiting external links is
                entirely at your own risk.
              </p>
            </section>

            <section className="legal-section" id="disclaimers">
              <h2>11. Disclaimers</h2>
              <h3>&quot;As Is&quot; Provision</h3>
              <p>
                StatOz is provided on an &quot;as is&quot; and &quot;as
                available&quot; basis without warranties of any kind, express or
                implied. We do not warrant that the Platform will be
                uninterrupted, error-free, or free of harmful components.
              </p>
              <h3>Sports Data Accuracy</h3>
              <p>
                StatOz does not guarantee that match data, odds, scores, or quiz
                answers are accurate or up to date. Errors in third-party data
                feeds may affect Platform content. StatOz is not liable for
                decisions made based on Platform information.
              </p>
              <h3>Service Interruptions</h3>
              <p>
                StatOz may suspend or discontinue the Platform or any feature at
                any time for maintenance, upgrades, or circumstances beyond our
                control. We will endeavour to provide advance notice where
                reasonably possible. StatOz is not liable for any loss of
                access, virtual currency, or progress resulting from such
                interruptions.
              </p>
              <h3>Virtual Economy Discontinuation</h3>
              <p>
                In the event of Platform shutdown or discontinuation, all
                associated virtual currency balances and progress will be
                rendered null. As no real money is involved at any point, no
                compensation of any kind will be owed to users for virtual
                currency holdings.
              </p>
            </section>

            <section className="legal-section" id="liability">
              <h2>12. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by applicable Indian law,
                StatOz, its directors, employees, partners, and licensors shall
                not be liable for:
              </p>
              <ul>
                <li>
                  Any indirect, incidental, special, consequential, or punitive
                  damages
                </li>
                <li>Loss of virtual currency, progress, or account access</li>
                <li>
                  Any claims arising from reliance on Platform content for
                  real-world decisions
                </li>
                <li>
                  Unauthorised access to or alteration of your account or data
                </li>
                <li>Any matter beyond our reasonable control</li>
              </ul>
              <p>
                As StatOz does not charge users any fees or accept any payments,
                the Platform&apos;s maximum total liability to you for any claim
                shall not exceed ₹0 in monetary terms. Any remedy available to
                you is limited to the continuation or restoration of Platform
                access where reasonably possible.
              </p>
            </section>

            <section className="legal-section" id="termination">
              <h2>13. Account Termination</h2>
              <h3>By You</h3>
              <p>
                You may delete your StatOz account at any time through the
                account settings or by contacting{" "}
                <a href="mailto:support@statoz.in">support@statoz.in</a>. Upon
                deletion, your account data, virtual currency, and progress will
                be permanently removed. As StatOz does not accept payments, no
                refund considerations apply.
              </p>
              <h3>By StatOz</h3>
              <p>
                StatOz reserves the right to suspend or terminate your account,
                with or without notice, if we determine that you have:
              </p>
              <ul>
                <li>(a) violated these Terms,</li>
                <li>(b) engaged in fraudulent or abusive conduct,</li>
                <li>(c) posed a risk to other users or the Platform, or</li>
                <li>
                  (d) engaged in conduct that brings the Platform into
                  disrepute.
                </li>
              </ul>
            </section>

            <section className="legal-section" id="law">
              <h2>14. Governing Law and Dispute Resolution</h2>
              <p>
                These Terms are governed by and construed in accordance with the
                laws of the Republic of India, without regard to conflict of law
                principles.
              </p>
              <h3>Informal Resolution First</h3>
              <p>
                Before initiating any formal legal proceeding, you agree to
                contact us at{" "}
                <a href="mailto:support@statoz.in">support@statoz.in</a> with a
                written description of the dispute. We will make every
                reasonable effort to resolve the matter informally within 30
                days.
              </p>
              <h3>Jurisdiction</h3>
              <p>
                If informal resolution fails, disputes shall be subject to the
                exclusive jurisdiction of the courts located in Bengaluru,
                Karnataka, India.
              </p>
            </section>

            <section className="legal-section" id="amendments">
              <h2>15. Amendments</h2>
              <p>
                StatOz reserves the right to update or modify these Terms at any
                time. When changes are made, we will:
              </p>
              <ul>
                <li>
                  Update the &quot;Effective Date&quot; at the top of this
                  document
                </li>
                <li>
                  Notify registered users via in-app notification or email
                </li>
                <li>
                  Provide at least 14 days&apos; advance notice for material
                  changes
                </li>
              </ul>
              <p>
                Your continued use of the Platform after the effective date of
                any amendment constitutes your acceptance of the updated Terms.
                If you do not agree to the amended Terms, you must discontinue
                use of the Platform.
              </p>
            </section>

            <section className="legal-section" id="contact">
              <h2>16. Contact Us</h2>
              <p>
                General Support, Privacy Queries, Legal and Compliance:{" "}
                <a href="mailto:support@statoz.in">support@statoz.in</a>
              </p>
              <p>
                Platform:{" "}
                <a href="https://statoz.in" target="_blank" rel="noopener">
                  statoz.in
                </a>
              </p>
              <p>
                StatOz | Bengaluru, Karnataka, India -Built on knowledge.
                Powered by passion.
              </p>
            </section>

            <p className="legal-foot-note">
              Version 1.4 · Effective March 2026. StatOz is a 100% free-to-play
              entertainment platform. StatOz does not accept money from users.
              No real money is ever involved. All giveaways and rewards are
              issued exclusively in the form of gift cards.
            </p>
          </div>
        </div>
      </article>
    </BlogChrome>
  );
}
