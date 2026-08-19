# PlayCanvas Skills

This repository ships one portable set of PlayCanvas Engine skills through Claude Code, Codex,
Cursor, and Agent Skills-compatible installers.

## Repository layout

- `skills/<name>/SKILL.md` is the canonical skill source. Every direct child of `skills/` ships.
- Surface-specific guidance belongs in a skill's `references/` directory.
- `.claude-plugin/`, `.codex-plugin/`, and `.cursor-plugin/` contain host distribution metadata.
- `.agents/plugins/marketplace.json` is the Codex marketplace manifest.
- `scripts/` and `test/` contain release, contract, and runtime verification.

Keep skills directly under `skills/`. Nested category buckets are not part of this repository's
contract because the native Codex plugin validates direct skill children.

## Skill changes

- Keep canonical guidance agent-agnostic. Do not add host-specific instructions or metadata inside
  a skill.
- Keep `SKILL.md` frontmatter to `name` and `description`; the name must match its directory.
- Prefer installed package declarations, exports, shipped scripts, and official examples over copied
  snippets or assumed APIs.
- Add deterministic scripts only when agents would otherwise need to reimplement the same work.
- When adding or removing a skill, update the top-level README and the Claude plugin's explicit
  `skills` inventory.

## Verification

Run the repository checks documented in `CONTRIBUTING.md`. At minimum, validate every skill, run the
Node test suite, and validate both the Claude and Codex plugin contracts before release.
