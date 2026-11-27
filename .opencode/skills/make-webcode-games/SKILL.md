---
name: make-webcode-games
description: Design, build, polish, and locally run a complete browser game in the target project's existing stack. Use for a new web game or a substantial prototype-to-game upgrade.
---

# Make Webcode Games

Deliver a finished, enjoyable browser game—not only a plan, a static mockup, or an isolated mechanic. Work in the existing project, make the game playable end to end, verify what you can, and leave its local development server running when the environment supports it.

## Operating rules

- **Inspect before editing.** Read `AGENTS.md`, relevant project instructions, the app entry points, package scripts, existing architecture, assets, and tests. Preserve unrelated work and project conventions.
- **Make progress, not ceremony.** For ordinary missing details, make a sensible, reversible choice and continue. Ask only when an answer would materially change the game or its safety/rights.
- **Build the whole path.** Start → play → meaningful ending → replay must work. A screenshot, a TODO, or a list of suggested changes is not a completed game.
- **Keep dependencies earned.** Use the stack already in the repository. Add packages only when they solve a real problem better than a small native solution; keep the lockfile consistent.
- **Tell the truth.** Report only tests, browser checks, reference research, and server startup that actually happened.

## End-to-end workflow

### 1. Inspect the project and choose a small target

1. Read local agent instructions and inspect the repository before making a plan.
2. Identify the framework, package manager from lockfiles, entry point, dev/build/test scripts, current assets, and how the app is expected to run.
3. Check whether a playable game already exists. Extend it instead of replacing it.
4. Define the smallest complete experience that matches the request: one hook, one core loop, a complete session, and a few high-impact polish details.

If the repository is empty, choose a simple, maintainable browser setup that fits the request. Do not scaffold a large framework for a tiny static game without a clear benefit.

### 2. Research visual references and assets when they add value

Use the `game-reference-art` skill for image research, visual references, sprite/audio/font sourcing, or license questions. Do this before detailed art implementation when the game has a specific setting, art style, character, world, or UI identity.

- First write a visual question to answer, such as “How can a tiny night-market playfield stay readable on a phone?” Do not search vaguely for “cool game art.”
- If image search or web browsing is available, find a small, deliberate set of references: usually 3–7 items across the world/composition, important objects, and UI. Open the original source page, not just a thumbnail.
- Separate **inspiration** from **production assets**. A reference screenshot can teach composition or contrast; it is not automatically licensed to ship in the game.
- Record useful source links and design takeaways. Only put actual production files into the project after checking their source and license. Use the project's established asset directory and add an `ASSET_CREDITS.md` when external assets require tracking.
- If no research tools are available, say so internally, use user-provided/licensed assets or an original CSS/Canvas/SVG direction, and keep moving. Do not pretend to have inspected images.

### 3. Define the game before building it

Settle these essentials, in a short brief if useful:

- **Hook:** what is distinctive in one sentence?
- **Player verbs:** what can the player do, and with what input?
- **Core loop:** what interesting decision repeats every few seconds?
- **Goal and stakes:** how does a run end, and what counts as success or failure?
- **First minute:** how does the player learn by playing rather than reading a wall of text?
- **Visual direction:** mood, palette, shape language, and the references or original assets that support it.
- **Scope:** what is the smallest complete version that still feels intentional?

Use `game-design` for an unclear idea, weak loop, scope, or balance question. Prefer one memorable mechanic and a complete short session over a pile of unfinished features.

### 4. Implement deliberately and cleanly

Use `web-game-engineering` for runtime, input, timing, rendering, or responsive-canvas decisions. Read `references/coding-playbook.md` in this skill folder when the game needs a multi-file architecture, typed state, a real-time loop, asset loading, or nontrivial rules. If this pack's `examples/glowkeeper/` is present, use it as a concrete reference for clean browser code and a complete game—but adapt its patterns instead of copying its theme or architecture blindly.

- Keep game rules, input translation, rendering, and presentation distinguishable. The renderer displays state; it must not secretly change the simulation.
- Have one source of truth for score, lives, level, and screen state. Use explicit transitions for title, playing, paused, game-over, and victory as applicable.
- Use meaningful names, small cohesive functions, and project-native types/linting. Put tunable gameplay values in named constants rather than scattering mystery numbers.
- Keep the solution appropriately sized. A tiny game can be a few clear files; a growing game should not become one unreviewable component or one giant script.
- Handle loading and failure of assets, listeners, timers, and animation loops. Clean them up when the game view is removed or restarted.
- Add tests for important rules or deterministic helpers when the project has a test setup. Run checks incrementally; do not wait until the end to discover a broken build.

### 5. Complete the playable experience

Implement all of these where they fit the game:

1. A clear start/title state with a concise objective and visible controls.
2. Responsive gameplay with real rules, visible progress, and immediate feedback.
3. A real win, loss, or session-end state with results where useful.
4. A working restart/replay path that resets every part of the run, including entities, timers, input, and effects.
5. Pause/resume when the game length or interaction makes it useful.

Do not leave fake buttons, inert upgrades, placeholder instructions, or dead-end screens. Make the first action obvious and do not punish the player before they can understand the rules.

### 6. Give it a coherent identity and feel

- Apply one visual direction consistently to the playfield, HUD, menus, overlays, effects, and controls.
- Keep the action readable at a glance. Important actors, hazards, targets, and pickups need distinct silhouettes or states; do not rely on color alone.
- Acknowledge movement, hits, pickups, score, danger, success, and failure with appropriate feedback. Effects should reinforce the real state and never hide important play.
- Make the interface feel designed for this game, not like a generic landing page. Avoid random emoji, unrelated icon styles, and decorative clutter as substitutes for art direction.
- Make sound optional and user-controlled. Never autoplay it.

Use `game-polish` for visual direction, game feel, feedback, or UI hierarchy.

### 7. Verify, then launch a local preview

Use `web-game-quality` for a full quality pass. Run the relevant project checks, then start the actual game locally and leave the server running if the environment permits. Read `references/local-preview.md` for safe, reliable server handoff details.

At minimum:

- Run relevant build, lint, type-check, and test commands that exist in the target project.
- Walk through start → play → end → replay. Check controls, resize at least once, and inspect console/network errors if browser tools are available.
- Start the existing `dev` or equivalent script; use the matching package manager and don't replace project scripts. For a plain static page with no dev server, a simple static HTTP server is enough.
- Start the long-running server in the environment's background-process mode rather than blocking the coding session. Bind to `0.0.0.0` when required for a sandbox preview; use the framework's supported host flag and allow only the preview host needed. Do not disable host protections globally.
- Confirm the server actually started and report its actual local/preview URL. Keep it running for the user unless they asked not to. If this environment cannot keep processes alive, give the exact run command and say why no live URL is available.
- Do not kill a process you did not start. If the preferred port is occupied, identify the conflict and select a free supported port.

A successful production build is not the same as a running preview. Never claim the game is live unless the server process and route were confirmed.

## Final quality bar

Before finishing, confirm that:

- The premise, core loop, goal, controls, and end condition are understandable.
- A player can start, learn, play, finish, and replay without developer intervention.
- The HUD reflects actual game state, controls respond, and resets are complete.
- The experience is readable and usable at phone and desktop sizes.
- Visual references and shipped assets have been handled and credited appropriately.
- Existing project conventions are respected and relevant checks have been run.
- A local dev server is left running when supported, and the user receives its real URL.

Finish with a concise summary: what changed, how to play, checks actually run, the local preview URL, and any known limitation. When specialist skills are available, load only the ones useful to this task; keep moving toward a playable result.