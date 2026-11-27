---
name: web-game-quality
description: Review and verify a browser game for usability, accessibility, mobile input, responsive layout, performance, and complete play flow. Use before calling a game finished or when investigating a quality issue.
---

# Web game quality

Verify the real player journey, not only whether the page compiles. Inspect the tools and browser capabilities the project actually provides; never claim a check that was not performed. For the final local server handoff, follow `make-webcode-games/references/local-preview.md` when that reference is available.

## Play-flow checklist

Walk through a full run:

1. Load the page from a clean state. Confirm it gives a useful first impression and does not start unexpectedly with sound.
2. Find the objective and controls without guessing. Start the game.
3. Exercise each advertised control. Confirm the player receives a visible response and rules update correctly.
4. Reach a win, loss, or session end. Check that the result and next action are clear.
5. Restart. Confirm score, entities, timers, audio, and controls are reset and no duplicate loop is running.
6. Pause/resume if supported. Switch tabs and return; confirm time and input recover safely.

## Input and device checks

- Check keyboard controls, focus behavior, and one-shot versus held actions.
- Check pointer/touch behavior if advertised. Test dragging outside a pointer target when relevant.
- Check that browser scrolling or text selection does not interfere with active gameplay, without disabling normal page navigation unnecessarily.
- Check a narrow viewport and a desktop/wide viewport. Verify the playfield, status, instructions, and primary action remain visible and usable.
- Test resize/orientation changes during play. Confirm the simulation neither stretches unpredictably nor resets unexpectedly unless designed to.

## Accessibility and comfort

- Use real buttons and form controls for menus and settings; label controls clearly.
- Ensure focus is visible and the game can be started/restarted without a mouse.
- Use text, icon/shape, or pattern as well as color to communicate critical states.
- Check text contrast, sizing, and legibility over the playfield.
- Avoid hover-only instructions, flashing effects, and essential timed text that disappears too quickly.
- Respect `prefers-reduced-motion` for nonessential motion. Keep flashing and camera shake restrained.
- Make audio opt-in, with an obvious way to mute it.
- For canvas-heavy games, provide surrounding HTML with instructions, key status, and controls so essential information is not available only as pixels.

## Runtime and preview checks

- Run the target project's available test, lint, type-check, and production build commands where appropriate.
- Start the actual development server and keep it running for the user when the environment supports that. Verify the real URL from server output; do not invent a `localhost` port.
- Open the served page or make an HTTP smoke request. A build passing does not prove the local server works.
- Look for runtime errors, missing assets, failed network requests, and console warnings if browser tooling is available.
- Check that restart, pause, and navigation do not leave old timers, listeners, or animation frames active.
- Check that behavior is time-based rather than tied to frame rate; guard against huge elapsed time after a hidden tab.
- Keep large asset files and new dependencies justified. Avoid per-frame DOM reconstruction and needless allocations in hot loops.
- Test empty/initial state, resize, and end state—not only the most attractive mid-game screenshot.
- Do not kill a server you did not start. Leave the task's server running unless asked to stop it.

## Reporting

Report checks precisely, for example:

- “`npm run build` passed; the dev server is running at [the verified URL]; keyboard play and replay were checked in the browser.”
- “Static checks passed. I could not launch a persistent server or browser in this environment, so I supplied the run command and mobile interaction remains unverified.”

Do not say “fully tested” when only a build was run. List any known limitation and the next check that would reduce uncertainty.