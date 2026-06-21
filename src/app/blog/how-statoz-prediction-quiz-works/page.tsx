import type { Metadata } from "next";
import Link from "next/link";
import BlogChrome from "@/components/BlogChrome";
import Breadcrumbs from "@/components/Breadcrumbs";
import { PREDICTION_QUIZ_POST } from "@/lib/blog";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "How the StatOz Prediction Quiz Works",
  description:
    "Learn how StatOz match quizzes work: answer four pre-match questions, lock picks at kickoff, earn XP after automatic settlement, and climb the leaderboards.",
  alternates: { canonical: ROUTES.predictionQuizGuide },
  openGraph: {
    type: "article",
    title: "How the StatOz Prediction Quiz Works",
    description: PREDICTION_QUIZ_POST.summary,
    url: ROUTES.predictionQuizGuide,
  },
};

export default function PredictionQuizGuidePage() {
  return (
    <BlogChrome>
      <article className="article-page">
        <header className="article-hero article-hero--quiz">
          <div className="article-hero__grid" aria-hidden />
          <div className="wrap">
            <Breadcrumbs
              items={[
                { label: "Home", href: ROUTES.home },
                { label: "Blog", href: ROUTES.blog },
                { label: PREDICTION_QUIZ_POST.title },
              ]}
            />
            <span className="blog-kicker">{PREDICTION_QUIZ_POST.eyebrow}</span>
            <h1>
              How the StatOz <span className="grad">Prediction Quiz Works</span>
            </h1>
            <p className="article-hero__lead">{PREDICTION_QUIZ_POST.summary}</p>
          </div>
        </header>

        <div className="wrap article-layout">
          <section
            className="article-copy"
            aria-label="How the prediction quiz works"
          >
            <p className="article-copy__intro">
              Watching a match is one thing. Calling what happens next makes
              every attack, booking, and final whistle feel different. The
              StatOz Prediction Quiz turns each fixture into four quick
              pre-match questions that reward football knowledge with XP.
            </p>

            <h2>Four questions for every match</h2>
            <p>
              Open a fixture and you will find four questions about the match
              ahead. They can cover the result, goalscorers, bookings, set
              pieces, and other key events. Answer one at a time and edit your
              calls freely while the quiz is open.
            </p>

            <h2>Your calls lock at kickoff</h2>
            <p>
              The prediction window closes when the match begins. Once kickoff
              arrives, your four answers are locked, leaving you free to watch
              the action and see how your read of the game plays out.
            </p>

            <blockquote>
              <p>
                Four questions. One fixture. Every answer is a chance to prove
                you read the game.
              </p>
            </blockquote>

            <h2>Full-time triggers automatic settlement</h2>
            <p>
              After the match, StatOz automatically settles the quiz against the
              confirmed outcomes. There is nothing to claim and no score to
              enter manually. Your answers are graded and the result appears in
              the app.
            </p>

            <h2>Correct answers credit XP</h2>
            <p>
              Every correct call earns XP. A wrong answer simply scores zero; it
              never removes XP you have already earned. Quiz predictions use XP
              only -Oz Coins are not staked on these questions.
            </p>

            <h2>Climb Match Day and League leaderboards</h2>
            <p>
              Your credited XP determines where you rank. The Match Day
              leaderboard captures the immediate contest around the latest
              fixtures, while the League leaderboard tracks the longer race
              across the competition.
            </p>

            <h2>More ways to compete are coming soon</h2>
            <p>
              XP credit is live today. Leveling, accuracy streaks, and private
              friend leaderboards are coming soon, alongside more ways to
              compare your reads and build a prediction identity over time.
              Launch dates will be shared when those features are ready.
            </p>

            <h2>Free to play, built for bragging rights</h2>
            <p>
              StatOz uses virtual rewards with no cash value. There are no entry
              fees, deposits, cash stakes, or cash payouts in the Prediction
              Quiz -just your calls, your XP, and the leaderboard.
            </p>

            <Link
              className="btn btn--primary article-cta"
              href={ROUTES.download}
            >
              Try the prediction quiz
            </Link>
          </section>

          <aside className="article-stats" aria-label="Prediction quiz summary">
            <div className="article-stats__panel" data-hud>
              <span className="article-stats__label">The match flow</span>
              <h2>Quiz at a glance</h2>
              <dl>
                {PREDICTION_QUIZ_POST.stats.map((stat) => (
                  <div key={stat.label}>
                    <dt>{stat.label}</dt>
                    <dd>{stat.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="article-stats__note">
                XP credit is live. Levels, streaks, and private leaderboards are
                coming soon.
              </p>
            </div>
          </aside>
        </div>
      </article>
    </BlogChrome>
  );
}
