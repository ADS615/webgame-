---
name: web-game-engineering
description: Implement browser-game runtime systems in an existing web project. Use for animation loops, Canvas or DOM rendering, state, input, collision, resizing, and performance decisions.
---

# Web game engineering

Build a runtime that is predictable, easy to change, and friendly to the browser. Fit the project's existing stack. Use the least complicated architecture that supports the requested game.

## Choose the rendering surface

- **DOM and CSS:** menus, turn-based games, card/board games, text-heavy UI, and small scenes with a modest number of independent elements. Prefer semantic controls for interactive UI.
- **Canvas 2D:** many moving objects, custom real-time effects, or a scene where drawing each frame is simpler than maintaining many DOM nodes. Keep accessible instructions, status, and controls in HTML around it.
- **SVG:** crisp scalable diagrams, maps, vector pieces, or a scene with a manageable number of addressable objects.
- **WebGL or a game framework:** use when the visual/performance needs genuinely justify the setup, or when the repository already uses it.

Avoid a second render loop, redundant game state, or a framework migration without a clear payoff.

## Separate the important responsibilities

Keep these concerns distinguishable, even in a small game:

- **Model:** authoritative values such as position, velocity, score, health, and timers.
- **Update:** rules and state transitions, given an elapsed time and current input.
- **Render:** draw the current model without secretly advancing the simulation.
- **Input:** translate browser events into game actions; do not scatter key checks through every object.
- **UI/state:** title, playing, paused, game-over, and victory screens, if applicable.

Start with plain functions and small data structures. Add classes, managers, or a game-engine abstraction only when they reduce complexity. Keep rules easy to test without a browser when practical.

## Timing and animation

- Use one `requestAnimationFrame` loop for a custom real-time canvas game. Store and cancel its frame handle when the game is disposed.
- Derive movement from elapsed time, not frame count. Clamp unexpectedly large frame deltas after tab switching.
- Use a fixed simulation step with an accumulator when stable physics or collision matters; interpolate rendering only if needed. For simple arcade motion, a clamped variable step is often enough.
- Pause or reset timing on `visibilitychange` so a backgrounded tab does not cause a giant simulation step.
- Keep update logic and drawing separate. Never rely on a particular monitor refresh rate.
- Remove listeners, timers, audio nodes, and animation callbacks during teardown or when replacing the game view.

## Input handling

- Map physical events to a small set of game actions so keyboard, pointer, and touch can share gameplay logic.
- Track held keys with `keydown`/`keyup` for continuous actions; handle blur and page visibility so keys cannot remain stuck.
- Ignore repeated keydown events for one-shot actions. Prevent browser defaults such as page scrolling only while the relevant game surface is active and handling that key.
- Use pointer events for mouse, pen, and touch where appropriate. Use pointer capture for drags that must continue outside the original target.
- Make touch targets large and forgiving. Keep the rest of the page scrollable; apply `touch-action: none` only to the active play surface if required.
- Do not use `keypress` for modern game input. Avoid global shortcuts that break typing or browser navigation.

## Canvas sizing and drawing

- Keep a logical game coordinate system separate from CSS layout size.
- Resize the backing store for device-pixel ratio when crisp rendering matters; cap the ratio if very high-DPI canvases become expensive. Update the transform when size or ratio changes.
- Use `ResizeObserver` or a well-managed resize handler and clean it up. Preserve the intended aspect ratio or deliberately reflow the world instead of stretching everything accidentally.
- Reuse images, gradients, paths, and offscreen layers when useful. Avoid creating arrays, DOM elements, or expensive assets unnecessarily in a hot per-frame loop.
- Keep a coherent layer order and make collision geometry agree with what the player sees.

## State, collision, and randomness

- Make transitions explicit. A restart must reset the full run: entities, score, timers, cooldowns, particles, input state, and any random seed you own.
- Choose collision shapes that fit the game; simple AABB or circle tests are often sufficient. Avoid invisible edge cases and favor forgiving hitboxes when that supports the intended feel.
- Clamp or validate values at boundaries. Handle zero-size viewports and missing assets without crashing the entire page.
- Use a seeded random source if a repeatable level or deterministic test is valuable. Keep random generation separate from draw code.
- Use object pooling only after profiling or when allocation pressure is actually a problem.

## Keep UI and simulation in sync

- The game model is the source of truth. Score, lives, timers, and state labels must reflect it.
- Update DOM UI on meaningful state changes or at a sensible cadence—not by rebuilding the entire DOM tree each animation frame.
- Keep focus behavior intentional when switching between menus, overlays, and the game surface.
- Prefer semantic HTML for buttons, settings, and instructions even when the playfield is canvas-rendered.

## Quick engineering review

- Does the game behave similarly at 30, 60, and high-refresh rates?
- What happens when the tab is hidden, the viewport changes, or the player loses focus?
- Can the player restart without stale timers, input, or duplicate loops?
- Do touch and keyboard actions reach the same game rules?
- Is expensive work kept out of the hot path?
- Can the runtime be removed cleanly when navigation or component unmounting occurs?
