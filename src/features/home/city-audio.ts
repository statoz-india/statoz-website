/**
 * An optional soundscape, generated in the browser so no audio files need licensing.
 * Off by default; it starts only after the visitor presses the sound toggle.
 */
const KEY = 'statoz-city-sound';
type Graph = {
  context: AudioContext; master: GainNode;
  engine: { low: OscillatorNode; high: OscillatorNode; filter: BiquadFilterNode; gain: GainNode };
  tyres: GainNode; hum: GainNode; crowd: GainNode; crowdFilter: BiquadFilterNode;
};
let graph: Graph | null = null, enabled = false;
const listeners = new Set<(on: boolean) => void>();

function noiseBuffer(context: AudioContext, seconds = 2, brown = false) {
  const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate), data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) { const white = Math.random() * 2 - 1; data[i] = brown ? (last = (last + .02 * white) / 1.02) * 3.5 : white; }
  return buffer;
}
function loop(context: AudioContext, buffer: AudioBuffer, destination: AudioNode) { const source = context.createBufferSource(); source.buffer = buffer; source.loop = true; source.connect(destination); source.start(); return source; }

function build(): Graph {
  const context = new AudioContext(), master = context.createGain(); master.gain.value = 0; master.connect(context.destination);
  const filter = context.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 380; filter.Q.value = 3;
  const engineGain = context.createGain(); engineGain.gain.value = 0; filter.connect(engineGain); engineGain.connect(master);
  const low = context.createOscillator(); low.type = 'sawtooth'; low.frequency.value = 42; low.connect(filter); low.start();
  const high = context.createOscillator(); high.type = 'square'; high.frequency.value = 84; const highGain = context.createGain(); highGain.gain.value = .25; high.connect(highGain); highGain.connect(filter); high.start();
  const road = context.createBiquadFilter(); road.type = 'bandpass'; road.frequency.value = 700; road.Q.value = .6;
  const tyres = context.createGain(); tyres.gain.value = 0; road.connect(tyres); tyres.connect(master); loop(context, noiseBuffer(context), road);
  const humFilter = context.createBiquadFilter(); humFilter.type = 'lowpass'; humFilter.frequency.value = 160;
  const hum = context.createGain(); hum.gain.value = .05; humFilter.connect(hum); hum.connect(master); loop(context, noiseBuffer(context, 3, true), humFilter);
  const crowdFilter = context.createBiquadFilter(); crowdFilter.type = 'bandpass'; crowdFilter.frequency.value = 900; crowdFilter.Q.value = .8;
  const crowd = context.createGain(); crowd.gain.value = 0; crowdFilter.connect(crowd); crowd.connect(master); loop(context, noiseBuffer(context, 4), crowdFilter);
  return { context, master, engine: { low, high, filter, gain: engineGain }, tyres, hum, crowd, crowdFilter };
}

export const cityAudio = {
  get enabled() { return enabled; },
  /** Must be called from a user gesture. */
  async setEnabled(on: boolean) {
    enabled = on;
    try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch {}
    if (on && !graph) graph = build();
    if (graph) {
      if (on) await graph.context.resume();
      const now = graph.context.currentTime; graph.master.gain.cancelScheduledValues(now); graph.master.gain.setTargetAtTime(on ? .55 : 0, now, .25);
    }
    listeners.forEach(listener => listener(on));
  },
  observe(listener: (on: boolean) => void) { listeners.add(listener); listener(enabled); return () => { listeners.delete(listener); }; },
  /** speed: 0..1 while driving; crowd: 0..1 near a ground. */
  update(speed: number, crowd: number, time: number) {
    if (!graph || !enabled) return;
    const now = graph.context.currentTime, { engine } = graph;
    engine.low.frequency.setTargetAtTime(38 + speed * 70, now, .15); engine.high.frequency.setTargetAtTime(76 + speed * 140, now, .15);
    engine.filter.frequency.setTargetAtTime(260 + speed * 900, now, .2); engine.gain.gain.setTargetAtTime(speed > .01 ? .05 + speed * .16 : 0, now, .3);
    graph.tyres.gain.setTargetAtTime(speed * .05, now, .2);
    graph.crowd.gain.setTargetAtTime(crowd * (.05 + .03 * Math.max(0, Math.sin(time * .7))), now, .5);
  },
  /** A floodlight relay closing: a low thump with a little hiss. */
  clunk(delay = 0) {
    if (!graph || !enabled) return;
    const { context, master } = graph, at = context.currentTime + delay;
    const thump = context.createOscillator(), gain = context.createGain(); thump.frequency.setValueAtTime(70, at); thump.frequency.exponentialRampToValueAtTime(38, at + .25);
    gain.gain.setValueAtTime(.0001, at); gain.gain.exponentialRampToValueAtTime(.5, at + .01); gain.gain.exponentialRampToValueAtTime(.0001, at + .35);
    thump.connect(gain); gain.connect(master); thump.start(at); thump.stop(at + .4);
  },
  click() {
    if (!graph || !enabled) return;
    const { context, master } = graph, at = context.currentTime, tone = context.createOscillator(), gain = context.createGain();
    tone.frequency.value = 1800; gain.gain.setValueAtTime(.06, at); gain.gain.exponentialRampToValueAtTime(.0001, at + .05);
    tone.connect(gain); gain.connect(master); tone.start(at); tone.stop(at + .06);
  },
  suspend(hidden: boolean) { if (graph && enabled) void (hidden ? graph.context.suspend() : graph.context.resume()); },
  /** Whether the visitor turned sound on before; it still needs a gesture to start. */
  remembered() { try { return localStorage.getItem(KEY) === 'on'; } catch { return false; } },
};
