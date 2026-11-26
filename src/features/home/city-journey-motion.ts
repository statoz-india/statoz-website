/**
 * One clock for the opening. Document scroll publishes the *target* progress; while the 3D
 * runtime is active it eases a *display* progress toward it every frame, and the HTML copy,
 * camera, car and particles all read the display value so they move together.
 */
let target = 0, display = 0, velocity = 0, damped = false;
const targetListeners = new Set<(value: number) => void>();
const displayListeners = new Set<(value: number, velocity: number) => void>();

export function publishJourneyProgress(value: number) {
  target = value;
  targetListeners.forEach(listener => listener(value));
  if (!damped) publishDisplayProgress(value, 0);
}
export function observeJourneyProgress(listener: (value: number) => void) {
  targetListeners.add(listener); listener(target);
  return () => { targetListeners.delete(listener); };
}
export function journeyProgress() { return target; }

export function publishDisplayProgress(value: number, speed: number) {
  if (value === display && speed === velocity) return;
  display = value; velocity = speed;
  displayListeners.forEach(listener => listener(value, speed));
}
export function observeDisplayProgress(listener: (value: number, velocity: number) => void) {
  displayListeners.add(listener); listener(display, velocity);
  return () => { displayListeners.delete(listener); };
}
export function displayProgress() { return display; }
/** The runtime owns easing while it renders; without it, display follows the target directly. */
export function setDampedProgress(active: boolean) {
  damped = active;
  if (!active) publishDisplayProgress(target, 0);
}

export type MissionChoice = { sport?: string; prediction?: string; answer?: number; game?: string };
let choice: MissionChoice = {};
const choiceListeners = new Set<(next: MissionChoice, previous: MissionChoice) => void>();
export function missionChoice() { return choice; }
export function publishMissionChoice(next: MissionChoice) {
  const previous = choice; choice = next;
  choiceListeners.forEach(listener => listener(next, previous));
}
export function observeMissionChoice(listener: (next: MissionChoice, previous: MissionChoice) => void) {
  choiceListeners.add(listener);
  return () => { choiceListeners.delete(listener); };
}

/** Arrival state, shared by the 3D runtime and the HTML loader. */
export type ArrivalPhase = 'waiting' | 'loading' | 'reveal' | 'settled';
export type ArrivalState = { phase: ArrivalPhase; progress: number; time: number };
let arrival: ArrivalState = { phase: 'waiting', progress: 0, time: 0 };
const arrivalListeners = new Set<(state: ArrivalState) => void>();
export function publishArrival(next: Partial<ArrivalState>) {
  arrival = { ...arrival, ...next };
  arrivalListeners.forEach(listener => listener(arrival));
}
export function observeArrival(listener: (state: ArrivalState) => void) {
  arrivalListeners.add(listener); listener(arrival);
  return () => { arrivalListeners.delete(listener); };
}
export function arrivalState() { return arrival; }

export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
/** Cubic smoothstep between two edges. */
export const smooth = (from: number, to: number, value: number) => {
  const t = clamp01((value - from) / (to - from));
  return t * t * (3 - 2 * t);
};
/** Quintic smootherstep: zero velocity and acceleration at both ends, so blends never kink. */
export const smoother = (from: number, to: number, value: number) => {
  const t = clamp01((value - from) / (to - from));
  return t * t * t * (t * (t * 6 - 15) + 10);
};
export const easeOutBack = (t: number, overshoot = 1.4) => {
  const s = t - 1; return 1 + s * s * ((overshoot + 1) * s + overshoot);
};
export const easeOutExpo = (t: number) => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
