# Repository guidance

This repository is the OpenCode skill pack **Make Webcode Games**. Its deliverables are the skill instructions in `.opencode/skills/`, their supporting references, the templates, the skill validator, and the runnable `examples/glowkeeper/` reference game.

When changing this repository:

- Keep every skill in `.opencode/skills/<folder-name>/SKILL.md` and start it with YAML frontmatter containing non-empty `name` and `description` fields.
- Keep the `name` in frontmatter identical to its folder name, and make the description useful for deciding when to load the skill.
- Keep the main game-making skill as the orchestrator; use focused skills and reference documents for specialist guidance.
- Give practical instructions for real target projects: inspect first, respect existing stack, build a complete play path, handle image/asset provenance, run relevant checks, and start a local preview when possible.
- Do not prescribe one framework or add dependencies without a reason. Keep instructions adaptable and honest about unavailable tools.
- Keep image inspiration separate from production assets. Never claim license/source verification that did not happen.
- Update the README and templates when the skill set or recommended workflow changes.
- Run `python3 scripts/validate_skills.py` after changing skills.
