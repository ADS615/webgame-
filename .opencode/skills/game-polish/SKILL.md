---
name: game-polish
description: Improve a browser game's visual identity, readability, feedback, animation, and overall feel. Use for a polish pass or when the mechanics work but the experience still feels generic or flat.
---

# Game polish

Polish should make the game easier to read and more satisfying to play. Add clarity and character before adding decoration. Keep the style consistent with the game idea and existing project.

## Establish a visual direction

Write a one-line art direction: mood, palette, shapes, and visual reference in plain words. Then apply it consistently to the playfield, HUD, menus, controls, overlays, and effects.

- Choose a small palette with clear roles: background, primary surface, text, action/accent, and distinct success/danger states.
- Establish a type hierarchy: title, key status, supporting labels. Use readable sizes and weights; do not rely on tiny all-caps labels for important information.
- Give the play area a strong focal point and enough breathing room for the action.
- Make players, enemies, hazards, goals, and pickups distinguishable by silhouette, scale, motion, or pattern—not color alone.
- Match the rendering style across assets. If no asset pipeline exists, intentional shapes, gradients, and CSS can look better than inconsistent stock imagery.
- Avoid random emoji, unrelated icon styles, placeholder gradients, and decorative clutter that competes with gameplay.

## Make feedback immediate

For every important player action, check for an immediate, understandable response. Consider the smallest combination that suits the moment:

- **Movement:** easing, anticipation, a trail, or a subtle camera response.
- **Hit or collision:** clear impact flash, shake used sparingly, sound, or a brief freeze-frame.
- **Pickup or score:** burst, count-up, highlight, or a concise label.
- **Danger:** a readable warning, timing cue, or state change before punishment.
- **Success/failure:** a decisive transition, result summary, and obvious next action.

Feedback must reflect the actual game state. Avoid effects that hide a hazard, block input, or trigger endlessly. Keep camera shake and flashes mild and respect reduced-motion preferences.

## Give the interface hierarchy

- Make the primary action visually obvious.
- Keep score, time, lives, and objective visible only when they help the current decision.
- Place controls and short rules close to the relevant action.
- Use consistent spacing, borders, corner treatment, shadows, and focus states.
- Use semantic buttons for start, pause, restart, and settings. Give hover, pressed, disabled, and keyboard-focus states where appropriate.
- Make touch targets comfortable and prevent the HUD from overlapping the play area on narrow screens.

## Use sound with care

Sound is optional polish, not a requirement. If it helps:

- Start audio only after a clear user gesture; never autoplay.
- Provide a visible mute/volume control and remember its current state for the session.
- Keep sounds short and distinct. Avoid playing a sound every frame or stacking noisy effects.
- Use Web Audio only when the project can support it cleanly; otherwise keep the game silent or reuse appropriate existing assets.

## Motion and performance

- Prefer short, purposeful transitions and easing over constant movement.
- Keep animation aligned with the game's timing; do not add motion that makes targeting or reading harder.
- Use CSS transforms/opacity for UI motion where possible. Avoid layout thrashing and unnecessary large blur/filter effects.
- Provide a reduced-motion path via `prefers-reduced-motion` and/or an in-game setting if motion is central.
- Keep effects bounded and clean them up. A particle effect should communicate something, not merely consume screen space.

## Final polish pass

Play one complete run and ask:

- Can a new player spot the goal, player, threats, and controls at a glance?
- Is every important action acknowledged quickly?
- Does the interface look designed for this specific game?
- Is any animation distracting, any text hard to read, or any effect hiding useful information?
- Does the ending feel complete, and is replay easy to find?

Fix the highest-impact clarity or feedback issue first. A few well-chosen details beat a dozen unrelated effects.