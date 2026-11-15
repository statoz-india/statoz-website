import Link from "next/link";
import '@/app/game-pages.css';
import BlogChrome from "@/components/BlogChrome";
import Breadcrumbs from "@/components/Breadcrumbs";
import StoreIcon from "@/components/StoreIcon";
import { GAMES, type GameDetail, type GameTheme } from "@/lib/games";
import { ROUTES } from "@/lib/routes";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/storeLinks";

function StoreButtons({
  game,
  location,
}: {
  game: GameDetail;
  location: "hero" | "final";
}) {
  return (
    <div className="game-store-actions">
      <a
        className="btn btn--lg btn--game-primary"
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener"
        data-analytics-event="download_cta_click"
        data-analytics-cta-label={`Play ${game.name} on Google Play`}
        data-analytics-cta-location={`game_${location}_${game.slug}`}
        data-analytics-store="google_play"
      >
        <StoreIcon store="playstore" className="btn__i" />
        <span className="store">
          <small>GET IT ON</small>Google Play
        </span>
      </a>
      <a
        className="btn btn--lg btn--game-ghost"
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener"
        data-analytics-event="download_cta_click"
        data-analytics-cta-label={`Play ${game.name} on the App Store`}
        data-analytics-cta-location={`game_${location}_${game.slug}`}
        data-analytics-store="app_store"
      >
        <StoreIcon store="apple" className="btn__i" />
        <span className="store">
          <small>DOWNLOAD ON</small>App Store
        </span>
      </a>
    </div>
  );
}

function GameVisual({ theme, name }: { theme: GameTheme; name: string }) {
  return (
    <div className={`game-visual game-visual--${theme}`} data-hud aria-hidden="true">
      <div className="game-visual__head">
        <span>// {name}</span>
        <i />
        <b>PLAY NOW</b>
      </div>

      {theme === "duel" && (
        <div className="duel-schematic">
          <div className="duel-schematic__pitch">
            <span className="tactic-node tactic-node--one" />
            <span className="tactic-node tactic-node--two" />
            <span className="tactic-node tactic-node--three" />
            <span className="tactic-node tactic-node--four" />
            <i className="tactic-line tactic-line--one" />
            <i className="tactic-line tactic-line--two" />
            <i className="tactic-line tactic-line--three" />
          </div>
          <div className="shot-meter">
            <span>SHOT METER</span>
            <div className="shot-meter__track">
              <i />
              <i />
              <i />
              <i />
              <b />
            </div>
            <strong>PERFECT</strong>
          </div>
        </div>
      )}

      {theme === "shootout" && (
        <div className="shootout-schematic">
          <div className="shootout-goal">
            <span className="shootout-target shootout-target--one" />
            <span className="shootout-target shootout-target--two" />
            <span className="shootout-target shootout-target--three" />
          </div>
          <span className="shootout-ball" />
          <div className="shootout-kicks">
            {Array.from({ length: 5 }, (_, index) => (
              <i key={index} className={index < 3 ? "is-scored" : ""} />
            ))}
          </div>
        </div>
      )}

      {theme === "chess" && (
        <div className="chess-schematic">
          <div className="chess-board">
            {Array.from({ length: 12 }, (_, index) => (
              <span key={index} />
            ))}
            <i className="chess-piece chess-piece--one" />
            <i className="chess-piece chess-piece--two" />
            <i className="chess-piece chess-piece--three" />
            <i className="chess-piece chess-piece--four" />
            <i className="chess-piece chess-piece--ball" />
          </div>
          <div className="chess-actions">
            <span>PASS</span>
            <span>DRIBBLE</span>
            <span>SHOOT</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GameDetailPage({ game }: { game: GameDetail }) {
  const relatedGames = GAMES.filter((item) => item.slug !== game.slug);

  return (
    <BlogChrome>
      <article className={`game-page game-page--${game.theme}`}>
        <header className="game-detail-hero">
          <div className="game-detail-hero__backdrop" aria-hidden="true" />
          <div className="game-detail-hero__grid" aria-hidden="true" />
          <div className="wrap">
            <Breadcrumbs
              items={[
                { label: "Home", href: ROUTES.home },
                { label: "Games", href: ROUTES.games },
                { label: game.name },
              ]}
            />

            <div className="game-detail-hero__inner">
              <div className="game-detail-hero__copy">
                <span className="game-page__kicker">{game.kicker}</span>
                <h1>
                  <span className="game-detail-hero__name">{game.name}</span>
                  {game.heroLead} <span>{game.heroAccent}</span>
                </h1>
                <p>{game.teaser}</p>
                <StoreButtons game={game} location="hero" />
                <ul className="game-detail-hero__proof" aria-label="App highlights">
                  <li>Free to play</li>
                  <li>No deposits</li>
                  <li>Single-player tactics</li>
                </ul>
              </div>

              <GameVisual theme={game.theme} name={game.name} />
            </div>

            <dl className="game-stat-strip">
              {game.stats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        <section className="game-content-section">
          <div className="wrap">
            <header className="game-section-head">
              <span className="game-page__kicker">// Inside the mode</span>
              <h2>What to expect from {game.name}</h2>
              <p>
                Built for quick decisions, readable rules and the kind of football
                tension that makes one choice feel decisive.
              </p>
            </header>
            <div className="game-expect-grid">
              {game.expectations.map((item, index) => (
                <article className="game-info-card" data-hud key={item.title}>
                  <span>0{index + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="game-content-section game-flow-section">
          <div className="wrap">
            <header className="game-section-head game-section-head--row">
              <div>
                <span className="game-page__kicker">// From entry to result</span>
                <h2>How a match unfolds</h2>
              </div>
              <p>
                Everything you need to know before your first game, without
                spoiling the decisions waiting inside it.
              </p>
            </header>
            <ol className="game-flow-list">
              {game.flow.map((step) => (
                <li key={step.number}>
                  <span>{step.number}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="game-content-section">
          <div className="wrap game-mechanics-layout">
            <header className="game-section-head">
              <span className="game-page__kicker">// The decisions underneath</span>
              <h2>Mechanics that shape the result</h2>
              <p>
                Easy to understand on the first run, with enough tactical depth
                to make the next matchup feel different.
              </p>
            </header>
            <div className="game-mechanics-grid">
              {game.mechanics.map((item) => (
                <article key={item.title}>
                  <i aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="game-reward-section">
          <div className="wrap">
            <div className="game-reward-panel" data-hud>
              <div>
                <span className="game-page__kicker">{game.reward.eyebrow}</span>
                <h2>{game.reward.title}</h2>
                <p>{game.reward.description}</p>
              </div>
              <ul>
                {game.reward.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="game-related-section">
          <div className="wrap">
            <header className="game-section-head game-section-head--compact">
              <span className="game-page__kicker">// Keep playing</span>
              <h2>Explore more StatOz games</h2>
            </header>
            <div className="game-related-grid">
              {relatedGames.map((related) => (
                <Link
                  className={`game-related-card game-related-card--${related.theme}`}
                  href={related.href}
                  key={related.slug}
                  aria-label={`Explore ${related.name}`}
                >
                  <span>{related.tag}</span>
                  <h3>{related.name}</h3>
                  <p>{related.teaser}</p>
                  <b>Explore game <i aria-hidden="true">-&gt;</i></b>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="game-final-cta">
          <div className="game-final-cta__grid" aria-hidden="true" />
          <div className="wrap game-final-cta__inner">
            <div>
              <span className="game-page__kicker">// Ready for kickoff?</span>
              <h2>Your next {game.name} match is waiting.</h2>
              <p>Download StatOz for free, build your squad and play now.</p>
            </div>
            <StoreButtons game={game} location="final" />
          </div>
        </section>
      </article>
    </BlogChrome>
  );
}
