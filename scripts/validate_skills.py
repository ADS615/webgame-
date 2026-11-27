#!/usr/bin/env python3
"""Validate the lightweight OpenCode skill format used by this repository."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILLS_DIR = ROOT / ".opencode" / "skills"
FIELD_RE = re.compile(r"^(name|description):\s*(.*?)\s*$")


def parse_skill(path: Path) -> tuple[str | None, str | None, list[str]]:
    errors: list[str] = []
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()

    if not lines or lines[0].strip() != "---":
        return None, None, ["missing YAML frontmatter opening delimiter"]

    try:
        end = next(index for index in range(1, len(lines)) if lines[index].strip() == "---")
    except StopIteration:
        return None, None, ["missing YAML frontmatter closing delimiter"]

    fields: dict[str, str] = {}
    for line_number, line in enumerate(lines[1:end], start=2):
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        match = FIELD_RE.match(line)
        if not match:
            errors.append(f"unsupported or malformed frontmatter at line {line_number}: {line!r}")
            continue
        key, value = match.groups()
        if key in fields:
            errors.append(f"duplicate frontmatter field {key!r}")
        fields[key] = value.strip().strip("\"'")

    name = fields.get("name")
    description = fields.get("description")
    body = "\n".join(lines[end + 1 :]).strip()

    if not name:
        errors.append("frontmatter must contain a non-empty name")
    if not description:
        errors.append("frontmatter must contain a non-empty description")
    if not body:
        errors.append("skill instruction body is empty")
    if name and not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", name):
        errors.append(f"name {name!r} must be lowercase kebab-case")
    if name and name != path.parent.name:
        errors.append(f"name {name!r} does not match folder {path.parent.name!r}")

    return name, description, errors


def main() -> int:
    if not SKILLS_DIR.is_dir():
        print(f"ERROR: skills directory not found: {SKILLS_DIR.relative_to(ROOT)}")
        return 1

    files = sorted(SKILLS_DIR.glob("*/SKILL.md"))
    if not files:
        print("ERROR: no .opencode/skills/*/SKILL.md files found")
        return 1

    seen_names: dict[str, Path] = {}
    failures = 0
    for path in files:
        name, _description, errors = parse_skill(path)
        relative = path.relative_to(ROOT)
        if name:
            previous = seen_names.get(name)
            if previous:
                errors.append(f"duplicate skill name also used in {previous.relative_to(ROOT)}")
            else:
                seen_names[name] = path

        if errors:
            failures += len(errors)
            for error in errors:
                print(f"ERROR: {relative}: {error}")
        else:
            print(f"OK: {relative}")

    if failures:
        print(f"\nValidation failed with {failures} issue(s).")
        return 1

    print(f"\nValidated {len(files)} OpenCode skill(s).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
