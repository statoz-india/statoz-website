import JsonLd from "@/components/JsonLd";
import { faqJsonLd } from "@/lib/structuredData";

export type FaqItem = { q: string; a: string };

/* The FAQ at the end of a blog post or league page, with its FAQPage schema.
   `location` feeds the data-faq-location analytics attribute, matching the
   /faq page's markup. */
export default function FaqList({
  items,
  location,
}: {
  items: readonly FaqItem[];
  location: string;
}) {
  if (items.length === 0) return null;

  return (
    <>
      <JsonLd data={faqJsonLd(items)} />
      <h2>Frequently asked questions</h2>
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
