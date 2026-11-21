// Twin Teahouse — the three scenes. Each scene draws the same picture twice: once as
// the left panel (variant 0) and once as the right panel (variant 1). The `v` argument
// maps a difference id (1..7) to 0 (left version) or 1 (right version); every element
// that is not a difference is drawn identically in both. Hotspots are panel-local
// coordinates (panel is 600x552); the same hotspot is valid in either picture.

// ---- tiny shape helpers (all drawing goes through these) ----
export function C(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
export function E(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}
export function R(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}
export function RR(ctx, x, y, w, h, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}
export function T(ctx, text, x, y, size, fill, align = 'center', weight = '700') {
  ctx.fillStyle = fill;
  ctx.font = `${weight} ${size}px system-ui, -apple-system, "Segoe UI", sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}
export function LN(ctx, x1, y1, x2, y2, stroke, w = 3) {
  ctx.strokeStyle = stroke;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
export function POLY(ctx, pts, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i += 1) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  ctx.fill();
}

// ---- Scene 1: Teahouse Morning ----
// Diffs: 1 cat tail (up / flat) · 2 clock (10:10 / 2:30) · 3 teapot (present / gone)
// 4 plant leaves (5 / 3) · 5 window clouds (2 / 3) · 6 cake (whole / slice cut)
// 7 framed picture (mountains / sun and sea)
function drawTeahouse(ctx, W, H, v) {
  R(ctx, 0, 0, W, H, '#f6e7cd'); // wall
  R(ctx, 0, 440, W, H - 440, '#c99a63'); // wooden floor
  R(ctx, 0, 434, W, 8, '#a67c52'); // baseboard
  // window
  R(ctx, 36, 36, 170, 150, '#8a5a33');
  R(ctx, 46, 46, 150, 130, '#bfe6f2');
  C(ctx, 86, 84, 26, '#f7c948'); // sun
  E(ctx, 128, 74, 26, 12, '#ffffff'); // cloud 1
  E(ctx, 164, 112, 22, 10, '#ffffff'); // cloud 2
  if (v[5] === 1) E(ctx, 92, 128, 20, 9, '#ffffff'); // cloud 3 (right only)
  LN(ctx, 121, 46, 121, 176, '#8a5a33', 4); // window cross
  LN(ctx, 46, 111, 196, 111, '#8a5a33', 4);
  // hanging lamp
  LN(ctx, 430, 0, 430, 58, '#5a4632', 3);
  POLY(ctx, [[404, 58], [456, 58], [444, 92], [416, 92]], '#d94f3d');
  C(ctx, 430, 100, 12, '#ffd76a');
  // shelf with cups and teapot
  R(ctx, 380, 150, 180, 14, '#8a5a33');
  RR(ctx, 396, 128, 26, 22, 4, '#4f8f7b'); // cup 1
  RR(ctx, 528, 128, 26, 22, 4, '#e88ca0'); // cup 2
  if (v[3] === 0) {
    C(ctx, 470, 122, 26, '#4f8f7b'); // teapot body
    POLY(ctx, [[444, 118], [428, 108], [444, 106]], '#4f8f7b'); // spout
    R(ctx, 462, 92, 16, 8, '#3a6b5c'); // lid
  }
  // wall clock — diff 2
  C(ctx, 300, 80, 34, '#ffffff');
  ctx.strokeStyle = '#33302e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(300, 80, 34, 0, Math.PI * 2);
  ctx.stroke();
  if (v[2] === 0) {
    LN(ctx, 300, 80, 288, 64, '#33302e', 4); // 10:10
    LN(ctx, 300, 80, 314, 66, '#33302e', 3);
  } else {
    LN(ctx, 300, 80, 312, 70, '#33302e', 4); // 2:30
    LN(ctx, 300, 80, 300, 98, '#33302e', 3);
  }
  C(ctx, 300, 80, 4, '#e5534b');
  // framed picture — diff 7
  R(ctx, 516, 56, 68, 52, '#6b4a2f');
  R(ctx, 522, 62, 56, 40, '#cfe8f5');
  if (v[7] === 0) {
    POLY(ctx, [[522, 102], [540, 74], [558, 102]], '#7a9e7e'); // mountains
    POLY(ctx, [[546, 102], [564, 82], [578, 102]], '#5d8563');
  } else {
    C(ctx, 566, 74, 9, '#f7c948'); // sun over sea
    R(ctx, 522, 92, 56, 10, '#5aa7d6');
  }
  // rug
  E(ctx, 300, 516, 150, 22, '#b5533c');
  E(ctx, 300, 516, 104, 14, '#d98a6a');
  // table with cake
  R(ctx, 180, 400, 260, 20, '#7a5230');
  R(ctx, 196, 420, 14, 40, '#6b4423');
  R(ctx, 410, 420, 14, 40, '#6b4423');
  E(ctx, 310, 398, 52, 10, '#eef1f5'); // plate
  if (v[6] === 0) {
    RR(ctx, 278, 372, 64, 26, 6, '#f2d5a0'); // whole cake
    RR(ctx, 278, 372, 64, 10, 6, '#e88ca0'); // frosting
  } else {
    RR(ctx, 278, 372, 40, 26, 6, '#f2d5a0'); // slice cut away
    RR(ctx, 278, 372, 40, 10, 6, '#e88ca0');
    POLY(ctx, [[318, 372], [342, 380], [342, 398], [318, 398]], '#d9b380'); // cut face
  }
  // potted plant — diff 4
  POLY(ctx, [[76, 452], [104, 452], [98, 486], [82, 486]], '#c96f4a');
  LN(ctx, 90, 452, 90, 420, '#3f8f3f', 4);
  const leaves = v[4] === 0 ? 5 : 3;
  for (let i = 0; i < leaves; i += 1) {
    const a = -Math.PI / 2 + (i - (leaves - 1) / 2) * 0.5;
    E(ctx, 90 + Math.cos(a) * 22, 424 + Math.sin(a) * 16, 12, 7, '#4f9e4f');
  }
  // cat asleep on a cushion — diff 1 is the tail
  E(ctx, 452, 500, 66, 18, '#d97b9b'); // cushion
  E(ctx, 448, 478, 44, 20, '#f2a541'); // body
  C(ctx, 492, 468, 18, '#f2a541'); // head
  POLY(ctx, [[480, 456], [486, 442], [494, 456]], '#f2a541'); // ear
  POLY(ctx, [[498, 454], [506, 442], [510, 458]], '#f2a541'); // ear
  if (v[1] === 0) {
    ctx.strokeStyle = '#f2a541';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(414, 462, 18, Math.PI * 0.6, Math.PI * 1.7);
    ctx.stroke();
  } else {
    LN(ctx, 404, 492, 436, 492, '#f2a541', 8); // tail flat on the floor
  }
}

// ---- Scene 2: Garden Patio ----
// Diffs: 1 butterfly (present / gone) · 2 pond fish (2 / 3) · 3 tree apples (3 / 5)
// 4 birdhouse door (present / gone) · 5 middle flower (red / yellow)
// 6 bench slats (3 / 4) · 7 umbrella stripes (red / blue)
function drawGarden(ctx, W, H, v) {
  R(ctx, 0, 0, W, 330, '#a8dcf5'); // sky
  R(ctx, 0, 330, W, H - 330, '#79c25a'); // grass
  C(ctx, 90, 80, 34, '#ffd23e'); // sun
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2;
    LN(ctx, 90 + Math.cos(a) * 42, 80 + Math.sin(a) * 42, 90 + Math.cos(a) * 54, 80 + Math.sin(a) * 54, '#ffd23e', 4);
  }
  // fence
  R(ctx, 0, 296, W, 10, '#e8dcc0');
  R(ctx, 0, 322, W, 10, '#e8dcc0');
  for (let x = 20; x < W; x += 64) R(ctx, x, 288, 12, 52, '#c9b489');
  // tree with apples — diff 3
  R(ctx, 462, 210, 18, 110, '#7a5230');
  C(ctx, 440, 190, 44, '#3f8f3f');
  C(ctx, 500, 180, 48, '#3f8f3f');
  C(ctx, 470, 150, 42, '#4a9e4a');
  const apples = v[3] === 0 ? [[438, 176], [492, 164], [470, 200]] : [[438, 176], [492, 164], [470, 200], [452, 148], [500, 196]];
  for (const [ax, ay] of apples) C(ctx, ax, ay, 7, '#e5534b');
  // pond with fish — diff 2
  E(ctx, 180, 470, 120, 40, '#5aa7d6');
  E(ctx, 180, 470, 120, 40, '#5aa7d6');
  ctx.strokeStyle = '#4a90c2';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(180, 470, 96, 28, 0, 0, Math.PI * 2);
  ctx.stroke();
  const fish = v[2] === 0 ? [[150, 462], [210, 480]] : [[150, 462], [210, 480], [180, 452]];
  for (const [fx, fy] of fish) {
    E(ctx, fx, fy, 12, 6, '#ff8c42');
    POLY(ctx, [[fx + 11, fy], [fx + 20, fy - 5], [fx + 20, fy + 5]], '#ff8c42');
  }
  // bench — diff 6
  R(ctx, 320, 420, 120, 12, '#a67c52');
  R(ctx, 332, 432, 10, 34, '#8a5a33');
  R(ctx, 418, 432, 10, 34, '#8a5a33');
  const slats = v[6] === 0 ? 3 : 4;
  for (let i = 0; i < slats; i += 1) R(ctx, 322, 372 + i * 13, 116, 8, '#a67c52');
  // birdhouse — diff 4
  R(ctx, 86, 300, 8, 60, '#7a5230');
  R(ctx, 62, 268, 56, 42, '#b5533c');
  POLY(ctx, [[56, 270], [90, 244], [124, 270]], '#8a3b2e');
  if (v[4] === 0) C(ctx, 90, 292, 9, '#2a2118'); // door hole
  // flowers — diff 5 is the middle flower's colour
  const flowers = [[250, 500, '#e5534b'], [300, 496, v[5] === 0 ? '#e5534b' : '#f2c94c'], [540, 500, '#e5534b']];
  for (const [fx, fy, fc] of flowers) {
    LN(ctx, fx, fy, fx, fy + 26, '#3f8f3f', 4);
    for (let p = 0; p < 5; p += 1) {
      const a = (p / 5) * Math.PI * 2;
      C(ctx, fx + Math.cos(a) * 10, fy + Math.sin(a) * 10, 7, fc);
    }
    C(ctx, fx, fy, 6, '#ffd23e');
  }
  // butterfly — diff 1
  if (v[1] === 0) {
    E(ctx, 408, 148, 12, 16, '#b388ff');
    E(ctx, 432, 148, 12, 16, '#b388ff');
    R(ctx, 418, 140, 4, 22, '#5a4632');
  }
  // umbrella — diff 7
  LN(ctx, 540, 300, 540, 380, '#6b4a2f', 4);
  ctx.fillStyle = v[7] === 0 ? '#e5534b' : '#4a7dd6';
  ctx.beginPath();
  ctx.moveTo(486, 306);
  ctx.quadraticCurveTo(540, 252, 594, 306);
  ctx.closePath();
  ctx.fill();
  R(ctx, 486, 300, 108, 8, '#f6ead2');
}

// ---- Scene 3: Night Market ----
// Diffs: 1 moon (full / crescent) · 2 lanterns (3 / 2) · 3 stars (5 / 7)
// 4 middle jar label (red / green) · 5 cat eyes (open / closed)
// 6 sign teacup (present / gone) · 7 awning stripe (red / blue)
function drawMarket(ctx, W, H, v) {
  R(ctx, 0, 0, W, H, '#1b2340'); // night sky
  R(ctx, 0, 470, W, H - 470, '#2a2f4a'); // ground
  // stars — diff 3
  const stars = [[60, 40], [200, 60], [360, 36], [500, 90], [560, 44]];
  if (v[3] === 1) stars.push([300, 90], [440, 50]);
  for (const [sx, sy] of stars) {
    C(ctx, sx, sy, 3, '#f5f0c8');
    LN(ctx, sx - 7, sy, sx + 7, sy, '#f5f0c8', 1);
    LN(ctx, sx, sy - 7, sx, sy + 7, '#f5f0c8', 1);
  }
  // moon — diff 1
  C(ctx, 90, 80, 30, '#f5f0c8');
  if (v[1] === 1) C(ctx, 102, 74, 26, '#1b2340'); // crescent bite
  // string lights
  ctx.strokeStyle = '#5a4632';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 30);
  ctx.quadraticCurveTo(300, 70, 600, 28);
  ctx.stroke();
  for (let i = 0; i < 9; i += 1) {
    const lx = 40 + i * 65;
    const ly = 30 + Math.sin((i / 8) * Math.PI) * 34;
    C(ctx, lx, ly + 8, 5, ['#ffd23e', '#ff8c42', '#7ee2a8'][i % 3]);
  }
  // awning — diff 7 is one stripe's colour
  for (let i = 0; i < 8; i += 1) {
    const stripe = i === 3 && v[7] === 1 ? '#4a7dd6' : i % 2 === 0 ? '#d94f3d' : '#f6ead2';
    R(ctx, 90 + i * 52, 96, 52, 46, stripe);
  }
  R(ctx, 90, 142, 420, 10, '#8a3b2e');
  // stall counter
  R(ctx, 110, 380, 380, 92, '#8a5a33');
  R(ctx, 110, 380, 380, 12, '#a67c52');
  // jars — diff 4 is the middle jar's label
  const jars = [[170, 336, '#f2d5a0'], [250, 336, '#f2d5a0'], [330, 336, '#f2d5a0']];
  for (let i = 0; i < jars.length; i += 1) {
    const [jx, jy] = jars[i];
    RR(ctx, jx, jy, 44, 44, 6, 'rgba(242, 213, 160, 0.9)');
    R(ctx, jx + 4, jy + 6, 36, 8, '#8a5a33'); // lid
    const label = i === 1 ? (v[4] === 0 ? '#e5534b' : '#4f8f3f') : '#e5534b';
    R(ctx, jx + 8, jy + 20, 28, 14, label);
  }
  // lanterns — diff 2
  const lanterns = v[2] === 0 ? [150, 300, 450] : [150, 450];
  for (const lx of lanterns) {
    LN(ctx, lx, 152, lx, 176, '#5a4632', 2);
    E(ctx, lx, 200, 20, 26, '#e5534b');
    E(ctx, lx, 200, 20, 26, 'rgba(255, 210, 62, 0.25)');
    R(ctx, lx - 8, 172, 16, 6, '#f2c94c');
    R(ctx, lx - 8, 222, 16, 6, '#f2c94c');
  }
  // cat on the counter — diff 5 is the eyes
  E(ctx, 430, 362, 34, 16, '#3a3f55');
  C(ctx, 458, 348, 14, '#3a3f55');
  POLY(ctx, [[448, 340], [452, 328], [458, 340]], '#3a3f55');
  POLY(ctx, [[462, 338], [468, 328], [470, 340]], '#3a3f55');
  if (v[5] === 0) {
    C(ctx, 454, 348, 2, '#ffd23e'); // eyes open
    C(ctx, 462, 348, 2, '#ffd23e');
  } else {
    LN(ctx, 450, 348, 458, 348, '#ffd23e', 2); // eyes closed
    LN(ctx, 459, 348, 467, 348, '#ffd23e', 2);
  }
  // sign board — diff 6 is the little teacup
  R(ctx, 500, 296, 84, 62, '#f6ead2');
  R(ctx, 500, 296, 84, 62, '#f6ead2');
  ctx.strokeStyle = '#6b4a2f';
  ctx.lineWidth = 3;
  ctx.strokeRect(500, 296, 84, 62);
  T(ctx, 'TEA', 542, 318, 22, '#33302e');
  if (v[6] === 0) {
    RR(ctx, 530, 332, 22, 12, 3, '#4f8f7b'); // tiny teacup on the sign
    LN(ctx, 552, 336, 558, 340, '#4f8f7b', 2);
  }
  // steamer baskets
  E(ctx, 500, 440, 34, 12, '#c9b489');
  E(ctx, 500, 424, 30, 10, '#d9c9a0');
}

export const SCENES = [
  {
    id: 0,
    name: 'Teahouse Morning',
    tagline: 'A quiet teahouse, a sleeping cat, and seven small changes.',
    draw: drawTeahouse,
    diffs: [
      { id: 1, x: 420, y: 470, r: 34, label: 'cat tail' },
      { id: 2, x: 300, y: 80, r: 40, label: 'clock hands' },
      { id: 3, x: 470, y: 118, r: 36, label: 'teapot' },
      { id: 4, x: 90, y: 432, r: 36, label: 'plant leaves' },
      { id: 5, x: 128, y: 92, r: 38, label: 'window clouds' },
      { id: 6, x: 310, y: 382, r: 36, label: 'cake slice' },
      { id: 7, x: 550, y: 82, r: 32, label: 'framed picture' },
    ],
  },
  {
    id: 1,
    name: 'Garden Patio',
    tagline: 'Sunshine, a pond, and seven small changes hiding in the garden.',
    draw: drawGarden,
    diffs: [
      { id: 1, x: 420, y: 148, r: 28, label: 'butterfly' },
      { id: 2, x: 180, y: 470, r: 46, label: 'pond fish' },
      { id: 3, x: 470, y: 178, r: 42, label: 'tree apples' },
      { id: 4, x: 90, y: 290, r: 32, label: 'birdhouse door' },
      { id: 5, x: 300, y: 496, r: 28, label: 'flower colour' },
      { id: 6, x: 380, y: 400, r: 38, label: 'bench slats' },
      { id: 7, x: 540, y: 308, r: 38, label: 'umbrella stripes' },
    ],
  },
  {
    id: 2,
    name: 'Night Market',
    tagline: 'Lanterns, tea jars, and seven small changes after dark.',
    draw: drawMarket,
    diffs: [
      { id: 1, x: 90, y: 80, r: 38, label: 'moon' },
      { id: 2, x: 300, y: 200, r: 32, label: 'lanterns' },
      { id: 3, x: 470, y: 62, r: 34, label: 'stars' },
      { id: 4, x: 272, y: 352, r: 30, label: 'jar label' },
      { id: 5, x: 458, y: 348, r: 30, label: 'cat eyes' },
      { id: 6, x: 542, y: 327, r: 32, label: 'sign teacup' },
      { id: 7, x: 300, y: 119, r: 32, label: 'awning stripe' },
    ],
  },
];

/** The right panel's variant map: every difference flipped to version 1. */
export function rightVariant(scene) {
  const v = {};
  for (const d of scene.diffs) v[d.id] = 1;
  return v;
}

/** The left panel's variant map: every difference at version 0. */
export function leftVariant(scene) {
  const v = {};
  for (const d of scene.diffs) v[d.id] = 0;
  return v;
}
