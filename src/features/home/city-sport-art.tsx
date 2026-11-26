import type { SVGProps } from 'react';
import type { CityLocationId } from './city-config';

/** A consistent, original set of destination symbols. */
export function DestinationGlyph({ destination, ...props }: SVGProps<SVGSVGElement> & { destination: CityLocationId }) {
  const drawings = {
    basketball: <><circle cx="12" cy="12" r="9" /><path d="m5.6 5.6 12.8 12.8M5.6 18.4 18.4 5.6M3 12c5-2 11 4 9 9M12 3c-2 5 4 11 9 9" /></>,
    cricket: <><path d="m14 3 4 4-8 10-5-5L14 3ZM6 13l-3 4 3 3 4-4" /><circle cx="18.5" cy="18.5" r="3" /><path d="m17 16 3 5" /></>,
    football: <><circle cx="12" cy="12" r="9" /><path d="m12 7 4.7 3.4-1.8 5.5H9.1l-1.8-5.5L12 7Zm0-4v4m4.7 3.4 3.8-1.2m-5.6 6.7 2.4 3.4m-8.2-3.4-2.4 3.4m.6-8.9L3.5 9.2" /></>,
    racing: <><path d="M5 21V3m0 1c5-4 9 4 15 0v10c-6 4-10-4-15 0" /><path d="M10 3v11m5-9v11M5 9c5-4 9 4 15 0" /></>,
    news: <><rect x="4" y="6" width="16" height="15" rx="1" /><path d="M8 3h8M8 10h4v4H8zm7 0h2m-2 4h2M8 18h9" /></>,
    clubhouse: <><path d="m3 11 9-8 9 8M5 10v11h14V10M9 21v-7h6v7" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1 .7-1.5 1-1.5 2.5M12 17h.01" /></>,
    download: <><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M10 5h4M11 19h2M12 8v7m-3-3 3 3 3-3" /></>,
    'city-hall': <><path d="m3 7 9-5 9 5H3Zm1 14h16M6 10v8m6-8v8m6-8v8M3 18h18" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{drawings[destination]}</svg>;
}
