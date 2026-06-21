import { PLAYERS, RARITY_LEGEND } from "@/lib/data";

const VISIBLE_PLAYERS = PLAYERS.slice(0, 5);

export default function Squad() {
  return (
    <section className="section squad" id="cards">
      <div className="wrap">
        <header className="sec-head sec-head--row reveal">
          <div>
            <span className="sec-head__tag">// CARD POOL · PREVIEW</span>
            <h2 className="sec-head__title">
              MEET THE <span className="grad-gold">COLLECTION</span>
            </h2>
          </div>
          <p className="sec-head__lead sec-head__lead--right">
            The cards behind the Daily Card Drop and the upcoming Pitch Duel —
            graded by rarity from Bronze to Platinum.
          </p>
        </header>

        <ul className="rarity-legend reveal">
          {RARITY_LEGEND.map((t) => (
            <li key={t.name} className={`rl rl--${t.rarity}`}>
              <b>{t.name}</b>
              <span>{t.range}</span>
            </li>
          ))}
        </ul>

        <div className="squad__grid" id="squadGrid">
          {VISIBLE_PLAYERS.map((p) => (
            <article
              key={p.id}
              className={`fcard fcard--${p.rarity} reveal`}
              data-tilt
              data-cat={p.cat.join(" ")}
            >
              <div className="fcard__sheen" />
              <div className="fcard__holo" />
              <div className="fcard__corner fcard__corner--tl" />
              <div className="fcard__corner fcard__corner--br" />
              <div className="fcard__top">
                <div className="fcard__rating">{p.r}</div>
                <div className="fcard__pos">{p.pos}</div>
                <div className="fcard__tier">{p.rarity}</div>
              </div>
              <div className="fcard__img">
                <img
                  src={`/assets/players/${p.id}.webp`}
                  alt={`${p.n} card`}
                  loading="lazy"
                />
              </div>
              <div className="fcard__plate">
                <div className="fcard__name">{p.n}</div>
                <div className="fcard__nation">{p.nat}</div>
              </div>
            </article>
          ))}
          <div className="squad-more reveal">
            <span>+200</span>
            <b>More cards!</b>
          </div>
        </div>
      </div>
    </section>
  );
}
