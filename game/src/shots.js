// The screenshot scenes behind ?shot=start|play|end. Each one stages a real game state
// with fixed values, so the same seed always gives the same frame:
// - start: the title card over scene 1, nothing found yet, timer at 00:00.
// - play: scene 1 mid-game, three differences already ringed, four still unfound,
//   the counter reading 3 / 7 and the timer at 01:23.
// - end: every scene complete, 21 / 21 found, total time 06:47.
import { SCENES } from './scenes.js';
import { SCREEN_TITLE, SCREEN_PLAY, SCREEN_GAME_DONE } from './world.js';

const PLAY_SECONDS = 83;
const END_TOTAL_SECONDS = 407;

/** Three found differences for the play shot, rotated by the seed (deterministic). */
function playFoundIds(seed) {
  const ids = [];
  for (const k of [0, 2, 4]) ids.push(((seed + k) % 7) + 1);
  return ids;
}

/** Set `world` to the named scene and return the screen to draw over it. */
export function stageShot(name, world, seed) {
  if (name === 'play') {
    world.start();
    world.sceneIndex = 0;
    world.found[0] = new Set(playFoundIds(seed));
    world.elapsed = PLAY_SECONDS;
    world.totalElapsed = PLAY_SECONDS;
    return { screen: SCREEN_PLAY };
  }
  if (name === 'end') {
    world.start();
    world.found = SCENES.map(() => new Set([1, 2, 3, 4, 5, 6, 7]));
    world.totalElapsed = END_TOTAL_SECONDS;
    world.screen = SCREEN_GAME_DONE;
    return { screen: SCREEN_GAME_DONE };
  }
  world.toTitle();
  return { screen: SCREEN_TITLE };
}
