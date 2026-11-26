/**
 * Inertial page scrolling for the opening.
 *
 * Mouse wheels and trackpads move the document in steps; this eases the real document scroll
 * toward a target instead, so the camera and copy glide. Touch, keyboard, scrollbar, anchors and
 * assistive scrolling keep their native behaviour: the scroller simply resynchronises with them.
 * Reduced motion never installs it.
 */
export type SmoothScroll = {
  scrollTo: (top: number, options?: { immediate?: boolean }) => void;
  stop: () => void;
  start: () => void;
  dispose: () => void;
};

const NATIVE_SCROLL = 'dialog, [data-panel-scroll], [data-native-scroll], textarea, select';

function scrollableAncestor(element: Element | null, delta: number) {
  for (let node = element; node && node !== document.body; node = node.parentElement) {
    if (node.matches(NATIVE_SCROLL)) return true;
    const style = getComputedStyle(node);
    if (!/(auto|scroll)/.test(style.overflowY) || node.scrollHeight <= node.clientHeight + 1) continue;
    if (delta < 0 ? node.scrollTop > 0 : node.scrollTop + node.clientHeight < node.scrollHeight - 1) return true;
  }
  return false;
}

export function createSmoothScroll(): SmoothScroll | null {
  if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  let target = window.scrollY, current = window.scrollY, frame = 0, last = 0, stopped = false, writing = false;
  const limit = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const write = (top: number) => { writing = true; window.scrollTo({ top, behavior: 'instant' }); writing = false; };

  function tick(now: number) {
    const dt = Math.min(.05, Math.max(.001, (now - (last || now)) / 1000)); last = now;
    current += (target - current) * (1 - Math.exp(-dt * 9));
    if (Math.abs(target - current) < .5) current = target;
    write(current);
    frame = current === target ? 0 : requestAnimationFrame(tick);
    if (!frame) last = 0;
  }
  function run() { if (!frame) frame = requestAnimationFrame(tick); }

  const wheel = (event: WheelEvent) => {
    if (stopped || event.ctrlKey || event.defaultPrevented) return;
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
    const delta = event.deltaY * unit;
    if (!delta || scrollableAncestor(event.target instanceof Element ? event.target : null, delta)) return;
    event.preventDefault();
    if (!frame) current = window.scrollY;
    target = Math.max(0, Math.min(limit(), target + delta));
    run();
  };
  // Keyboard, scrollbar, touch, anchors and scripts move the document directly; follow them.
  const native = () => {
    if (writing || frame) return;
    target = current = window.scrollY;
  };
  window.addEventListener('wheel', wheel, { passive: false });
  window.addEventListener('scroll', native, { passive: true });
  const interrupt = () => { if (frame) { cancelAnimationFrame(frame); frame = 0; last = 0; } target = current = window.scrollY; };
  window.addEventListener('touchstart', interrupt, { passive: true });
  window.addEventListener('keydown', interrupt);

  return {
    scrollTo(top, options = {}) {
      const clamped = Math.max(0, Math.min(limit(), top));
      if (options.immediate) { if (frame) cancelAnimationFrame(frame); frame = 0; last = 0; target = current = clamped; write(clamped); return; }
      if (!frame) current = window.scrollY;
      target = clamped; run();
    },
    stop() { stopped = true; },
    start() { stopped = false; target = current = window.scrollY; },
    dispose() {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('wheel', wheel); window.removeEventListener('scroll', native);
      window.removeEventListener('touchstart', interrupt); window.removeEventListener('keydown', interrupt);
    },
  };
}

let active: SmoothScroll | null = null;
export function installSmoothScroll() { active?.dispose(); active = createSmoothScroll(); return () => { active?.dispose(); active = null; }; }
export function smoothScroll() { return active; }
