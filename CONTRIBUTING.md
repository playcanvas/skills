# Contributing

Contributions should improve a repeatable PlayCanvas Engine workflow or correct a package contract.
Open an issue first for new product areas or new skills so the scope and trigger boundary can be
agreed before implementation.

## Skill changes

- Keep canonical guidance agent-agnostic under `skills/`.
- Put surface-specific details in the existing Direct Engine, React, or Web Components reference.
- Prefer installed package declarations, exports, shipped scripts, and official examples over copied
  snippets or assumed latest APIs.
- Keep `SKILL.md` concise and imperative. Add scripts only for deterministic work that agents would
  otherwise reimplement.
- Add the smallest repeatable proof for non-trivial behavior.
- When adding or removing a skill, update its README entry and the explicit `skills` inventory in
  `.claude-plugin/plugin.json`.

## Checks

Install dependencies and run the repository suite:

```sh
npm ci
npm test
```

This runs the skill tooling tests, validates every host manifest and marketplace, and compiles the
Direct Engine, React, and Web Components examples against pinned packages.

Validate every skill against the Agent Skills specification before opening a pull request:

```sh
for skill in skills/*; do
    uvx --from skills-ref==0.1.1 agentskills validate "$skill"
done
```

Pull requests should explain the user-visible failure or workflow being improved, identify the
package versions checked, and include numbered manual smoke-test steps with expected results when
runtime behavior changes.
