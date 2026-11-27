---
name: game-reference-art
description: Research visual references and source usable images, sprites, fonts, sounds, and other game assets responsibly. Use before art implementation or whenever external reference imagery/assets are requested.
---

# Game reference research and asset sourcing

Help the game look intentional without confusing inspiration with permission to reuse an image. Research with a purpose, inspect original sources, document provenance, and ship only assets whose usage is clear.

## Decide what you need before searching

Turn the request into a visual brief first:

- **Game view:** top-down, side-on, isometric, first-person, board/table, or UI-only.
- **World/mood:** place, time, tone, audience, and whether the game should feel calm, playful, tense, cozy, strange, etc.
- **Art language:** pixel, flat vector, hand-painted, geometric, low-poly, monochrome, paper-cut, or another coherent direction.
- **Readability constraint:** what must stand out during play, at what size, against what background?
- **Asset need:** inspiration only, final background, character/sprite, tileset, icon, UI, texture, font, sound, or music.

Write one concrete visual question to research. Example: “How do cozy top-down greenhouse games separate crop rows, water, and interactable objects on a phone-size screen?”

## Find references efficiently

1. Use an image-search, browser-search, or web-browsing tool that is actually available to the agent. If the user supplies reference images, inspect those first and do not upload them elsewhere.
2. Use targeted queries that combine **subject + camera/view + art medium + mood + gameplay need**. For example:
   - `top-down pixel greenhouse game readable crops water tiles`
   - `2D side view underwater arcade game silhouette hazard contrast`
   - `minimal board game HUD mobile touch controls visual hierarchy`
3. Collect a small set, usually **3–7 references**. A useful mix is 2–3 world/composition examples, 1–2 key-object/silhouette examples, and 1–2 interface examples. Fewer is better if each one answers a specific question.
4. Open the original page for every candidate. Check the creator/source, context, and license or terms if the asset might be reused. A search result, thumbnail, Pinterest repost, or AI caption is not proof of origin or permission.
5. Write down a design takeaway for each reference: e.g. “bright pickups have a dark outline,” “HUD stays in a fixed top band,” or “distant scenery uses lower contrast.” Avoid copying an entire composition or recognizable character.
6. Stop searching once the visual question is answered. Do not spend the task collecting a moodboard instead of making the game.

If no browsing/image tools exist, say that references could not be fetched. Continue with an original direction, use assets already present in the project, or ask the user to provide references when visual fidelity is central. Never claim to have opened or compared images without actually doing so.

## Distinguish three kinds of material

### 1. Inspiration references

Examples include screenshots, illustrations, photographs, and other games used to understand mood, contrast, composition, or interface hierarchy.

- Treat these as research, not automatically as game assets.
- Prefer storing source URLs and short written takeaways over copying reference files into the repository.
- Do not reproduce a protected game's exact characters, logos, screenshots, unique art, or recognizable UI. Translate broad qualities into an original design.
- If a reference image itself must be stored for a private project board, check its terms first and keep it out of shipped public assets unless reuse is allowed.

### 2. Production assets from a source

These are files that ship in the game: sprites, backgrounds, icons, textures, fonts, sound effects, and music.

- Visit the creator's original asset page and read the exact license or terms for that individual asset. Do not assume all items on a site have the same license.
- Confirm the license permits the intended use: modification, redistribution in a game, commercial use if relevant, and attribution requirements. Notice NonCommercial, NoDerivatives, ShareAlike, seat, platform, and subscription restrictions.
- If the license is missing, unclear, incompatible, or only visible in a third-party repost, do not ship the asset. Ask the user or make an original substitute.
- Do not rip assets from commercial games, extract from executables, bypass paywalls/logins, scrape a site, or hotlink an image from a search result.
- Prefer assets already in the repository, user-provided files, clearly licensed sources, or custom-generated/hand-drawn assets. Even permissive asset packs need per-asset credit checks.
- Download/copy allowed assets into the project's established local asset directory. Local files make builds reliable and keep the game working offline; avoid runtime dependencies on arbitrary remote image URLs.
- Preserve license/readme files when provided. Track source, creator, license, and modifications in `ASSET_CREDITS.md` at the project root when external assets ship.

A permissive label such as “free” does not tell you the license. Search filters are useful for discovery only; the original asset page is the authority. If a license is not understandable, don't guess.

### 3. Generated or original assets

If an image-generation or drawing tool is available and suitable, create assets only when they improve the result or the user asked for them. Make each asset fit the established direction:

- Describe camera angle, silhouette, palette, lighting, material, outline, transparency/background, and target dimensions.
- Request one asset per file, not a collage/sprite sheet unless a sprite sheet is explicitly needed.
- Keep interface text out of generated art; render game text as real HTML/canvas text so it stays crisp and translatable.
- Check output for malformed shapes, unwanted text, inconsistent perspective, alpha edges, and mismatched palette before use.
- Keep prompts and source/provenance notes when required by the project; do not claim a generated output is a reference from a real artist.

When no image tooling is available, original Canvas, SVG, CSS, or simple drawn shapes can be a deliberate art style—not a reason to paste in unlicensed art.

## Inspect and prepare selected assets

Before wiring an asset into the game, check:

- It is the right object, view, resolution, aspect ratio, and style for the game.
- Transparent assets actually have the expected alpha channel; sprite sheets have known frame bounds and order.
- The image is not too large for its on-screen use; compress or resize only when permitted and practical.
- Fonts support the required characters and load locally; include a sensible fallback.
- Audio format, duration, loop points, and volume suit gameplay; avoid startling peaks and overly long files.
- Loading has a fallback so a missing image/audio file does not break the whole game.
- Contrast and silhouette remain clear at the actual gameplay size, not only when zoomed in.

Use meaningful filenames and the existing project structure. Do not scatter assets at the root or create a giant mixed folder. Avoid adding a dependency for a single asset format unless necessary.

## Record what was researched and shipped

Use `templates/asset-register.md` as a starting point when a project needs source tracking. Keep two lists distinct:

1. **References only:** source page, what the reference taught, and confirmation that it is not being shipped.
2. **Included assets:** local file, asset/creator, original source URL, exact license, required attribution, modifications, and where credits are displayed.

For a project that ships external assets, add a visible credits/about panel when practical and a root `ASSET_CREDITS.md` with full source details. Do not make up artist names or license terms. If the game uses only original code-drawn art, there is no need to create an empty credits file.

## Handoff checklist

- [ ] The search question was specific and the reference set was small.
- [ ] Original source pages were inspected for anything being reused.
- [ ] Inspiration is separated from production assets.
- [ ] Each shipped external asset has a checked, compatible license and required credit.
- [ ] Assets load locally, look right at game size, and have a fallback where needed.
- [ ] The game has an original coherent direction instead of a copied screenshot or arbitrary collage.
- [ ] The user is told if visual research or license verification could not be completed.