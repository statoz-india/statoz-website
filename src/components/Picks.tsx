import { PICK_MARKETS, PICK_FILTERS, PICK_TYPES, PICK_STEPS } from "@/lib/data";

export default function Picks() {
  return (
    <section className="section picks" id="picks">
      <div className="wrap">
        <header className="sec-head sec-head--row reveal">
          <div>
            <span className="sec-head__tag">// PICKS · LIVE</span>
            <h2 className="sec-head__title">
              BACK YOUR <span className="grad">READ.</span>
            </h2>
          </div>
          <p className="sec-head__lead sec-head__lead--left">
            Market-style picks across matches, events and futures. Read the
            line, stake your <strong>Oz Coins</strong>, lock it in.
          </p>
        </header>

        <div className="picks__filters reveal">
          <div className="picks__row" role="tablist" aria-label="Sport">
            {PICK_FILTERS.map((f, i) => (
              <span key={f} className={`pill${i === 0 ? " is-active" : ""}`}>
                {f}
              </span>
            ))}
          </div>
          <div
            className="picks__row picks__row--types"
            role="tablist"
            aria-label="Market type"
          >
            {PICK_TYPES.map((t, i) => (
              <span
                key={t}
                className={`pill pill--sm${i === 0 ? " is-active" : ""}`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="picks__grid">
          {PICK_MARKETS.map((m, mi) => (
            <article className="pick reveal" data-hud key={m.q}>
              <div className="pick__top">
                <span className="pick__league">
                  {m.league} · {m.type}
                </span>
                <span className="pick__close">{m.close}</span>
              </div>
              <h3 className="pick__q">{m.q}</h3>
              <div
                className={`pick__outs${m.outs.length > 3 ? " pick__outs--col" : ""}`}
              >
                {m.outs.map((o, oi) => (
                  <button
                    type="button"
                    key={o.label}
                    className={`pout${mi === 0 && oi === 0 ? " pout--sel" : ""}`}
                  >
                    <span className="pout__label">{o.label}</span>
                    <span className="pout__price">{o.price}</span>
                  </button>
                ))}
              </div>
              <div className="pick__foot">
                <span className="pick__vol">
                  <img
                    className="oz-i"
                    src="/assets/icons/oz_coins.svg"
                    alt=""
                    width={14}
                    height={14}
                  />
                  {m.vol} volume
                </span>
                <span className="pick__cta">Tap a price to back →</span>
              </div>
            </article>
          ))}
        </div>

        <ol className="steps picks__steps">
          {PICK_STEPS.map((s) => (
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
