import { FAQ_ITEMS } from "@/lib/faqData";

export default function Faq() {
  return (
    <section className="section faq" id="faq">
      <div className="wrap">
        <header className="sec-head reveal">
          <span className="sec-head__tag">// BRIEFING</span>
          <h2 className="sec-head__title">
            BEFORE YOU <span className="grad">KICK OFF</span>
          </h2>
        </header>
        <div className="faq__list reveal">
          {FAQ_ITEMS.map((item) => (
            <details className="qa" key={item.q}>
              <summary>
                {item.q}
                <i />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
