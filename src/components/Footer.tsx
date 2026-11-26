import { publicAsset } from '@statoz/design-system/asset';
import Link from 'next/link';
import { BrandIcon } from '@statoz/design-system/web/icons/brand';
import { ROUTES } from '@/lib/routes';
import { SOCIAL_PROFILES } from '@/lib/structuredData';
import s from './site-chrome.module.css';

/* Same profile list as the Organization schema's sameAs, so AI models can
   match the footer, schema and llms files to one company. */
const SOCIAL_LABELS: Record<string, string> = { instagram: 'Instagram', youtube: 'YouTube', reddit: 'Reddit', linkedin: 'LinkedIn' };
const SOCIALS = SOCIAL_PROFILES.map(href => {
  const network = Object.keys(SOCIAL_LABELS).find(key => href.includes(key)) ?? href;
  return { href, network, label: SOCIAL_LABELS[network] ?? href };
});

export default function Footer() {
  return <footer className={s.footer}><div className={s.footerMain}>
    <div><Link className={s.brand} href="/#top" aria-label="StatOz home"><BrandIcon name="logo" size={30} alt="" /><span className={s.brandName}>Stat<span>Oz</span></span></Link><p>For the love of sport.<br />For the fan in you.</p></div>
    <nav aria-label="Explore"><h2>EXPLORE</h2><Link href="/#sports">StatOz Sports</Link><Link href="/#games">StatOz Games</Link><Link href={ROUTES.eplPredictions}>EPL predictions</Link><Link href={ROUTES.iplPredictions}>IPL predictions</Link><Link href="/#download">Get the app</Link></nav>
    <nav aria-label="Company"><h2>STATOZ</h2><Link href="/about">About us</Link><Link href="/blog">From the stands</Link><Link href="/faq">FAQ</Link><a href="mailto:support@statoz.in">Contact</a></nav>
    <nav aria-label="Legal and social"><h2>THE DETAILS</h2><Link href="/termsAndConditions">Terms & conditions</Link><Link href="/privacyPolicy">Privacy policy</Link>{SOCIALS.map(social => <a key={social.href} href={social.href} target="_blank" rel="noopener noreferrer" data-analytics-event="social_click" data-analytics-network={social.network} data-analytics-location="footer">{social.label} ↗</a>)}</nav>
  </div><div className={s.footerBase}><span>© {new Date().getFullYear()} StatOz</span><span>EVERY FAN HAS A HOME GROUND.</span><a href={publicAsset('/#top')}>Back to the top ↑</a></div></footer>;
}
