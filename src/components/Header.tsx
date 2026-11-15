'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BrandIcon } from '@/components/PagesBrandIcon';
import { PRIMARY_NAV_LINKS } from '@/lib/routes';
import styles from './site-chrome.module.css';
export default function Header({ stadium = false }: { stadium?: boolean }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); button.current?.focus(); } };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open]);
  return <header className={`${styles.header} ${stadium ? styles.overHero : ''}`}>
    <div className={styles.headerInner}>
      <Link href="/#top" className={styles.brand} aria-label="StatOz home"><BrandIcon name="logo" size={30} alt="" priority /><span className={styles.brandName}>Stat<span>Oz</span><small>YOUR HOME GROUND</small></span></Link>
      <nav className={styles.desktopNav} aria-label="Primary">{PRIMARY_NAV_LINKS.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}</nav>
      <Link href="/#play" className={styles.enter}>Step inside <span aria-hidden="true">↗</span></Link>
      <button ref={button} type="button" className={styles.menuButton} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'} <span aria-hidden="true">{open ? '×' : '☰'}</span></button>
    </div>
    <nav className={styles.mobileNav} id="mobile-navigation" aria-label="Mobile primary" hidden={!open}>{PRIMARY_NAV_LINKS.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}<span aria-hidden="true">↗</span></Link>)}<Link href="/#play" onClick={() => setOpen(false)}>Play on web</Link><Link href="/#download" onClick={() => setOpen(false)}>Get the app</Link></nav>
  </header>;
}
