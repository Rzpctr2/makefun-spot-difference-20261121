# Twin Teahouse — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Rzpctr2/makefun-spot-difference-20261121/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Rzpctr2/makefun-spot-difference-20261121/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

make.fun bounty `best-spot-the-difference-game-20261121-0451` — make the best spot the difference game.

## The game

Three hand-drawn scenes, each shown as two near-identical pictures side by side with
**seven differences** between them — 21 in total:

1. **Teahouse Morning** — a quiet teahouse, a sleeping cat, a cake with a slice gone.
2. **Garden Patio** — sunshine, a pond, a butterfly that may or may not be there.
3. **Night Market** — lanterns, tea jars, and a moon that changes shape.

Click a difference in either picture to ring it green. Find all seven to finish a
scene; find all twenty-one to finish the game. A timer counts up, misses are counted,
and the best total time is kept in the browser.

## How to play

- **Mouse:** click a difference in either picture. Hovering near an unfound
  difference shows a faint gold hint ring.
- **Keyboard:** arrow keys move the crosshair, Enter/Space marks where it stands,
  1/2/3 switch scenes, N advances after a scene is done, R restarts.

## Run it

Static files only, no build step, no network request:

```sh
node serve.ts   # serves game/ on http://localhost:8080
```

Screenshots are real renders of the game's own code (`?shot=start|play|end&seed=1`
stages each frame deterministically): `1-start.jpg` is the title over scene 1,
`2-play.jpg` is scene 1 mid-game with three differences found and four still
unfound, `3-end.jpg` is the game-complete screen at 21 / 21.

All art is original vector drawing made for this entry — no borrowed images, no
libraries, no sound files.
