# Browser game playtest checklist

Run these checks after implementing or polishing a game. Mark an item “not applicable” only when the game genuinely has no such behavior.

## Start and learn

- [ ] The game loads without an error or missing core asset.
- [ ] The goal and controls are easy to find.
- [ ] Start/confirm works with keyboard and pointer/touch.
- [ ] No audio plays before a user gesture.

## Play

- [ ] Every displayed control works and has a visible response.
- [ ] The HUD reflects the actual score, time, lives, and state.
- [ ] Important objects and hazards are readable without relying on color alone.
- [ ] The browser does not steal active game keys or scroll unexpectedly.
- [ ] The game remains usable while resizing; try a narrow phone-like and a wide viewport.
- [ ] Switching tabs or losing focus does not leave stuck input or a huge simulation jump.

## Finish and replay

- [ ] A win/loss/session-end state can be reached.
- [ ] The result is clear and offers a sensible next action.
- [ ] Restart resets the entire run and does not duplicate timers or animation loops.
- [ ] Pause/resume works if present.

## Comfort and accessibility

- [ ] Buttons are semantic, labelled, keyboard reachable, and visibly focused.
- [ ] Text and important statuses are readable at typical screen sizes.
- [ ] Touch targets are comfortable and nonessential animation respects reduced motion.
- [ ] Audio has an obvious mute/volume choice if sound is used.
- [ ] Essential instructions and status are available outside a canvas where practical.

## Local preview and checks

- [ ] The project's relevant build/test/lint/type-check commands were run.
- [ ] The development server was started and kept running when the environment supports it.
- [ ] The served page/route was opened or smoke-tested at the real URL from server output.
- [ ] The final response gives the verified URL and only claims checks that actually ran.

## Notes

- Build / lint / tests:
- Local server command and URL:
- Browser or manual checks:
- Known unverified areas:
