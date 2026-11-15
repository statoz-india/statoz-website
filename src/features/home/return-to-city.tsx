'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CityIcon } from './city-icons';
import s from './city.module.css';

export default function ReturnToCity() {
  const pathname = usePathname();
  const destination = pathname.startsWith('/blog') ? 'news' : pathname.startsWith('/about') ? 'clubhouse' : pathname.startsWith('/faq') ? 'help' : pathname.startsWith('/download') ? 'download' : pathname.includes('Policy') || pathname.includes('Conditions') ? 'city-hall' : 'basketball';
  return <Link href={'/#city/' + destination} className={s.returnLink}><CityIcon name="compass" />Return to City</Link>;
}
