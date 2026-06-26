import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/storeLinks";
import StoreIcon from "./StoreIcon";

const DOWNLOAD_CARDS = [
  {
    id: "messi",
    name: "L. MESSI",
    rating: 93,
    pos: "RW",
    tier: "legend",
    slot: "one",
  },
  {
    id: "ronaldo",
    name: "RONALDO",
    rating: 90,
    pos: "ST",
    tier: "legend",
    slot: "two",
  },
  {
    id: "haaland",
    name: "HAALAND",
    rating: 91,
    pos: "ST",
    tier: "elite",
    slot: "three",
  },
  {
    id: "yamal",
    name: "YAMAL",
    rating: 87,
    pos: "RW",
    tier: "gold",
    slot: "four",
  },
];

const BADGES = ["Free", "No deposits", "Skill-based"];

export default function Download() {
  return (
    <section className="section download" id="download">
      <div className="wrap download__inner reveal">
        <div className="download__copy">
          <h2 className="download__title">
            DOWNLOAD <span className="grad">STATOZ.</span>
          </h2>

          <div className="download__actions">
            <a
              className="btn btn--primary btn--lg"
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener"
              data-analytics-event="download_cta_click"
              data-analytics-cta-label="Google Play"
              data-analytics-cta-location="download_section"
              data-analytics-store="google_play"
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
              data-analytics-event="download_cta_click"
              data-analytics-cta-label="App Store"
              data-analytics-cta-location="download_section"
              data-analytics-store="app_store"
            >
              <StoreIcon store="apple" className="btn__i" />
              <span className="store">
                <small>DOWNLOAD ON</small>App Store
              </span>
            </a>
          </div>

          <div className="download__meta">
            <div className="download__rating">
              <span className="stars" aria-label="4.8 star rating">
                ★★★★<span className="half">★</span>
              </span>
              <span>
                <strong>4.8</strong> rating · 5K+ predictors
              </span>
            </div>
            <ul className="download__badges">
              {BADGES.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="download__art">
          <div className="download__halo" aria-hidden="true" />
          <div className="download__drop" aria-hidden="true">
            🎁 +1,000 OZ COINS
            <small>WELCOME BONUS</small>
          </div>
          <div className="download__orbit" aria-hidden="true">
            {DOWNLOAD_CARDS.map((card) => (
              <article
                className={`fcard fcard--${card.tier} download-card download-card--${card.slot}`}
                key={card.id}
              >
                <div className="fcard__sheen" />
                <div className="fcard__holo" />
                <div className="fcard__top">
                  <div className="fcard__rating">{card.rating}</div>
                  <div className="fcard__pos">{card.pos}</div>
                </div>
                <div className="fcard__img">
                  <img
                    src={`/assets/players/${card.id}.webp`}
                    alt=""
                    loading="lazy"
                  />
                </div>
                <div className="fcard__plate">
                  <div className="fcard__name">{card.name}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
