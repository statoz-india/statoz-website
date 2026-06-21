import PixelBlast from "./PixelBlast";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/storeLinks";
import StoreIcon from "./StoreIcon";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <PixelBlast
        className="hero__blast"
        style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.16 }}
        variant="circle"
        pixelSize={6}
        color="#5cdfff"
        patternScale={3}
        patternDensity={1.1}
        pixelSizeJitter={0.4}
        enableRipples
        rippleSpeed={0.4}
        rippleThickness={0.12}
        rippleIntensityScale={1.4}
        speed={0.5}
        edgeFade={0.3}
        transparent
      />
      <div className="hero__glow hero__glow--cyan" aria-hidden="true" />
      <div className="hero__glow hero__glow--mag" aria-hidden="true" />
      <span className="hero__ghost" aria-hidden="true">
        STATOZ
      </span>

      <div className="wrap hero__inner">
        <div className="hero__copy reveal">
          <span className="kicker">
            <i className="live-dot" />
            FREE TO PLAY · NO CASH · JUST SKILL
          </span>
          <h1 className="hero__title">
            PREDICT EVERY MATCH.
            <br />
            <span className="grad">PROVE YOUR READ.</span>
          </h1>
          <p className="hero__sub">
            The free <strong>sports prediction game</strong>. Predict a{" "}
            <strong>Match</strong>, back your <strong>Picks</strong> with Oz
            Coins, and climb the board. <strong>100% free.</strong>
          </p>

          <div className="hero__actions">
            <a
              className="btn btn--primary btn--lg"
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener"
            >
              <StoreIcon store="playstore" className="btn__i" />
              <span className="store">
                <small>GET IT ON</small>Google Play
              </span>
            </a>
            <a
              className="btn btn--ghost btn--lg btn--store"
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener"
            >
              <StoreIcon store="apple" className="btn__i" />
              <span className="store">
                <small>DOWNLOAD ON</small>App Store
              </span>
            </a>
          </div>

          <div className="hero__trust">
            <div className="stars" aria-label="4.8 star rating">
              ★★★★<span className="half">★</span>
            </div>
            <span>
              <strong>4.8</strong> rating
            </span>
            <span className="dot">·</span>
            <span>
              <strong>5K+</strong> predictors playing
            </span>
          </div>
        </div>

        {/* HERO CARD FAN */}
        <div className="hero__stage reveal" data-tilt-scene>
          <div className="hero-card__ground" aria-hidden="true" />
          <div className="toast toast--xp" aria-hidden="true">
            ✓ +250 XP <small>BEAT 64% OF PREDICTORS</small>
          </div>
          <div className="toast toast--odds" aria-hidden="true">
            <i>🔥</i> STREAK 12
          </div>

          <article
            className="fcard fcard--legend hero-card hero-card--l"
            data-tilt
            aria-hidden="true"
          >
            <div className="fcard__sheen" />
            <div className="fcard__top">
              <div className="fcard__rating">90</div>
              <div className="fcard__pos">ST</div>
            </div>
            <div className="fcard__img">
              <img src="/assets/players/ronaldo.webp" alt="" loading="lazy" />
            </div>
            <div className="fcard__plate">
              <div className="fcard__name">RONALDO</div>
            </div>
          </article>

          <article
            className="fcard fcard--legend hero-card hero-card--front"
            data-tilt
          >
            <div className="fcard__sheen" />
            <div className="fcard__holo" />
            <div className="fcard__corner fcard__corner--tl" />
            <div className="fcard__corner fcard__corner--br" />
            <div className="fcard__top">
              <div className="fcard__rating">93</div>
              <div className="fcard__pos">RW</div>
            </div>
            <div className="fcard__img">
              <img
                src="/assets/players/messi.webp"
                alt="Lionel Messi player card"
              />
            </div>
            <div className="fcard__plate">
              <div className="fcard__name">L. MESSI</div>
            </div>
          </article>

          <article
            className="fcard fcard--elite hero-card hero-card--r"
            data-tilt
            aria-hidden="true"
          >
            <div className="fcard__sheen" />
            <div className="fcard__top">
              <div className="fcard__rating">91</div>
              <div className="fcard__pos">ST</div>
            </div>
            <div className="fcard__img">
              <img src="/assets/players/haaland.webp" alt="" loading="lazy" />
            </div>
            <div className="fcard__plate">
              <div className="fcard__name">HAALAND</div>
            </div>
          </article>

          <div className="vsbadge" aria-hidden="true">
            OZ
          </div>
        </div>
      </div>
    </section>
  );
}
