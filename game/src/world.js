// Twin Teahouse — game state: which screen, which scene, what is found, the timers.
// Clicks are tested against both pictures' hotspots; a difference found in either
// picture counts. A click inside a picture that hits nothing counts as a miss.
import { SCENES } from './scenes.js';
import { PANEL_LEFT, PANEL_RIGHT, BEST_KEY } from './config.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_SCENE_DONE = 'sceneDone';
export const SCREEN_GAME_DONE = 'gameDone';

export function createWorld() {
  const world = {
    screen: SCREEN_TITLE,
    sceneIndex: 0,
    scenes: SCENES,
    found: SCENES.map(() => new Set()),
    elapsed: 0,
    totalElapsed: 0,
    misses: 0,
    best: 0,
    hover: null,
    cursor: { x: 640, y: 360 },
    cursorVisible: false,

    scene() {
      return SCENES[this.sceneIndex];
    },
    totalFound() {
      return this.found.reduce((n, s) => n + s.size, 0);
    },
    toTitle() {
      this.screen = SCREEN_TITLE;
      this.sceneIndex = 0;
      this.found = SCENES.map(() => new Set());
      this.elapsed = 0;
      this.totalElapsed = 0;
      this.misses = 0;
    },
    start() {
      this.toTitle();
      this.screen = SCREEN_PLAY;
    },
    selectScene(i) {
      if (i < 0 || i >= SCENES.length) return;
      if (this.screen !== SCREEN_PLAY && this.screen !== SCREEN_TITLE) return;
      this.sceneIndex = i;
      this.elapsed = 0;
      this.screen = SCREEN_PLAY;
    },
    nextScene() {
      if (this.screen !== SCREEN_SCENE_DONE) return;
      if (this.sceneIndex + 1 >= SCENES.length) return;
      this.sceneIndex += 1;
      this.elapsed = 0;
      this.screen = SCREEN_PLAY;
    },
    restart() {
      this.start();
    },
    tick(dt) {
      if (this.screen !== SCREEN_PLAY) return;
      this.elapsed += dt;
      this.totalElapsed += dt;
    },
    /** Test a logical-canvas click. Returns 'found' | 'miss' | 'none'. */
    clickAt(x, y) {
      if (this.screen !== SCREEN_PLAY) return 'none';
      const scene = this.scene();
      const panels = [PANEL_LEFT, PANEL_RIGHT];
      let inside = false;
      for (const p of panels) {
        const lx = x - p.x;
        const ly = y - p.y;
        if (lx < 0 || ly < 0 || lx > p.w || ly > p.h) continue;
        inside = true;
        for (const d of scene.diffs) {
          if (this.found[this.sceneIndex].has(d.id)) continue;
          const dx = lx - d.x;
          const dy = ly - d.y;
          if (dx * dx + dy * dy < (d.r + 6) * (d.r + 6)) {
            this.found[this.sceneIndex].add(d.id);
            if (this.found[this.sceneIndex].size === 7) {
              if (this.sceneIndex === SCENES.length - 1) this.finishGame();
              else this.screen = SCREEN_SCENE_DONE;
            }
            return 'found';
          }
        }
      }
      if (inside) {
        this.misses += 1;
        return 'miss';
      }
      return 'none';
    },
    finishGame() {
      this.screen = SCREEN_GAME_DONE;
      if (this.best === 0 || this.totalElapsed < this.best) {
        this.best = this.totalElapsed;
        try {
          window.localStorage.setItem(BEST_KEY, String(Math.round(this.best)));
        } catch {
          // Storage can be off: the best time then lasts this visit only.
        }
      }
    },
    readBest() {
      try {
        this.best = Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
      } catch {
        this.best = 0;
      }
    },
  };
  world.readBest();
  return world;
}
