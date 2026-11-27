# Glowkeeper — reference browser game

A small, complete, dependency-free example game included with **Make Webcode Games**. Use it to see the skills applied to real files—not as a framework or a template to copy without adapting.

## The game

You are a moon moth gathering **12 glow seeds before dawn**. Move along the lower part of the playfield, catch the mint fireflies, and avoid ink drops. Three hits end the run.

- **Keyboard:** `A` / `D` or `←` / `→` while the playfield has focus.
- **Mouse / touch:** move or drag across the playfield.
- **Pause / resume:** `Escape` or the visible pause button.
- **Goal:** collect 12 glow seeds before the 45-second night ends.

The example has an explicit title, play, pause, win, and loss flow; a responsive Canvas playfield; semantic HTML controls and status; reduced-motion support; responsive keyboard/pointer input; deterministic rule tests; and a no-dependency local server. Every visual is drawn in Canvas/CSS: there are no external images, fonts, audio files, or asset-license assumptions.

## Run it

Requires Python 3 for the static dev server and Node.js for tests. No package install is needed.

```bash
npm run check
npm test
npm run dev
```

Open the URL printed by Python (usually `http://localhost:4173`). If that port is already taken, use:

```bash
npm run dev -- --port 4174
```

In a proxied sandbox, keep the `0.0.0.0` bind and use the preview URL provided by that environment.

## Read the code

```text
index.html             Semantic shell, HUD, instructions, and screen controls
styles.css             Responsive layout, focus states, and reduced-motion rules
src/model.js           Authoritative state, spawn/update/collision rules
src/input.js           Keyboard + pointer/touch action mapping and cleanup
src/render.js          Pure Canvas drawing from the current game state
src/main.js            Lifecycle, resize, UI synchronization, and RAF loop
tests/model.test.js    Rule, pause, collision, win/loss, and restart tests
tests/render.test.js   Verifies rendering does not mutate game state
```

Start with `src/model.js`, then follow `src/main.js` into `src/input.js` and `src/render.js`. The parent skill's `references/coding-playbook.md` explains why the boundaries are arranged this way and what to change for other games.

## What this code demonstrates

- **One source of truth:** `model.js` owns the session state and explicit `title → playing → paused / won / lost` transitions. The HUD reads that state instead of maintaining a second score.
- **Frame-rate-independent rules:** movement uses seconds, and a large frame gap is clamped so returning from a suspended tab cannot teleport the player.
- **Testable randomness:** `updateGame` accepts a random function, letting tests exercise the rules without flaky timing or a browser.
- **One input vocabulary:** keyboard and pointer events become the same small input frame before game rules run. Listeners and animation resources have cleanup paths.
- **Read-only rendering:** `render.js` draws the current model and does not advance it. `tests/render.test.js` checks that invariant with a no-op Canvas context.
- **Responsive coordinate mapping:** Canvas uses a fixed logical world, a capped device-pixel ratio, and pointer coordinates converted from CSS pixels.
- **Accessible HTML around Canvas:** instructions, progress, pause/replay controls, status announcements, and visible focus are real HTML; only the action scene is painted.
- **No premature framework:** the example uses browser APIs and Node's built-in test runner, so its game rules can be studied without installing a package tree.

## Extension exercise

Try changing one rule and its tests together: add a bonus for a five-catch streak, create a safe tutorial wave, or let the player choose a two-lane arena. Then run `npm test`, launch the server, and verify a full start → play → end → replay cycle at desktop and phone widths. Keep the visual language and control clarity coherent.