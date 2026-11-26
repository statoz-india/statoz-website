export function CityIcon({ name, ...props }: React.SVGProps<SVGSVGElement> & { name: 'settings' | 'arrow' | 'external' | 'check' | 'map' | 'close' | 'compass' | 'reset' | 'chevron' | 'mouse' | 'sun' | 'menu' | 'plus' | 'minus' | 'pause' | 'play' }) {
  const paths: Record<string, React.ReactNode> = {
    settings: <><path d="m9.6 3-.5 2-1.7 1-2-.6-2.4 4.2 1.5 1.4v2L3 14.4l2.4 4.2 2-.6 1.7 1 .5 2h4.8l.5-2 1.7-1 2 .6 2.4-4.2-1.5-1.4v-2L21 9.6l-2.4-4.2-2 .6-1.7-1-.5-2Z" /><circle cx="12" cy="12" r="3" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    external: <path d="M7 17 17 7M9 7h8v8" />,
    check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" /><path d="M9 3v15m6-12v15" /></>,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    compass: <><circle cx="12" cy="12" r="9" /><path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z" /></>,
    reset: <><path d="M3 10a9 9 0 1 1 2 8M3 4v6h6" /></>,
    chevron: <path d="m9 5 7 7-7 7" />,
    mouse: <><rect x="6" y="2" width="12" height="20" rx="6" /><path d="M12 6v4" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    pause: <path d="M8 5v14M16 5v14" />,
    play: <path d="m8 5 11 7-11 7V5Z" />,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
