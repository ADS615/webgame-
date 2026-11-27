# Coding playbook for browser games

This is a set of practical defaults, not a mandate to rewrite every game into the same architecture. Follow the target project's framework and size the design to the game. A 100-line puzzle should stay simple; a real-time game with a HUD, assets, and several screens deserves boundaries.

If this skill pack's `examples/glowkeeper/` is present, read its README and trace one path through `src/main.js`, `src/model.js`, `src/input.js`, and `src/render.js` before making a new architecture. It is a concrete dependency-free example, not a library to copy blindly. When the example isn't present in the target project, use the patterns below.

## 1. Make an implementation plan that can be played early

Before writing code, map the playable path:

```text
load → title/instructions → start → core loop → win/loss → replay
```

List the rules and state that must exist for that path. Implement in this order:

1. Static app shell and game area.
2. Start/restart controls and explicit screen states.
3. One core player action and immediate feedback.
4. The central rule, score/progress, and win/loss condition.
5. Input alternatives and responsive layout.
6. Assets, animation, sound, and secondary polish.
7. Tests, bug fixes, and local preview.

After every meaningful slice, run the shortest relevant project check. Get a playable graybox working before investing in detailed art. Never leave the game in a state where only the title screen looks finished.

## 2. Use boundaries that match the size of the game

For a growing game, a useful division is:

```text
src/game/
  model.ts       // Game state, entity types, and named tuning constants
  input.ts       // Browser events translated to game actions
  update.ts      // Rules, movement, timers, collisions, and transitions
  render.ts      // Draws the current state; no game-rule side effects
  assets.ts      // Loading, reuse, fallback, and disposal of assets
  GameView.tsx   // UI/framework lifecycle, semantic controls, canvas hookup
```

Adapt names and file count to the repository. Keep a very small game in fewer files if separate modules would add ceremony. Keep component lifecycle outside the simulation so a render-framework update cannot accidentally create another animation loop.

## 3. Model state explicitly

Represent valid screen states as a finite set rather than a collection of unrelated booleans. For example, prefer `screen: 'title' | 'playing' | 'paused' | 'won' | 'lost'` over `isPlaying`, `isPaused`, `hasWon`, and `hasLost` that can contradict one another.

A compact model may look like:

```ts
type Screen = 'title' | 'playing' | 'paused' | 'won' | 'lost';

type GameState = {
  screen: Screen;
  elapsedSeconds: number;
  score: number;
  lives: number;
  player: { x: number; y: number; vx: number; vy: number };
  targets: Target[];
};

type InputFrame = {
  left: boolean;
  right: boolean;
  actionPressed: boolean; // one-frame edge, not a permanently held key
  pointerX?: number;
};
```

Use the game's model as the source of truth. DOM labels, canvas elements, score, and result screens should reflect it rather than keeping independent copies. Centralize meaningful transitions (`startRun`, `finishRun`, `restartRun`) so a restart resets every run-specific field.

## 4. Separate rules from drawing

`update` changes game state based on input and elapsed time. `render` reads that state and draws it. Rendering the same state twice should not advance score, move an enemy, generate random objects, or fire a collision event.

For deterministic rules, keep calculations in small testable functions. Examples include `movePlayer`, `resolveCollision`, `awardPickup`, `advanceWave`, and `isGameOver`. When randomness matters, inject or seed the random source so a bug or test can be reproduced.

Do not create redundant state for values that can be derived cheaply and clearly. Do cache genuinely expensive drawing resources (images, gradients, static layers) rather than re-creating them in every frame.

## 5. Treat time and lifecycle correctly

Use seconds, not frames, for motion and cooldowns. For a simple arcade game, a clamped elapsed time can be enough:

```ts
const MAX_FRAME_SECONDS = 0.05;
let previousMs: number | undefined;
let frameHandle = 0;

function frame(nowMs: number) {
  const rawSeconds = previousMs === undefined ? 0 : (nowMs - previousMs) / 1000;
  previousMs = nowMs;
  const dt = Math.min(rawSeconds, MAX_FRAME_SECONDS);

  if (state.screen === 'playing') updateGame(state, input.snapshot(), dt);
  renderGame(context, state);
  frameHandle = requestAnimationFrame(frame);
}

function dispose() {
  cancelAnimationFrame(frameHandle);
  input.dispose();
  resizeObserver.disconnect();
  // Clear timers and audio resources owned by this game too.
}
```

This is an illustrative pattern; adapt the lifecycle to the framework. Set/reset `previousMs` when starting or resuming, pause or normalize timing when the tab is hidden, and cancel the exact frame handle you own. If physics needs stable steps, use a fixed-step accumulator; do not add one automatically to a simple game.

A game view mounted twice must not create duplicate listeners, timers, or RAF loops. Clean up every listener and resource. On window blur, release held inputs so the player cannot get stuck moving.

## 6. Make input a deliberate translation layer

Browser keys, pointer events, and touch should map to game actions; the game rules should not care whether “move left” came from A, ArrowLeft, a virtual pad, or a swipe.

- Track held state for continuous movement, and separate just-pressed edges for actions such as start, dash, or confirm.
- Ignore key repeat for one-shot actions.
- Handle `keyup`, `blur`, and `visibilitychange` so keys cannot stick.
- Prevent browser defaults only for relevant keys while the focused game is actively handling them. Do not break normal page navigation or text entry.
- Use Pointer Events for mouse/pen/touch where possible. Capture the pointer for drags that must continue outside the starting button.
- Keep touch controls forgiving and visibly discoverable. Do not require hover on a touch device.
- Make keyboard focus visible and restore/advance focus sensibly after title, pause, and end overlays.

## 7. Scale the world and canvas intentionally

Keep logical game coordinates separate from CSS pixels. Decide whether resizing preserves world coordinates, rescales the world, or changes the visible play area; document the choice in code. Never stretch a circle into an ellipse or hide the action behind an overlay by accident.

For Canvas 2D, size the backing store for the container and device-pixel ratio, cap very high DPR if memory/performance suffers, and reset the context transform after resize. Use `ResizeObserver` or a cleaned-up resize handler. Keep the canvas responsive in CSS and supply adjacent semantic HTML for instructions and important status.

For DOM scenes, avoid replacing the whole tree every frame. Update focused values at a sensible cadence and let CSS handle layout and short UI transitions. Prefer grid/flex and constrained aspect ratios over dozens of absolute-positioned values when the scene needs to adapt to phones.

## 8. Load assets without making the game fragile

- Load images/audio/fonts once and reuse them. Start gameplay only when required assets are ready, or provide a deliberate fallback.
- Handle failed loads visibly and safely; one missing decorative image should not crash the game.
- Use the exact local path and filename that exist; case mismatches often work on one machine and fail on another.
- Keep large image decode and audio setup out of the hot render loop.
- For sprite sheets, centralize frame size/order and test the frame bounds.
- For fonts, keep a system fallback. For audio, wait for a user gesture and expose mute.
- Do not ship remote image-search URLs as production assets.

For acquisition and credits, load the `game-reference-art` skill and follow its source/license checks.

## 9. Keep code easy to change

- Name gameplay constants (`PLAYER_ACCELERATION`, `ROUND_DURATION_SECONDS`) and group the tuning values a designer will adjust.
- Prefer a few descriptive functions to deeply nested conditionals or dense one-liners.
- Keep domain names consistent across model, UI, and tests.
- Avoid global mutable state when a game instance can own it.
- Avoid `any`, broad type assertions, swallowed errors, and `// @ts-ignore` as a shortcut in TypeScript projects. Fix the boundary or model the unknown value.
- Do not add large dependencies for something the current stack already handles.
- Comments should explain a non-obvious decision or constraint, not restate the line beneath them.
- Remove debugging output, dead code, unused assets, temporary keys, and placeholder buttons before finishing.

## 10. Test the rules and the actual experience

Test important rules at the simplest appropriate layer. Examples: a pickup adds one point, collision changes state once, timer expiry ends a run, restart clears run state, and a seed produces a repeatable level. Use the repository's test framework rather than adding one without need.

Then verify in the browser: title, start, every control, a normal run, win/loss, replay, resize, pause/tab switching if applicable, and console/network errors. A type-check or build cannot tell whether a hitbox is unfair or a restart duplicates an event handler. Use `web-game-quality` and `references/local-preview.md` in the parent skill for the full handoff.