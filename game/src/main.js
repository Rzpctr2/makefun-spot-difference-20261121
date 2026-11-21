// Twin Teahouse — boot and the one loop: input is read on events, the world advances in
// fixed 1/60 s steps, and the renderer paints what is there. The game moves between
// four screens: title, play, scene complete and game complete.
//
// ?seed=N fixes the play shot's found set. ?shot=start|play|end (with &seed=N) stages
// that scene instead of running the loop, paints it twice and sets window.__shotReady
// for a screenshot.
import { STEP } from './config.js';
import { createWorld } from './world.js';
import { createInput } from './input.js';
import { createRenderer } from './render.js';
import { stageShot } from './shots.js';

/** The longest frame the loop catches up on; a longer stall is dropped, not replayed. */
const MAX_FRAME = 0.25;

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const seedParam = Number.parseInt(params.get('seed') ?? '', 10);
const seed = Number.isInteger(seedParam) ? seedParam : 1;

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const world = createWorld();
const renderer = createRenderer(canvas);

function runShot(name) {
  const scene = stageShot(name, world, seed);
  let painted = 0;
  function paint() {
    renderer.draw(world, scene.screen);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  createInput(canvas, world);
  let accumulator = 0;
  let last = performance.now();

  // Screen readers (and anyone watching the page's text) hear the screen changes.
  function announce(message) {
    status.textContent = message;
  }

  function frame(now) {
    requestAnimationFrame(frame);
    accumulator += Math.min((now - last) / 1000, MAX_FRAME);
    last = now;
    while (accumulator >= STEP) {
      world.tick(STEP);
      accumulator -= STEP;
    }
    renderer.draw(world, world.screen);
    if (world.screen === 'title') announce('Twin Teahouse. Spot the difference. Press Space or click to play.');
  }

  // Leaving the tab keeps the timer honest: the loop simply stops advancing.
  document.addEventListener('visibilitychange', () => {
    last = performance.now();
    accumulator = 0;
  });

  announce('Twin Teahouse. Spot the difference. Press Space or click to play.');
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();
