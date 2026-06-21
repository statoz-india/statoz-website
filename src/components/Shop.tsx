import { SHOP_GROUPS, SHOP_BANNERS } from "@/lib/data";

export default function Shop() {
  return (
    <section className="section shop" id="shop">
      <div className="wrap">
        <header className="sec-head sec-head--row reveal">
          <div>
            <span className="sec-head__tag">// SHOP · COMING SOON</span>
            <h2 className="sec-head__title">
              SPEND YOUR <span className="grad-gold">OZ COINS</span>
            </h2>
          </div>
          <p className="sec-head__lead sec-head__lead--right">
            Card packs, avatars and banners -all cosmetic, earned with the Oz
            Coins you win. <strong>No pay-to-win, ever.</strong>
          </p>
        </header>

        {SHOP_GROUPS.map((group) => (
          <div className="shop__group" key={group.h}>
            <div className="shop__grouphead reveal">
              <span className="sec-head__tag">{group.tag}</span>
              <h3>{group.h}</h3>
            </div>
            <div className="shop__row">
              {group.items.map((it) => (
                <article className="shopitem reveal" data-hud key={it.name}>
                  <span className="soon-badge soon-badge--sm">SOON</span>
                  <div
                    className={`shopitem__img${
                      group.h === "Avatars" ? " shopitem__img--av" : ""
                    }`}
                  >
                    <img src={it.img} alt={it.name} loading="lazy" />
                  </div>
                  <div className="shopitem__name">{it.name}</div>
                  <div className="shopitem__sub">{it.sub}</div>
                </article>
              ))}
            </div>
          </div>
        ))}

        <div className="shop__group">
          <div className="shop__grouphead reveal">
            <span className="sec-head__tag">// BANNERS</span>
            <h3>Profile Banners</h3>
          </div>
          <div className="shop__banners">
            {SHOP_BANNERS.map((b, i) => (
              <article className="shopbanner reveal" data-hud key={b}>
                <span className="soon-badge soon-badge--sm">SOON</span>
                <img src={b} alt={`Profile banner ${i + 1}`} loading="lazy" />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
