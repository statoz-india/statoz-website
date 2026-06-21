import { FEATURES } from "@/lib/data";

export default function Features() {
  return (
    <section className="section features" id="features">
      <div className="wrap">
        <header className="sec-head reveal">
          <span className="sec-head__tag">// THE TOOLKIT</span>
          <h2 className="sec-head__title">
            EVERYTHING IS A <span className="grad">GAME</span>
          </h2>
        </header>

        <div className="bento">
          {FEATURES.map((c) => (
            <article
              key={c.h}
              className={`bento__cell reveal${c.cls ? " " + c.cls : ""}`}
              data-hud
            >
              <div className="bento__glyph">
                <svg viewBox="0 0 24 24">
                  <path d={c.icon} />
                </svg>
              </div>
              <h3>
                {c.h}
                {c.live && <span className="tag-live">LIVE</span>}
              </h3>
              <p>{c.p}</p>
              {c.meta && (
                <div className="bento__meta">
                  <span>{c.meta[0]}</span>
                  <span>{c.meta[1]}</span>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
