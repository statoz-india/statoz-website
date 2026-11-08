import { faqJsonLd } from "@/lib/structuredData";
import JsonLd from "./JsonLd";

export type FaqItem = { q: string; a: string };

/* FAQ accordion (same look as the homepage FAQ) plus its FAQPage schema.
   `location` feeds the faq_open analytics event. */
export default function FaqList({
  items,
  heading = "Common questions",
  location,
}: {
  items: readonly FaqItem[];
  heading?: string;
  location: string;
}) {
  if (items.length === 0) return null;

  return (
    <>
      <JsonLd data={faqJsonLd(items)} />
      <h2>{heading}</h2>
      <div className="faq__list">
        {items.map((item) => (
          <details className="qa" key={item.q} data-faq-location={location}>
            <summary>
              {item.q}
              <i />
            </summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </>
  );
}
