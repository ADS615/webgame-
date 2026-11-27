# Make Webcode Games

An OpenCode skill pack for designing, coding, polishing, and locally previewing complete browser games. It teaches the agent to turn an idea into a playable web experience—with a deliberate visual direction, clean code, real quality checks, and a running local preview when the host supports it.

## Skills

| Skill | What it helps with |
| --- | --- |
| `make-webcode-games` | The end-to-end workflow: inspect, design, implement, verify, and launch a game locally. |
| `game-design` | Clear game loops, rules, challenge, progression, and manageable scope. |
| `game-reference-art` | Research visual references and source production images, sprites, sounds, and fonts responsibly. |
| `web-game-engineering` | Browser game architecture, input, animation loops, rendering, and responsive behavior. |
| `game-polish` | Visual identity, readable UI, animation, and satisfying feedback. |
| `web-game-quality` | Play-flow, accessibility, mobile, performance, browser checks, and server handoff. |

The skills adapt to the target project's existing framework and conventions. They do not require one particular engine or install runtime dependencies by default.

## Use with OpenCode

Open this repository in OpenCode. Project skills are stored in `.opencode/skills/<skill-name>/SKILL.md`.

To use this pack in another project, copy this repository's `.opencode/skills/` directory into that project's `.opencode/skills/` directory. Optionally copy `examples/glowkeeper/` too if you want the agent to have the runnable reference source; the skills work without it. Then ask OpenCode to use a skill, for example:

> Use the `make-webcode-games` skill to build a small polished browser game about sorting falling stars into matching gates. Inspect the existing project first. Research a few visual references, check licenses for any assets you want to ship, implement the complete game, run the checks, and leave the local preview running.

For a visual pass, ask:

> Use `game-reference-art` to find a few useful references for a cozy pixel-art greenhouse game. Keep reference images separate from production assets, and document the source and license for anything included.

For a coding or runtime pass, ask:

> Use `web-game-engineering` and `web-game-quality` to clean up the game loop, test restart and resize behavior, and launch the project locally.

## What the main skill teaches

1. Inspect the project and choose a small, complete game concept.
2. Research a focused set of visual references, keeping inspiration separate from licensed production assets.
3. Plan the core loop, states, controls, and scope before building.
4. Implement with clear boundaries between rules, input, rendering, and UI.
5. Add a coherent art direction, feedback, responsive input, and accessibility.
6. Run the project's actual checks and verify the complete play path.
7. Start and confirm the local development server, then give the user its real URL.

## Runnable reference game

`examples/glowkeeper/` is a small, complete game showing the skill pack in practice: explicit states, isolated game rules, keyboard/pointer input, a responsive Canvas renderer, semantic HTML controls, reduced-motion support, and Node's built-in tests. The art is drawn in code, so the example has no external asset or license assumptions.

Run it without installing dependencies:

```bash
cd examples/glowkeeper
npm run check
npm test
npm run dev
```

Open the URL printed by the server. The example README maps each file to its responsibility. Treat it as a learning reference, not a framework to copy unchanged.

## Templates and references

- `templates/game-brief.md` — turn a rough idea into a compact design.
- `templates/playtest-checklist.md` — manually check the full play path and local preview.
- `templates/asset-register.md` — track visual references separately from shipped assets and their licenses.
- `.opencode/skills/make-webcode-games/references/coding-playbook.md` — concrete architecture, state, timing, input, assets, testing, and a pointer to the runnable example.
- `.opencode/skills/make-webcode-games/references/local-preview.md` — launch, verify, and hand off a local development server safely.

## Validate this skill pack

The validator uses only Python's standard library:

```bash
python3 scripts/validate_skills.py
```

It checks that each skill has OpenCode frontmatter and a non-empty instruction body.
