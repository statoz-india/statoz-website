/** One document-scroll clock for the HTML, camera and city handoff. */
let progress = 0;
const listeners = new Set<(value: number) => void>();
export function publishJourneyProgress(value: number) {
  progress = value;
  listeners.forEach(listener => listener(value));
}
export function observeJourneyProgress(listener: (value: number) => void) {
  listeners.add(listener);
  listener(progress);
  return () => { listeners.delete(listener); };
}
export function journeyProgress() { return progress; }
export const smooth = (from: number, to: number, value: number) => {
  const t = Math.max(0, Math.min(1, (value - from) / (to - from)));
  return t * t * (3 - 2 * t);
};
