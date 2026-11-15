import Link from 'next/link';
import { BrandIcon } from '@/components/PagesBrandIcon';
import s from './site-chrome.module.css';
export default function Footer() {
  return <footer className={s.footer}><div className={s.footerMain}>
    <div><Link className={s.brand} href="/#top" aria-label="StatOz home"><BrandIcon name="logo" size={30} alt="" /><span className={s.brandName}>Stat<span>Oz</span></span></Link><p>For the love of sport.<br />For the fan in you.</p></div>
    <nav aria-label="Explore"><h2>EXPLORE</h2><Link href="/#sports">StatOz Sports</Link><Link href="/#games">StatOz Games</Link><Link href="/#download">Get the app</Link></nav>
    <nav aria-label="Company"><h2>STATOZ</h2><Link href="/about">About us</Link><Link href="/blog">From the stands</Link><Link href="/faq">FAQ</Link><a href="mailto:support@statoz.in">Contact</a></nav>
    <nav aria-label="Legal"><h2>THE DETAILS</h2><Link href="/termsAndConditions">Terms & conditions</Link><Link href="/privacyPolicy">Privacy policy</Link><a href="https://www.instagram.com/statozindia/">Instagram ↗</a></nav>
  </div><div className={s.footerBase}><span>© {new Date().getFullYear()} StatOz</span><span>EVERY FAN HAS A HOME GROUND.</span><a href="/#top">Back to the top ↑</a></div></footer>;
}
