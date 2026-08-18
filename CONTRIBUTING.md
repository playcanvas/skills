# Contributing

Contributions should improve a repeatable PlayCanvas Engine workflow or correct a package contract.
Open an issue first for new product areas or new skills so the scope and trigger boundary can be
agreed before implementation.

## Skill changes

- Keep canonical guidance agent-agnostic under `plugins/engine/skills/`.
- Put surface-specific details in the existing Direct Engine, React, or Web Components reference.
- Prefer installed package declarations, exports, shipped scripts, and official examples over copied
  snippets or assumed latest APIs.
- Keep `SKILL.md` concise and imperative. Add scripts only for deterministic work that agents would
  otherwise reimplement.
- Add a regression test and an evaluation case for every non-trivial behavior change.

## Checks

Run the repository suite and package audit:

```sh
node --test test/*.test.mjs
node scripts/audit-packages.mjs
```

Validate every skill and the marketplace before opening a pull request:

```sh
for skill in plugins/engine/skills/*; do
    uvx --from skills-ref==0.1.1 agentskills validate "$skill"
done
claude plugin validate --strict .
```

Pull requests should explain the user-visible failure or workflow being improved, identify the
package versions checked, and include numbered manual smoke-test steps with expected results when
runtime behavior changes.
