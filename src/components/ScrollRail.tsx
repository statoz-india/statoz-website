"use client";

import { useEffect, useRef, useState } from "react";

const ITEMS = [
  { id: "home", label: "StatOz" },
  { id: "predict", label: "Predict" },
  { id: "picks", label: "Picks" },
  { id: "leaderboard", label: "Leaderboard" },
  { id: "progression", label: "Streaks" },
  { id: "games", label: "Games" },
  { id: "shop", label: "Shop" },
  { id: "faq", label: "FAQ" },
];

export default function ScrollRail() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const els = ITEMS.map((it) => document.getElementById(it.id));
    const last = ITEMS.length - 1;

    const compute = () => {
      const line = window.scrollY + window.innerHeight * 0.38;
      setVisible(window.scrollY > window.innerHeight * 0.5);
      const tops = els.map((el) =>
        el ? el.getBoundingClientRect().top + window.scrollY : Number.POSITIVE_INFINITY
      );

      let idx = 0;
      for (let i = 0; i < tops.length; i++) if (tops[i] <= line) idx = i;

      const start = tops[idx];
      const end = idx < last ? tops[idx + 1] : document.documentElement.scrollHeight;
      const span = end - start;
      const intra = span > 0 ? Math.min(Math.max((line - start) / span, 0), 1) : 0;

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const atBottom = max - window.scrollY < 4;

      setActive(atBottom ? last : idx);
      setProgress(atBottom ? 1 : Math.min(Math.max((idx + intra) / last, 0), 1));
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(compute);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    compute();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: Math.max(top, 0), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <nav className={`srail${visible ? " srail--visible" : ""}`} aria-label="Section progress">
      <div className="srail__inner">
        <span className="srail__line" aria-hidden="true" />
        <span
          className="srail__fill"
          style={{ height: `${progress * 100}%` }}
          aria-hidden="true"
        />
        <ul className="srail__list">
          {ITEMS.map((it, i) => (
            <li
              key={it.id}
              className={`srail__item${i === active ? " is-active" : ""}${
                i < active ? " is-passed" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => go(it.id)}
                aria-current={i === active ? "true" : undefined}
              >
                <span className="srail__label">{it.label}</span>
                <span className="srail__node" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
