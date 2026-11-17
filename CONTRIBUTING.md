# Contributing

Contributions should improve a repeatable PlayCanvas Engine workflow or correct a package contract.
Open an issue first for new product areas or new skills so the scope and trigger boundary can be
agreed before implementation.

## Skill changes

- Keep canonical guidance agent-agnostic under `plugins/playcanvas/skills/`.
- Put surface-specific details in the existing Direct Engine, React, or Web Components reference.
- Prefer installed package declarations, exports, shipped scripts, and official examples over copied
  snippets or assumed latest APIs.
- Keep `SKILL.md` concise and imperative. Ship no scripts: the plugin folder holds only Markdown,
  text, JSON, YAML, and images.
- Add the smallest repeatable proof for non-trivial behavior.
- When adding or removing a skill, update its README entry and the explicit `skills` inventory in
  `plugins/playcanvas/.claude-plugin/plugin.json`.

## Checks

Install dependencies and run the repository suite:

```sh
cd test
npm ci
npm test
```

This runs the skill tooling tests, validates every host manifest and marketplace, and compiles the
Direct Engine, React, and Web Components examples against pinned packages.

Validate every skill against the Agent Skills specification before opening a pull request:

```sh
for skill in plugins/playcanvas/skills/*; do
    uvx --from skills-ref==0.1.1 agentskills validate "$skill"
done
```

Test dependencies live in `test/package.json` so the plugin folder ships no lockfile and plugin
installs fetch no packages.

Pull requests should explain the user-visible failure or workflow being improved, identify the
package versions checked, and include numbered manual smoke-test steps with expected results when
runtime behavior changes.

## Releases

Run the **Publish** workflow from `main` in GitHub Actions and choose `patch`, `minor`, or `major`.
It bumps `package.json` and every plugin manifest, pushes the release commit and tag, and creates
the GitHub release. It then commits `plugins/playcanvas/` as the root of the `directory` branch,
which the Anthropic Directory tracks; never edit that branch by hand.
