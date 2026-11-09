import { GAMES } from "@/lib/data";

export default function Games() {
  return (
    <section className="section games" id="games">
      <div className="wrap">
        <header className="sec-head sec-head--row reveal">
          <div>
            <span className="sec-head__tag">// GAMES · LIVE</span>
            <h2 className="sec-head__title">
              MORE WAYS TO <span className="grad">PLAY</span>
            </h2>
          </div>
          <p className="sec-head__lead sec-head__lead--right">
            Predictions are just the start. A full arcade of quick skill games
            is already in the app, free to play.
          </p>
        </header>

        <div className="games__grid">
          {GAMES.map((g, i) => (
            <article
              key={g.name}
              className={`game reveal${i < 2 ? " game--feature" : ""}${
                g.bg ? " game--bg" : ""
              }`}
              data-hud
              style={
                g.bg
                  ? {
                      backgroundImage: `linear-gradient(180deg, rgba(6,8,15,.55), rgba(6,8,15,.92)), url(${g.bg})`,
                    }
                  : undefined
              }
            >
              <span className="soon-badge soon-badge--live">LIVE</span>
              <div className="game__body">
                <span className="game__tag">{g.tag}</span>
                <h3>{g.name}</h3>
                <p>{g.desc}</p>
                <div className="game__meta">
                  {g.meta.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}

          <article className="game game--more reveal" data-hud>
            <div className="game__body">
              <span className="game__tag">// TRIVIA GAUNTLETS</span>
              <h3>Sports quizzes</h3>
              <p>
                Football, cricket, basketball, racing and tennis trivia. Answer
                fast, answer right, earn Oz Coins.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
