import { QUIZ_STEPS } from "@/lib/data";

const OPTS = [
  { label: "L. MESSI", vote: 64, sel: true },
  { label: "J. ÁLVAREZ", vote: 21, sel: false },
  { label: "OWN GOAL / NONE", vote: 15, sel: false },
];

const RULES = [
  {
    h: "XP only, never coins",
    p: "Predictions pay out in XP only. Coins are never staked on a quiz.",
  },
  {
    h: "Wrong calls cost nothing",
    p: "A miss scores zero. Your XP never goes backwards.",
  },
  {
    h: "Settlement is the payoff",
    p: "At full-time a cinematic flips every answer and counts up your XP.",
  },
];

export default function Predict() {
  return (
    <section className="section predict" id="predict">
      <div className="wrap">
        <header className="sec-head sec-head--row reveal">
          <div>
            <span className="sec-head__tag">// PREDICTION QUIZ · LIVE</span>
            <h2 className="sec-head__title">
              EVERY MATCH IS A <span className="grad">QUIZ.</span>
            </h2>
          </div>
          <p className="sec-head__lead sec-head__lead--left">
            Open any fixture and answer an animated quiz before kickoff —
            scores, goalscorers, bookings and set pieces, one question at a time.
          </p>
        </header>

        <div className="predict__grid">
          {/* mock quiz panel */}
          <aside
            className="quizcard reveal"
            data-hud
            aria-label="Example prediction quiz"
          >
            <div className="quizcard__top">
              <span className="quizcard__fix">GROUP J · ARG vs AUT</span>
              <span className="quizcard__xp">
                POTENTIAL XP{" "}
                <b data-count={420} data-prefix="+">
                  +0
                </b>
              </span>
            </div>
            <div className="quizcard__qmeta">
              QUESTION 2 / 4 · LOCKS AT KICKOFF
            </div>
            <h3 className="quizcard__q">First goalscorer?</h3>
            <ul className="quizcard__opts">
              {OPTS.map((o) => (
                <li
                  key={o.label}
                  className={`qopt${o.sel ? " qopt--sel" : ""}`}
                >
                  <span className="qopt__bar" style={{ width: `${o.vote}%` }} />
                  <span className="qopt__label">{o.label}</span>
                  <span className="qopt__vote">{o.vote}%</span>
                </li>
              ))}
            </ul>
            <div className="quizcard__foot">
              <span className="quizcard__crowd">12,480 predicted</span>
            </div>
          </aside>

          {/* honest rules */}
          <ul className="predict__rules">
            {RULES.map((r) => (
              <li key={r.h} className="predict__rule reveal" data-hud>
                <h3>{r.h}</h3>
                <p>{r.p}</p>
              </li>
            ))}
          </ul>
        </div>

        <ol className="steps predict__steps">
          {QUIZ_STEPS.map((s) => (
            <li key={s.no} className="step-card reveal" data-hud>
              <div className="step-card__no">{s.no}</div>
              <div className="step-card__icon">
                <svg viewBox="0 0 24 24">
                  <path d={s.icon} />
                </svg>
              </div>
              <h3>{s.h}</h3>
              <p>{s.p}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
