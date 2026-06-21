export default function Progression() {
  return (
    <section className="section progression" id="progression">
      <div className="coming-soon-banner reveal">
        <span className="coming-soon-banner__label">COMING SOON</span>
        <span className="coming-soon-banner__text">
          Streaks & XP Progression is coming soon. Here&apos;s a preview.
        </span>
      </div>

      <div className="wrap progression__grid">
        <div className="progression__copy reveal">
          <span className="sec-head__tag">// STREAKS · COMING SOON</span>
          <h2 className="sec-head__title">
            STREAKS ARE
            <br />
            <span className="grad-gold">COMING SOON.</span>
          </h2>
          <p className="sec-head__lead">
            Accuracy Streaks are coming next. Correct calls will stack into
            tiers that multiply XP. A miss resets the streak; missing a day
            won&apos;t.
          </p>
        </div>

        <aside
          className="profile reveal profile--preview"
          data-hud
          aria-label="Example player profile"
        >
          <header className="profile__head">
            <span className="profile__user">
              <img
                src="/assets/avatars/rodri.webp"
                alt=""
                width={26}
                height={26}
              />
              @neon_striker
            </span>
            <span className="profile__lvl">PREVIEW</span>
          </header>

          <div className="profile__xp">
            <div className="profile__xprow">
              <span>LEVEL 12</span>
              <span>
                <b data-count={580}>0</b> / 1,200 XP
              </span>
            </div>
            <i className="xpbar">
              <span style={{ width: "48%" }} />
            </i>
            <span className="profile__next">620 XP to Level 13</span>
          </div>

          <div className="profile__streak">
            <img
              className="flame"
              src="/assets/icons/streak.svg"
              alt=""
              width={40}
              height={40}
            />
            <div className="profile__streaktxt">
              <b>12</b>
              <span>Accuracy streak preview</span>
            </div>
            <span className="profile__mult">1.5x</span>
          </div>

          <div className="profile__wallet">
            <span className="profile__wlabel">
              <img
                src="/assets/icons/oz_coins.svg"
                alt=""
                width={18}
                height={18}
              />
              OZ COINS
            </span>
            <b data-count={12480}>0</b>
          </div>

          <div className="profile__stats">
            <div>
              <b data-count={64} data-suffix="%">
                0
              </b>
              <span>Accuracy</span>
            </div>
            <div>
              <b>Best 23</b>
              <span>Best streak</span>
            </div>
            <div>
              <b data-count={1240}>0</b>
              <span>Calls graded</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
