import Link from "next/link";
import { publicAsset } from '@statoz/design-system/asset';
import { GAMES } from "@/lib/games";

export default function Games() {
  return (
    <section className="section games" id="games">
      <div className="wrap">
        <header className="sec-head sec-head--row reveal">
          <div>
            <span className="sec-head__tag">// GAMES · PLAY NOW</span>
            <h2 className="sec-head__title">
              MORE WAYS TO <span className="grad">PLAY</span>
            </h2>
          </div>
          <p className="sec-head__lead sec-head__lead--right">
            Predictions are just the start. Build a deck, face the spot-kick
            pressure or take control of the tactical board.
          </p>
        </header>

        <div className="games__grid">
          {GAMES.map((game, index) => (
            <article
              key={game.slug}
              className={`game game--${game.theme} reveal${
                index < 2 ? " game--feature" : ""
              }`}
              data-hud
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(6,8,15,.38), rgba(6,8,15,.94)), url(${publicAsset(game.background)})`,
              }}
            >
              <div className="game__schematic" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
              <Link
                className="game__link"
                href={game.href}
                aria-label={`Explore ${game.name}`}
              >
                <div className="game__body">
                  <span className="game__tag">{game.tag}</span>
                  <h3>{game.name}</h3>
                  <p>{game.teaser}</p>
                  <div className="game__meta">
                    {game.homeMeta.map((meta) => (
                      <span key={meta}>{meta}</span>
                    ))}
                  </div>
                  <b className="game__cta">
                    Explore game <span aria-hidden="true">-&gt;</span>
                  </b>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
