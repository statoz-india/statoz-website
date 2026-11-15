'use client';
import { useEffect } from 'react';
import { legacyAnchors } from './content';

export function LegacyAnchorNavigation() {
  useEffect(() => {
    const follow = () => {
      const old = location.hash.slice(1) as keyof typeof legacyAnchors;
      const target = legacyAnchors[old];
      if (target) document.getElementById(target)?.scrollIntoView({ behavior: 'instant' });
    };
    follow();
    window.addEventListener('hashchange', follow);
    return () => window.removeEventListener('hashchange', follow);
  }, []);
  return null;
}
