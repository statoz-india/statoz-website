import type { Metadata } from "next";
import BlogChrome from "@/components/BlogChrome";
import Breadcrumbs from "@/components/Breadcrumbs";
import { shouldShowLayout } from "@/lib/layoutSearchParam";
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
            <section className="legal-section" id="who-we-are">
              <h2>1. Who We Are</h2>
              <p>
                StatOz is a gaming-first company for sports fans. Our goal is
                simple: create fun, social, and immersive sports experiences
                that bring fans together.
              </p>
              <p>
                We believe sports fandom should feel playable. StatOz turns the
                energy of matchdays into interactive games, prediction moments,
                progression, and community-driven competition.
              </p>
            </section>

            <section className="legal-section" id="not-gambling">
              <h2>2. Not Gambling</h2>
              <p>
                We are a games company, not a gambling platform. StatOz does
                not support staking, deposits, betting, cash-outs, or wagering
                with real money.
              </p>
              <h3>What this means</h3>
              <ul>
                <li>No real money can be deposited, staked, won, or lost.</li>
                <li>No real-money prizes can be won on the platform.</li>
                <li>
                  In-platform progression exists for gameplay, status, and
                  entertainment only.
                </li>
                <li>
                  StatOz is built around sports knowledge, prediction skill,
                  fan identity, and social competition.
                </li>
              </ul>
            </section>

            <section className="legal-section" id="what-we-are-building">
              <h2>3. What We Are Building</h2>
              <p>
                We are building a unified platform for sports gaming: one place
                where fans can play around matches, test their sports knowledge,
                collect progress, follow their friends, and keep returning as
                the sports calendar evolves.
              </p>
              <p>
                Our long-term vision is to make sports gaming feel like a live
                service game. New matches, seasons, cards, game modes, quests,
                and social layers should keep the experience fresh and worth
                coming back to.
              </p>
            </section>

            <section className="legal-section" id="fan-experience">
              <h2>4. Fan Experience</h2>
              <p>
                StatOz is designed for the moments fans already care about:
                reading the game, backing an instinct, comparing picks, climbing
                leaderboards, and sharing the tension of a live result.
              </p>
              <h3>Built for sports communities</h3>
              <ul>
                <li>Fun game loops around real sports moments.</li>
                <li>Social competition that gives every fan a reason to play.</li>
                <li>
                  Immersive progression systems that reward participation and
                  knowledge.
                </li>
                <li>
                  A platform direction that can grow across sports, formats, and
                  fan communities.
                </li>
              </ul>
            </section>

            <section className="legal-section" id="free-to-play-economy">
              <h2>5. Free-To-Play Economy</h2>
              <p>
                StatOz is free to play. Any coins, XP, ranks, cards, or other
                in-platform systems are virtual game mechanics created to make
                the experience more engaging.
              </p>
              <p>
                These systems do not represent money, financial products,
                payment instruments, or anything that can be redeemed for cash.
                They exist to support competition, expression, and progression
                inside the game.
              </p>
            </section>

            <section className="legal-section" id="contact">
              <h2>6. Contact</h2>
              <p>
                For questions about StatOz, partnerships, support, or platform
                safety, contact us at{" "}
                <a href="mailto:support@statoz.in">support@statoz.in</a>.
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
