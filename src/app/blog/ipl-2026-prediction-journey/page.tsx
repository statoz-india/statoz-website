import type { Metadata } from "next";
import Link from "next/link";
import BlogChrome from "@/components/BlogChrome";
import Breadcrumbs from "@/components/Breadcrumbs";
import { IPL_JOURNEY_POST } from "@/lib/blog";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Our IPL 2026 Prediction Journey",
  description:
    "How 292 StatOz players made 479 IPL 2026 predictions, submitted 1,137 entries, and placed 80,471 Oz Coins.",
  alternates: { canonical: ROUTES.iplJourney },
  openGraph: {
    type: "article",
    title: "Our IPL 2026 Prediction Journey",
    description: IPL_JOURNEY_POST.summary,
    url: ROUTES.iplJourney,
  },
};

export default function IplJourneyPage() {
  return (
    <BlogChrome>
      <article className="article-page">
        <header className="article-hero">
          <div className="article-hero__grid" aria-hidden />
          <div className="wrap">
            <Breadcrumbs
              items={[
                { label: "Home", href: ROUTES.home },
                { label: "Blog", href: ROUTES.blog },
                { label: IPL_JOURNEY_POST.title },
              ]}
            />
            <span className="blog-kicker">{IPL_JOURNEY_POST.eyebrow}</span>
            <h1>
              Our IPL 2026 <span className="grad">Prediction Journey</span>
            </h1>
            <p className="article-hero__lead">{IPL_JOURNEY_POST.summary}</p>
          </div>
        </header>

        <div className="wrap article-layout">
          <section className="article-copy" aria-label="IPL prediction journey">
            <p className="article-copy__intro">
              IPL 2026 gave us more than thrilling finishes and bold calls. It
              gave the StatOz community a season-long arena to test instincts,
              follow momentum, and experience every match with something extra
              on the line.
            </p>

            <h2>292 players joined the action</h2>
            <p>
              Across the journey, 292 users stepped into the prediction arena.
              Every pick represented a point of view: a read on the match, a
              belief in a team, or a feeling that the game was about to turn.
            </p>

            <h2>From predictions to match-day momentum</h2>
            <p>
              Together, the community made 479 predictions and sent in 1,137
              total submissions. That activity turned fixtures into ongoing
              conversations, with players returning to back their judgment as
              the tournament unfolded.
            </p>

            <blockquote>
              <p>
                The real win was seeing hundreds of fans read the game together
                -one prediction at a time.
              </p>
            </blockquote>

            <h2>80,471 Oz Coins backed those calls</h2>
            <p>
              Players placed a combined 80,471 Oz Coins across their picks.
              Those coins carried no cash value; they were a simple way to
              express confidence, add friendly stakes, and make each outcome
              feel more meaningful.
            </p>

            <h2>A 47.88% correct prediction rate</h2>
            <p>
              The final correct-prediction rate landed at 47.88%. In a
              tournament built on pressure, changing form, and surprise results,
              that number captures exactly why prediction games stay compelling:
              the game always has another twist.
            </p>

            <h2>What comes next</h2>
            <p>
              This IPL journey is only one chapter. We are carrying everything
              we learned into the next set of contests, with more ways for fans
              to make picks, follow their accuracy, and climb together.
            </p>

            <Link
              className="btn btn--primary article-cta"
              href={ROUTES.download}
            >
              Join the next prediction
            </Link>
          </section>

          <aside
            className="article-stats"
            aria-label="IPL 2026 journey statistics"
          >
            <div className="article-stats__panel" data-hud>
              <span className="article-stats__label">Season snapshot</span>
              <h2>IPL 2026 in numbers</h2>
              <dl>
                {IPL_JOURNEY_POST.stats.map((stat) => (
                  <div key={stat.label}>
                    <dt>{stat.label}</dt>
                    <dd>{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </article>
    </BlogChrome>
  );
}
