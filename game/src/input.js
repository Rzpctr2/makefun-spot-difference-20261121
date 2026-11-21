// Twin Teahouse — mouse and keyboard. Clicks mark differences; the arrow keys move a
// crosshair and Enter/Space marks where it stands. 1/2/3 switch scenes, N advances
// after a scene is done, R restarts. Clicks on the title and end cards act as confirm.
import { FIELD } from './config.js';
import { SCREEN_TITLE, SCREEN_SCENE_DONE, SCREEN_GAME_DONE } from './world.js';

export function createInput(canvas, world) {
  function toLogical(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) * FIELD.width) / rect.width,
      y: ((event.clientY - rect.top) * FIELD.height) / rect.height,
    };
  }

  canvas.addEventListener('click', (event) => {
    const p = toLogical(event);
    if (world.screen === SCREEN_TITLE) world.start();
    else if (world.screen === SCREEN_SCENE_DONE) world.nextScene();
    else if (world.screen === SCREEN_GAME_DONE) world.restart();
    else world.clickAt(p.x, p.y);
  });

  canvas.addEventListener('mousemove', (event) => {
    world.hover = toLogical(event);
    world.cursorVisible = false;
  });

  canvas.addEventListener('mouseleave', () => {
    world.hover = null;
  });

  document.addEventListener('keydown', (event) => {
    const step = event.shiftKey ? 48 : 14;
    const c = world.cursor;
    if (event.key === 'ArrowLeft') {
      c.x = Math.max(0, c.x - step);
      world.cursorVisible = true;
      event.preventDefault();
    } else if (event.key === 'ArrowRight') {
      c.x = Math.min(FIELD.width, c.x + step);
      world.cursorVisible = true;
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      c.y = Math.max(0, c.y - step);
      world.cursorVisible = true;
      event.preventDefault();
    } else if (event.key === 'ArrowDown') {
      c.y = Math.min(FIELD.height, c.y + step);
      world.cursorVisible = true;
      event.preventDefault();
    } else if (event.key === 'Enter' || event.key === ' ') {
      if (world.screen === SCREEN_TITLE) world.start();
      else if (world.screen === SCREEN_SCENE_DONE) world.nextScene();
      else if (world.screen === SCREEN_GAME_DONE) world.restart();
      else world.clickAt(c.x, c.y);
      event.preventDefault();
    } else if (event.key === '1' || event.key === '2' || event.key === '3') {
      world.selectScene(Number(event.key) - 1);
    } else if (event.key === 'n' || event.key === 'N') {
      world.nextScene();
    } else if (event.key === 'r' || event.key === 'R') {
      world.restart();
    }
  });
}
