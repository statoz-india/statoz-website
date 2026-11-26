'use client';

import { useEffect, useRef } from 'react';
import c from './city-cursor.module.css';

const INTERACTIVE = 'a, button, [role="button"], summary, label, input, select, textarea';
const MAGNETIC = '[data-magnetic]';

/**
 * A soft ring that trails the pointer and opens over anything interactive, and buttons that lean
 * a little toward it. Mouse and pen only: touch screens and reduced motion keep the native cursor.
 */
export default function CityCursor() {
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)'), reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduced.matches || !ring.current) return;
    const element = ring.current, root = document.documentElement;
    let x = -100, y = -100, rx = -100, ry = -100, frame = 0, magnet: HTMLElement | null = null;
    root.dataset.cityCursor = 'on';
    const tick = () => {
      rx += (x - rx) * .22; ry += (y - ry) * .22;
      element.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0)`;
      frame = Math.abs(x - rx) + Math.abs(y - ry) > .2 ? requestAnimationFrame(tick) : 0;
    };
    const release = () => { if (magnet) { magnet.style.translate = ''; magnet = null; } };
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      x = event.clientX; y = event.clientY; element.dataset.visible = 'true';
      const target = event.target instanceof Element ? event.target : null;
      element.dataset.active = target?.closest(INTERACTIVE) ? 'true' : 'false';
      const pull = target?.closest<HTMLElement>(MAGNETIC) ?? null;
      if (pull !== magnet) release();
      if (pull) {
        magnet = pull;
        const box = pull.getBoundingClientRect(), dx = x - (box.left + box.width / 2), dy = y - (box.top + box.height / 2);
        pull.style.translate = `${(dx * .14).toFixed(1)}px ${(dy * .2).toFixed(1)}px`;
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const leave = () => { element.dataset.visible = 'false'; release(); };
    const press = () => { element.dataset.pressed = 'true'; };
    const lift = () => { element.dataset.pressed = 'false'; };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave); window.addEventListener('blur', leave);
    window.addEventListener('pointerdown', press, { passive: true }); window.addEventListener('pointerup', lift, { passive: true });
    return () => {
      cancelAnimationFrame(frame); release(); delete root.dataset.cityCursor;
      window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave); window.removeEventListener('blur', leave);
      window.removeEventListener('pointerdown', press); window.removeEventListener('pointerup', lift);
    };
  }, []);
  return <div ref={ring} className={c.ring} aria-hidden="true" data-visible="false" />;
}
