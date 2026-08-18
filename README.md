# PlayCanvas Skills

[![Version](https://img.shields.io/github/v/release/playcanvas/skills?label=version)](https://github.com/playcanvas/skills/releases/latest)
[![CI](https://github.com/playcanvas/skills/actions/workflows/ci.yml/badge.svg)](https://github.com/playcanvas/skills/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/playcanvas/skills)](LICENSE)
[![Discord](https://img.shields.io/badge/Discord-5865F2?style=flat&logo=discord&logoColor=white&color=black)](https://discord.gg/RSaMRzg)
[![Reddit](https://img.shields.io/badge/Reddit-FF4500?style=flat&logo=reddit&logoColor=white&color=black)](https://www.reddit.com/r/PlayCanvas)
[![X](https://img.shields.io/badge/X-000000?style=flat&logo=x&logoColor=white&color=black)](https://x.com/playcanvas)

Reusable, agent-agnostic skills for building polished applications with PlayCanvas Engine. They give
coding agents PlayCanvas-specific package contracts, asset workflows, scene patterns, and runtime
verification guidance without locking the project to one agent.

> [!NOTE]
> The `0.x` line is a public Engine beta. It targets Direct Engine, `@playcanvas/react`, and
> `@playcanvas/web-components`; its interfaces may tighten in response to real project feedback.

[Developer Site](https://developer.playcanvas.com/) ·
[Engine Manual](https://developer.playcanvas.com/user-manual/engine/) ·
[API Reference](https://api.playcanvas.com/engine/) ·
[Examples](https://playcanvas.com/examples/) ·
[Forum](https://forum.playcanvas.com/)

## What the skills add

- Select the active PlayCanvas authoring surface from the project instead of guessing from installed
  dependencies.
- Check installed package declarations, exports, examples, and production scripts before using an
  API.
- Inspect GLB geometry, transforms, morph defaults, clips, joints, and hierarchy offline before
  choosing placement or animation values.
- Keep gameplay roots, visual calibration, physics, effects, UI, and state ownership predictable.
- Reuse Engine capabilities such as `CameraControls`, `Water`, `ProceduralSky`, and `CameraFrame`
  with their required integrations intact.
- Finish with runtime and screenshot evidence instead of treating a successful build as visual proof.

Try prompts such as:

```text
Build a Direct Engine product viewer for these GLBs. Inspect and calibrate every model first, reuse
the shipped camera controls, and verify grounding and framing in the browser.
```

```text
Create this scene with @playcanvas/react. Keep hooks unconditional, use the installed package's
actual components, and configure the model's clips from inspected animation names.
```

```text
Turn this prototype into a polished PlayCanvas experience with deterministic ready, playing,
paused, and reset states, a state-driven HUD, pooled effects, coherent lighting, and screenshot checks.
```

## Install

### Any Agent Skills-compatible harness

List the available skills, then install them into all detected agents for the current project:

```sh
npx --yes skills add playcanvas/skills --list
npx --yes skills add playcanvas/skills --all
```

Use `-g` for a user-level installation. Start a new conversation after installing or updating so the
agent discovers the new skill metadata.

Update or remove generic installations with:

```sh
npx --yes skills update
npx --yes skills remove
```

### Claude Code and Claude Code desktop

```sh
claude plugin marketplace add playcanvas/skills
claude plugin install engine@playcanvas
claude plugin details engine@playcanvas
```

In the desktop app's Code tab, installed plugins are available under **+ → Plugins**.

```sh
claude plugin update engine@playcanvas
claude plugin uninstall engine@playcanvas
```

### Codex CLI and app

```sh
codex plugin marketplace add playcanvas/skills
codex plugin add engine@playcanvas
codex plugin list
```

```sh
codex plugin marketplace upgrade playcanvas
codex plugin remove engine@playcanvas
```

The Codex app uses the same marketplace and plugin installation.

### Cursor

For a single CLI session, load the plugin directly from a checkout:

```sh
cursor-agent --plugin-dir ./plugins/engine
```

For a persistent installation, add this repository as a plugin marketplace in Cursor or link
`plugins/engine` into `~/.cursor/plugins/local/engine`. Teams and Enterprise organizations can
publish the same marketplace to their organization.

## Supported surfaces

The skills resolve the active surface from imports and markup, then read only its matching reference:

| Surface | Packages | Coverage |
| --- | --- | --- |
| Direct Engine | `playcanvas` | bootstrap, assets, scripts, rendering, animation, physics, lifecycle |
| React | `playcanvas`, `@playcanvas/react` | React ownership, hooks, components, assets, Engine interop |
| Web Components | `playcanvas`, `@playcanvas/web-components` | declarative elements, lifecycle, assets, Engine interop |

Package contracts last verified on **2026-08-18**:

| Package | Verified version |
| --- | ---: |
| `playcanvas` | `2.21.4` |
| `@playcanvas/react` | `0.11.5` |
| `@playcanvas/web-components` | `0.15.0` |

These are verification points, not hard pins. Skills prefer the packages installed in the target
project. A scheduled audit checks the latest npm releases for every import and behavior that the
guidance relies on.

## Engine skills

| Skill | Purpose |
| --- | --- |
| [`build-app`](plugins/engine/skills/build-app/SKILL.md) | Select and structure Direct Engine, React, or Web Components applications. |
| [`apply-conventions`](plugins/engine/skills/apply-conventions/SKILL.md) | Apply stable coordinates, transforms, physics, materials, imports, and verification rules. |
| [`find-examples`](plugins/engine/skills/find-examples/SKILL.md) | Find and adapt official examples matching the installed package version. |
| [`reuse-scripts`](plugins/engine/skills/reuse-scripts/SKILL.md) | Discover and integrate production scripts shipped with the Engine. |
| [`inspect-glb`](plugins/engine/skills/inspect-glb/SKILL.md) | Measure default-pose GLB bounds, transforms, clips, joints, morphs, and hierarchy offline. |
| [`calibrate-model`](plugins/engine/skills/calibrate-model/SKILL.md) | Record stable scale, grounding, pivot compensation, and yaw for repeated models. |
| [`configure-animation`](plugins/engine/skills/configure-animation/SKILL.md) | Configure clip playback, blending, state graphs, and retargeting from inspected data. |
| [`assemble-scene`](plugins/engine/skills/assemble-scene/SKILL.md) | Compose semantic, visual, collider, physics, and effect hierarchies. |
| [`light-scene`](plugins/engine/skills/light-scene/SKILL.md) | Build coherent lighting, exposure, shadows, reflections, water, and grading. |
| [`add-effects`](plugins/engine/skills/add-effects/SKILL.md) | Add placed, pooled, and lifecycle-safe transient effects and trails. |
| [`build-hud`](plugins/engine/skills/build-hud/SKILL.md) | Build accessible, state-driven overlays, menus, gauges, timers, and indicators. |
| [`manage-game-state`](plugins/engine/skills/manage-game-state/SKILL.md) | Structure deterministic state, pointer lock, pause, reset, clocks, and cooldowns. |

Every integration loads the same canonical files from
[`plugins/engine/skills/`](plugins/engine/skills/). Host manifests contain distribution metadata only.

## Requirements and scope

- Node.js 22 or 24 for the bundled GLB inspector and repository checks.
- Git and an agent or harness that supports the portable `SKILL.md` format.
- npm/npx only when installing through `skills`, auditing packages, or normalizing compressed GLBs.
- `rg` and `gh` are recommended for example and repository discovery workflows.
- macOS and Linux are exercised by the current development and CI paths. Windows users can run the
  Node tooling directly, but the documented shell examples have not yet been tested end to end in
  PowerShell.

The beta does not automate the PlayCanvas Editor, create or publish Editor projects, manage cloud
services, or replace project-specific art direction and gameplay design. It provides Engine coding
workflows and verification boundaries.

## Validation and evaluation

Repository CI runs the deterministic tests on Node 24 and validates every canonical skill
against the Agent Skills specification. A scheduled contract audit downloads current npm packages
and checks the exports, declarations, shipped scripts, and component behavior referenced by the
skills.

Trigger and behavior cases live in [`evals/evals.json`](evals/evals.json). Focused forward cases for
the highest-risk workflows live alongside them with explicit grading criteria.

## Development

The repository itself has no install step or runtime dependencies:

```sh
node --test test/*.test.mjs
node scripts/audit-packages.mjs
node scripts/audit-packages.mjs --engine ../engine
node scripts/smoke-surfaces.mjs
node scripts/smoke-gltf-transform.mjs
```

Before distribution, also run:

```sh
for skill in plugins/engine/skills/*; do
    uvx --from skills-ref==0.1.1 agentskills validate "$skill"
done
claude plugin validate --strict .
```

When Claude's early-access plugin evaluator is enabled, run the focused forward evaluations
separately because they invoke a model and may incur cost:

```sh
claude plugin eval . --ablation with-without --runs 1 --threshold 1
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for pull-request expectations. Report vulnerabilities through
[GitHub Security Advisories](https://github.com/playcanvas/skills/security/advisories/new) as
described in [SECURITY.md](SECURITY.md). For repeatable skill failures, use the
[skill feedback template](https://github.com/playcanvas/skills/issues/new?template=skill-feedback.yml)
and include the prompt, surface, package versions, output, and smallest incorrect behavior.

## License

PlayCanvas Skills is released under the [MIT License](LICENSE).
