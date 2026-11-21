// Twin Teahouse — everything the player sees: the two picture panels, the markers on
// found differences, the header (title, scene tabs, timer, counter), the footer hints,
// and the title / scene-complete / game-complete screens. One canvas, 1280x720 logical.
import { FIELD, HEADER, FOOTER, PANEL_LEFT, PANEL_RIGHT, PALETTE, fmtTime } from './config.js';
import { leftVariant, rightVariant } from './scenes.js';

function drawFrame(ctx, p) {
  ctx.strokeStyle = PALETTE.panelFrame;
  ctx.lineWidth = 4;
  ctx.strokeRect(p.x - 2, p.y - 2, p.w + 4, p.h + 4);
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.fillRect(p.x, p.y, p.w, 10);
}

/** Draw one picture panel: the scene in its variant, then green rings on found diffs. */
export function drawPanel(ctx, scene, variant, found, panel, hover, interactive) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(panel.x, panel.y, panel.w, panel.h);
  ctx.clip();
  ctx.translate(panel.x, panel.y);
  scene.draw(ctx, panel.w, panel.h, variant);
  ctx.restore();
  drawFrame(ctx, panel);
  for (const d of scene.diffs) {
    if (!found.has(d.id)) continue;
    const cx = panel.x + d.x;
    const cy = panel.y + d.y;
    ctx.strokeStyle = PALETTE.found;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(cx, cy, d.r + 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = PALETTE.foundRing;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, d.r + 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = PALETTE.found;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy);
    ctx.lineTo(cx - 2, cy + 9);
    ctx.lineTo(cx + 12, cy - 9);
    ctx.stroke();
  }
  if (interactive && hover) {
    for (const d of scene.diffs) {
      if (found.has(d.id)) continue;
      const dx = hover.x - (panel.x + d.x);
      const dy = hover.y - (panel.y + d.y);
      if (dx * dx + dy * dy < (d.r + 6) * (d.r + 6)) {
        ctx.strokeStyle = 'rgba(242, 201, 76, 0.9)';
        ctx.setLineDash([6, 5]);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(panel.x + d.x, panel.y + d.y, d.r + 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }
}

function drawHeader(ctx, world) {
  const scene = world.scene();
  ctx.fillStyle = PALETTE.header;
  ctx.fillRect(HEADER.x, HEADER.y, HEADER.w, HEADER.h);
  ctx.fillStyle = PALETTE.accent;
  ctx.font = '800 26px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('TWIN TEAHOUSE', 24, 26);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = '600 14px system-ui, sans-serif';
  ctx.fillText('SPOT THE DIFFERENCE', 24, 52);
  // scene tabs
  world.scenes.forEach((s, i) => {
    const x = 420 + i * 150;
    const active = i === world.sceneIndex;
    ctx.fillStyle = active ? PALETTE.accent : '#2a3049';
    ctx.beginPath();
    ctx.roundRect(x, 14, 138, 44, 8);
    ctx.fill();
    ctx.fillStyle = active ? '#141824' : PALETTE.text;
    ctx.font = '700 15px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${i + 1} · ${s.name.split(' ')[0]}`, x + 69, 37);
  });
  // timer + counters
  ctx.fillStyle = PALETTE.text;
  ctx.font = '700 22px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`⏱ ${fmtTime(world.elapsed)}`, 1000, 26);
  ctx.fillStyle = PALETTE.accent;
  ctx.fillText(`Found ${world.found[world.sceneIndex].size} / 7`, 1000, 52);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = '600 15px system-ui, sans-serif';
  ctx.fillText(`Total ${world.totalFound()} / 21`, 1256, 26);
  ctx.fillText(`Misses ${world.misses}`, 1256, 52);
}

function drawFooter(ctx, text) {
  ctx.fillStyle = PALETTE.backdrop;
  ctx.fillRect(FOOTER.x, FOOTER.y, FOOTER.w, FOOTER.h);
  ctx.fillStyle = PALETTE.hint;
  ctx.font = '600 16px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, FIELD.width / 2, FOOTER.y + 32);
}

function drawPanels(ctx, world, interactive) {
  const scene = world.scene();
  drawPanel(ctx, scene, leftVariant(scene), world.found[world.sceneIndex], PANEL_LEFT, world.hover, interactive);
  drawPanel(ctx, scene, rightVariant(scene), world.found[world.sceneIndex], PANEL_RIGHT, world.hover, interactive);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = '700 14px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('LEFT — ORIGINAL', PANEL_LEFT.x + PANEL_LEFT.w / 2, PANEL_LEFT.y - 12);
  ctx.fillText('RIGHT — 7 CHANGES', PANEL_RIGHT.x + PANEL_RIGHT.w / 2, PANEL_RIGHT.y - 12);
  // keyboard cursor
  if (interactive && world.cursorVisible) {
    ctx.strokeStyle = PALETTE.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(world.cursor.x, world.cursor.y, 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(world.cursor.x - 18, world.cursor.y);
    ctx.lineTo(world.cursor.x + 18, world.cursor.y);
    ctx.moveTo(world.cursor.x, world.cursor.y - 18);
    ctx.lineTo(world.cursor.x, world.cursor.y + 18);
    ctx.stroke();
  }
}

function drawCard(ctx, lines) {
  const w = 640;
  const h = 96 + lines.length * 44;
  const x = (FIELD.width - w) / 2;
  const y = (FIELD.height - h) / 2;
  ctx.fillStyle = 'rgba(10, 12, 20, 0.72)';
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  ctx.fillStyle = '#232a40';
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 16);
  ctx.fill();
  ctx.strokeStyle = PALETTE.accent;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  lines.forEach((line, i) => {
    ctx.fillStyle = line.color || PALETTE.text;
    ctx.font = `${line.weight || '700'} ${line.size || 24}px system-ui, sans-serif`;
    ctx.fillText(line.text, FIELD.width / 2, y + 58 + i * 44);
  });
}

export function drawTitle(ctx, world) {
  ctx.fillStyle = PALETTE.backdrop;
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  drawHeader(ctx, world);
  drawPanels(ctx, world, false);
  drawFooter(ctx, 'Click a difference in either picture — or move with the arrow keys and press Enter.');
  drawCard(ctx, [
    { text: 'TWIN TEAHOUSE', size: 40, color: PALETTE.accent, weight: '800' },
    { text: 'Spot the Difference', size: 26 },
    { text: '3 scenes · 7 differences each · 21 total', size: 18, color: PALETTE.muted, weight: '600' },
    { text: 'Click or press SPACE to play', size: 20, color: PALETTE.found },
  ]);
}

export function drawPlay(ctx, world) {
  ctx.fillStyle = PALETTE.backdrop;
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  drawHeader(ctx, world);
  drawPanels(ctx, world, true);
  drawFooter(ctx, 'Find all 7 differences — click either picture · Arrow keys move the cursor · 1/2/3 switch scene · N next scene when done');
}

export function drawSceneDone(ctx, world) {
  drawPlay(ctx, world);
  drawCard(ctx, [
    { text: 'Scene complete!', size: 32, color: PALETTE.found },
    { text: `${world.scene().name} — 7 / 7 found in ${fmtTime(world.elapsed)}`, size: 20, weight: '600' },
    { text: 'Press N for the next scene', size: 20, color: PALETTE.accent },
  ]);
}

export function drawGameDone(ctx, world) {
  drawPlay(ctx, world);
  drawCard(ctx, [
    { text: 'All scenes complete!', size: 32, color: PALETTE.accent },
    { text: `21 / 21 differences found in ${fmtTime(world.totalElapsed)}`, size: 22 },
    { text: `Best total: ${world.best > 0 ? fmtTime(world.best) : '—'}`, size: 18, color: PALETTE.muted, weight: '600' },
    { text: 'Press R to play again', size: 20, color: PALETTE.found },
  ]);
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  return {
    draw(state, screen) {
      if (screen === 'title') drawTitle(ctx, state);
      else if (screen === 'play') drawPlay(ctx, state);
      else if (screen === 'sceneDone') drawSceneDone(ctx, state);
      else if (screen === 'gameDone') drawGameDone(ctx, state);
    },
  };
}
