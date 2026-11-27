---
name: game-design
description: Turn a rough game idea into a clear, small, replayable browser-game design. Use when defining the core loop, rules, controls, challenge, progression, or scope before implementation.
---

# Browser game design

Design for a player making interesting decisions, not for a feature list. Aim for a complete, understandable game that can be learned quickly and replayed because its choices or outcomes vary.

## Start with the player experience

Write a compact brief before expanding scope:

1. **Pitch:** one sentence describing the fantasy and the twist.
2. **Audience and session:** who is this for, and is a run 30 seconds, 3 minutes, or longer?
3. **Player verbs:** the small set of things the player actually does.
4. **Core loop:** action → response → consequence → next decision.
5. **Goal and stakes:** what ends a round; what does success or failure mean?
6. **Controls:** what input maps to each verb, including touch if appropriate?
7. **Difficulty and variation:** what changes over time, and what does the player learn?
8. **Signature moment:** one specific surprise, decision, or reveal the player will remember.

Use `templates/game-brief.md` when a fill-in brief would help. Keep the first playable version small enough to finish in one coherent pass.

## Make the loop legible and satisfying

- Give the player a meaningful decision frequently. If play is only waiting, tapping repeatedly, or watching an animation, add a choice or reduce the wait.
- Make cause and effect visible: the player should understand why a score changed, a life was lost, or a goal was reached.
- Introduce one rule at a time. Teach with safe early situations and short feedback, not a long tutorial overlay.
- Let challenge rise through readable pressure: speed, competing priorities, tighter timing, or more complex patterns. Avoid unfair difficulty spikes and invisible rules.
- Give failure a reason and a path back in. A restart should be immediate and preserve the player's understanding, not punish them with friction.
- Use score, time, lives, streaks, or upgrades only when they reinforce the main loop. Do not add metrics merely to fill the HUD.
- Reward mastery with new decisions, stronger feedback, or a personal best—not only a bigger number.

## Scope decisions

Separate the game into:

- **Must-have:** every system required to start, play, end, and replay.
- **Feel:** the few visual or audio details that clarify actions and make them satisfying.
- **Later:** content, modes, settings, or progression that are valuable but not needed for a complete first version.

For the first version, prefer one polished mode, a small number of understandable rules, and a real ending. Cut systems that do not improve the core loop. Don't let meta-progression, procedural generation, online scores, or elaborate lore delay a playable game.

## Design for the browser

- Put the game in the foreground quickly. The player should know what to do within a few seconds.
- State controls near the game, and show them in the context where they are needed.
- Make keyboard and touch controls direct and forgiving. Avoid requiring a mouse hover or a keyboard shortcut with no on-screen cue.
- Keep useful progress within a short session; provide a natural pause/restart point.
- Let the UI explain the rules. Use concise labels and examples; avoid paragraphs inside the play loop.
- If audio matters, make it optional and start it only after an intentional player action.

## Design review questions

Before implementation, answer:

- Can someone describe the goal after seeing one screen?
- What choice is interesting on the third repetition, not just the first?
- Is the outcome mostly controlled by readable decisions rather than surprise?
- Does difficulty change in a fair, understandable way?
- Is there a reason to replay after one completed run?
- Can the concept be completed without online services, accounts, or a large asset pipeline?

If an answer is no, simplify or sharpen the loop before adding features.