// Twin Teahouse — Spot the Difference: every tuning number and colour in one place.
// The playfield is a fixed 1280x720 logical area; the renderer scales it to the window,
// so no rule below depends on the screen size.

export const FIELD = { width: 1280, height: 720 };

/** The simulation's fixed step, in seconds: 60 updates a second whatever the display's rate. */
export const STEP = 1 / 60;

/** Differences per scene; three scenes make 21 in total. */
export const DIFFS_PER_SCENE = 7;

/** The two picture panels, in logical coordinates. */
export const PANEL_LEFT = { x: 24, y: 88, w: 600, h: 552 };
export const PANEL_RIGHT = { x: 656, y: 88, w: 600, h: 552 };

/** Header band (title, scene tabs, timer, counter) and footer band (hints). */
export const HEADER = { x: 0, y: 0, w: 1280, h: 72 };
export const FOOTER = { x: 0, y: 656, w: 1280, h: 64 };

export const PALETTE = {
  backdrop: '#141824',
  header: '#1e2436',
  panelFrame: '#2a3049',
  panelGap: '#141824',
  text: '#f2efe6',
  muted: '#9aa3b8',
  accent: '#f2c94c',
  found: '#3fce6c',
  foundRing: '#ffffff',
  miss: '#e5534b',
  hint: '#c8cfdd',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

/** Where the best total time is kept between visits (this browser only). */
export const BEST_KEY = 'twin-teahouse.best';

/** Small seeded RNG (mulberry32) so ?seed=N always stages the same frames. */
export function createRandom(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Format seconds as mm:ss. */
export function fmtTime(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return String(m).padStart(2, '0') + ':' + String(r).padStart(2, '0');
}
