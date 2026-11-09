const CARDS = [
  {
    no: "01 / PREDICTOR",
    h: "The superfan with an edge",
    p: "You've called it from the sofa for years. Now the quiz grades every read and the bragging rights are real.",
  },
  {
    no: "02 / TRADER",
    h: "The market reader",
    p: "Sharpen your reads in Oz Coin markets. Every stake builds a track record of calls made under pressure.",
  },
  {
    no: "03 / COMPETITOR",
    h: "The game-mode grinder",
    p: "You want to win, not just watch. Pitch Duel, Penalty Shootout and the arcade give you a rival every time you open the app.",
  },
];

export default function WhoFor() {
  return (
    <section className="section who" id="who">
      <div className="wrap">
        <header className="sec-head reveal">
          <span className="sec-head__tag">// BUILT FOR</span>
          <h2 className="sec-head__title">
            THREE KINDS OF <span className="grad">MINDS</span>
          </h2>
          <p className="sec-head__lead">
            No betting account, no coaching badge -just a read and the nerve to
            call it. It&apos;s free.
          </p>
        </header>
        <div className="who__grid">
          {CARDS.map((c) => (
            <article className="who__card reveal" data-hud key={c.no}>
              <span className="who__no">{c.no}</span>
              <h3>{c.h}</h3>
              <p>{c.p}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
