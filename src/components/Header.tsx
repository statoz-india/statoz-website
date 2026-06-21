"use client";

import { useState } from "react";
import Link from "next/link";
import { PRIMARY_NAV_LINKS, ROUTES } from "@/lib/routes";
import BrandMark from "./BrandMark";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-head" id="top">
      <div className="wrap site-head__inner">
        <BrandMark image />

        <nav className="nav" aria-label="Primary">
          {PRIMARY_NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="head-cta">
          <Link className="btn btn--ghost btn--sm" href={ROUTES.predict}>
            How It Works
          </Link>
          <a
            className="btn btn--primary btn--sm"
            href="https://download.statoz.in"
          >
            Get the App
          </a>
        </div>

        <button
          className="burger"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className="mobile-nav" hidden={!open}>
        {PRIMARY_NAV_LINKS.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <a
          className="btn btn--primary"
          href="https://download.statoz.in"
          onClick={() => setOpen(false)}
        >
          Get the App
        </a>
      </div>
    </header>
  );
}
