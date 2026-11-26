import { CITY_LINKS } from './city-config';
import { CityIcon } from './city-icons';
import j from './city-journey.module.css';

/** Product launch controls in the city's transparent header. */
export function CityProductLink({ product }: { product: 'sports' | 'games' }) {
  return <a className={j.productLink} data-magnetic data-product={product} href={CITY_LINKS[product]} data-analytics-event="web_launch" data-analytics-product={product} data-analytics-cta-location="city_header">
    <span className={j.productSurface} aria-hidden="true" />
    <span className={j.productGlyph} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {product === 'sports' ? <><path d="M8 4h8v5a4 4 0 0 1-8 0V4ZM8 6H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4M12 13v4m-4 3h8m-6-3h4v3h-4z" /></> : <><path d="M8 7h8c2 0 3 1.4 3.5 3.5l1.1 5.1a2.4 2.4 0 0 1-4.1 2.1L14.7 16H9.3l-1.8 1.7a2.4 2.4 0 0 1-4.1-2.1l1.1-5.1C5 8.4 6 7 8 7Z" /><path d="M8 10v4m-2-2h4m5-1h.01M18 13h.01" strokeWidth="1.8" /></>}
      </svg>
    </span>
    <span className={j.productLabel}>{product === 'sports' ? 'Sports' : 'Games'}</span>
    <span className={j.productArrow} aria-hidden="true"><CityIcon name="arrow" /></span>
  </a>;
}
