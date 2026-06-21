import Link from "next/link";
import { FOOTER_NAV_LINKS, ROUTES } from "@/lib/routes";
import { PLAY_STORE_URL } from "@/lib/storeLinks";
import BrandMark from "./BrandMark";
import StoreIcon from "./StoreIcon";

const SOCIALS = [
  {
    label: "Play Store",
    href: PLAY_STORE_URL,
    store: "playstore" as const,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/statozindia/",
    d: "M12 7.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5Zm0 7.4A2.9 2.9 0 1 1 14.9 12 2.9 2.9 0 0 1 12 14.9Zm4.7-7.6a1.05 1.05 0 1 1-1-1.05 1.05 1.05 0 0 1 1 1.05ZM20 7.3a5.2 5.2 0 0 0-1.4-3.7A5.3 5.3 0 0 0 14.9 2.2C13.4 2.1 8.6 2.1 7.1 2.2A5.3 5.3 0 0 0 3.4 3.6 5.2 5.2 0 0 0 2 7.3c-.1 1.5-.1 6.2 0 7.7a5.2 5.2 0 0 0 1.4 3.7 5.3 5.3 0 0 0 3.7 1.4c1.5.1 6.3.1 7.8 0a5.3 5.3 0 0 0 3.7-1.4 5.2 5.2 0 0 0 1.4-3.7c.1-1.5.1-6.2 0-7.7Zm-1.9 9.3a2.9 2.9 0 0 1-1.6 1.6c-1.1.5-3.8.4-5 .4s-3.9.1-5-.4a2.9 2.9 0 0 1-1.6-1.6c-.5-1.1-.4-3.8-.4-5s-.1-3.9.4-5a2.9 2.9 0 0 1 1.6-1.6c1.1-.5 3.8-.4 5-.4s3.9-.1 5 .4a2.9 2.9 0 0 1 1.6 1.6c.5 1.1.4 3.8.4 5s.1 3.9-.4 5Z",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@StatozIndia",
    d: "M23 7.5a3 3 0 0 0-2.1-2.1C19 4.9 12 4.9 12 4.9s-7 0-8.9.5A3 3 0 0 0 1 7.5 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5A3 3 0 0 0 23 16.5 31 31 0 0 0 23.5 12 31 31 0 0 0 23 7.5ZM9.8 15.3V8.7l5.7 3.3Z",
  },
  {
    label: "Reddit",
    href: "https://www.reddit.com/r/f2p__predictionmarket/",
    d: "M14.2 15.3a.9.9 0 1 1-1.8 0 .9.9 0 0 1 1.8 0Zm-2.6 3.1c-1.9 0-3.2-.9-3.3-2.1a.6.6 0 0 1 1.1-.3c.3.6 1.1 1.1 2.2 1.1s1.9-.4 2.2-1.1a.6.6 0 1 1 1.1.3c-.1 1.2-1.4 2.1-3.3 2.1Zm-2.8-2.2a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8Zm11.2-4.2a1.9 1.9 0 0 0-3.1-1.5 6.8 6.8 0 0 0-4.7-1.8l1-3 2.5.6a1.5 1.5 0 1 0 .3-1.2l-3.1-.7a.6.6 0 0 0-.7.4l-1.2 3.7a6.8 6.8 0 0 0-4.8 1.8A1.9 1.9 0 1 0 5 13.7c0 .2 0 .4.1.6 0 2.8 3 5.1 6.9 5.1s6.9-2.3 6.9-5.1v-.6c.7-.3 1.1-1 1.1-1.7Z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/statoz/",
    d: "M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0 0-5ZM3 9h4v12H3Zm6 0h3.8v1.7h.05A4.2 4.2 0 0 1 16.5 8.8c4 0 4.7 2.6 4.7 6V21h-4v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9Z",
  },
];

const COLS = [
  {
    h: "Explore",
    links: FOOTER_NAV_LINKS,
  },
  {
    h: "Company",
    links: [
      { t: "About StatOz", href: "#" },
      { t: "Blog", href: ROUTES.blog },
      { t: "Careers", href: "#" },
      { t: "Contact", href: "#" },
    ],
  },
  {
    h: "Legal",
    links: [
      { t: "Terms & Conditions", href: ROUTES.terms },
      { t: "Privacy Policy", href: ROUTES.privacy },
      { t: "Responsible Play", href: "#" },
      { t: "18+ Only", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-foot">
      <div className="wrap site-foot__inner">
        <div className="site-foot__brand">
          <BrandMark />
          <p>
            The free-to-play football prediction arena. Answer the quiz, back
            your picks, climb the board. No cash, no catch.
          </p>
          <div className="socials">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener" aria-label={s.label}>
                {"store" in s && s.store ? (
                  <StoreIcon store={s.store} />
                ) : (
                  <svg viewBox="0 0 24 24">
                    <path d={s.d} />
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>

        {COLS.map((col) => (
          <nav className="foot-col" key={col.h}>
            <h4>{col.h}</h4>
            {col.links.map((l) => (
              <Link key={l.t} href={l.href}>
                {l.t}
              </Link>
            ))}
          </nav>
        ))}
      </div>
      <div className="wrap site-foot__base">
        <span>© 2026 StatOz. Skill-based prediction gaming. Play responsibly · 18+.</span>
        <span className="site-foot__made">Made for fans who read the game.</span>
      </div>
    </footer>
  );
}
