"use client";

import { useEffect } from "react";

export default function Effects() {
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
    const finePointer = matchMedia("(pointer:fine)").matches;
    const cleanups: Array<() => void> = [];

    /* ---------- cursor glow ---------- */
    const glow = document.querySelector<HTMLElement>(".cursor-glow");
    if (glow && finePointer) {
      let gx = innerWidth / 2,
        gy = innerHeight / 2,
        cx = gx,
        cy = gy,
        raf = 0;
      const onMove = (e: PointerEvent) => {
        gx = e.clientX;
        gy = e.clientY;
      };
      addEventListener("pointermove", onMove, { passive: true });
      const loop = () => {
        cx += (gx - cx) * 0.14;
        cy += (gy - cy) * 0.14;
        glow.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      cleanups.push(() => {
        removeEventListener("pointermove", onMove);
        cancelAnimationFrame(raf);
      });
    }

    /* ---------- reveal on scroll ---------- */
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    document
      .querySelectorAll(".steps .reveal, .bento .reveal, .squad__grid .reveal")
      .forEach((el, i) => el.classList.add("d" + ((i % 4) + 1)));
    cleanups.push(() => io.disconnect());

    /* ---------- count-up ---------- */
    const countObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target as HTMLElement;
          const end = +(el.dataset.count || 0);
          const pre = el.dataset.prefix || "";
          const suf = el.dataset.suffix || "";
          countObs.unobserve(el);
          if (reduce) {
            el.textContent = pre + end + suf;
            return;
          }
          const dur = 1400,
            t0 = performance.now();
          const tick = (t: number) => {
            const p = Math.min((t - t0) / dur, 1),
              e = 1 - Math.pow(1 - p, 3);
            el.textContent = pre + Math.round(end * e).toLocaleString("en-IN") + suf;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.6 }
    );
    document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => countObs.observe(el));
    cleanups.push(() => countObs.disconnect());

    /* ---------- card tilt (squad only) ---------- */
    if (!reduce) {
      document.querySelectorAll<HTMLElement>("#squadGrid .fcard[data-tilt]").forEach((card) => {
        let raf = 0;
        const move = (e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => {
            card.style.transform = `perspective(760px) rotateX(${(-py * 9).toFixed(2)}deg) rotateY(${(
              px * 11
            ).toFixed(2)}deg) translateY(-8px)`;
            card.style.setProperty("--sheen", (px * 120).toFixed(0));
          });
        };
        const leave = () => {
          card.style.transform = "";
          card.style.setProperty("--sheen", "-60");
        };
        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerleave", leave);
          cancelAnimationFrame(raf);
        });
      });
    }

    /* ---------- hero parallax ---------- */
    const scene = document.querySelector<HTMLElement>("[data-tilt-scene]");
    const hero = document.querySelector<HTMLElement>(".hero");
    if (scene && hero && !reduce && finePointer) {
      let raf = 0;
      const move = (e: PointerEvent) => {
        const r = hero.getBoundingClientRect();
        const mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        const my = ((e.clientY - r.top) / r.height - 0.5) * 2;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          scene.style.setProperty("--mx", mx.toFixed(3));
          scene.style.setProperty("--my", my.toFixed(3));
        });
      };
      const leave = () => {
        scene.style.setProperty("--mx", "0");
        scene.style.setProperty("--my", "0");
      };
      hero.addEventListener("pointermove", move);
      hero.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        hero.removeEventListener("pointermove", move);
        hero.removeEventListener("pointerleave", leave);
        cancelAnimationFrame(raf);
      });
    }

    /* ---------- sticky header shadow ---------- */
    const head = document.querySelector<HTMLElement>(".site-head");
    const onScroll = () => {
      if (head) head.style.boxShadow = scrollY > 12 ? "0 14px 40px -22px rgba(0,0,0,.9)" : "none";
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    cleanups.push(() => removeEventListener("scroll", onScroll));

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
