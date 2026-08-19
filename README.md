# PlayCanvas Skills

[![Version](https://img.shields.io/github/v/release/playcanvas/skills?label=version)](https://github.com/playcanvas/skills/releases/latest)
[![skills.sh](https://skills.sh/b/playcanvas/skills)](https://skills.sh/playcanvas/skills)
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

## Installation

Choose one route for each agent. Native plugins install the complete versioned bundle. The Agent
Skills installer lets you select skills and writes editable copies into your project or user-level
configuration. Installing both routes for the same agent exposes duplicate skills.

### Native plugins

<details>
<summary><strong>Claude Code and Claude Code desktop</strong></summary>

```bash
claude plugin marketplace add playcanvas/skills
claude plugin install engine@playcanvas
```

In the desktop app's Code tab, installed plugins are available under **+ → Plugins**.

</details>

<details>
<summary><strong>Codex CLI and app</strong></summary>

```bash
codex plugin marketplace add playcanvas/skills
codex plugin add engine@playcanvas
```

The Codex app uses the same marketplace and plugin installation.

</details>

<details>
<summary><strong>Cursor</strong></summary>

For a single CLI session, load the plugin directly from a checkout:

```bash
cursor-agent --plugin-dir .
```

For a persistent installation, add this repository as a plugin marketplace in Cursor or link the
repository root into `~/.cursor/plugins/local/engine`. Teams and Enterprise organizations can
publish the same marketplace to their organization.

</details>

### Agent Skills-compatible harnesses

List the available skills, then install them into all detected agents for the current project:

```bash
npx skills@latest add playcanvas/skills --list
npx skills@latest add playcanvas/skills --all
```

Use `-g` for a user-level installation. Start a new conversation after installing or updating so the
agent discovers the new skill metadata.

## Supported surfaces

The skills resolve the active surface from imports and markup, then read only its matching reference:

| Surface | Packages | Coverage |
| --- | --- | --- |
| Direct Engine | `playcanvas` | bootstrap, assets, scripts, rendering, animation, physics, lifecycle |
| React | `playcanvas`, `@playcanvas/react` | React ownership, hooks, components, assets, Engine interop |
| Web Components | `playcanvas`, `@playcanvas/web-components` | declarative elements, lifecycle, assets, Engine interop |

Skills prefer the packages installed in the target project. CI compiles representative usage against
pinned supported package versions, and Renovate proposes dependency updates.

## Engine skills

| Skill | Purpose |
| --- | --- |
| [`build-app`](skills/build-app/SKILL.md) | Select and structure Direct Engine, React, or Web Components applications. |
| [`apply-conventions`](skills/apply-conventions/SKILL.md) | Apply stable coordinates, transforms, physics, materials, imports, and verification rules. |
| [`find-examples`](skills/find-examples/SKILL.md) | Find and adapt official examples matching the installed package version. |
| [`reuse-scripts`](skills/reuse-scripts/SKILL.md) | Discover and integrate production scripts shipped with the Engine. |
| [`inspect-glb`](skills/inspect-glb/SKILL.md) | Measure default-pose GLB bounds, transforms, clips, joints, morphs, and hierarchy offline. |
| [`calibrate-model`](skills/calibrate-model/SKILL.md) | Record stable scale, grounding, pivot compensation, and yaw for repeated models. |
| [`configure-animation`](skills/configure-animation/SKILL.md) | Configure clip playback, blending, state graphs, and retargeting from inspected data. |
| [`assemble-scene`](skills/assemble-scene/SKILL.md) | Compose semantic, visual, collider, physics, and effect hierarchies. |
| [`light-scene`](skills/light-scene/SKILL.md) | Build coherent lighting, exposure, shadows, reflections, water, and grading. |
| [`add-effects`](skills/add-effects/SKILL.md) | Add placed, pooled, and lifecycle-safe transient effects and trails. |
| [`build-hud`](skills/build-hud/SKILL.md) | Build accessible, state-driven overlays, menus, gauges, timers, and indicators. |
| [`manage-game-state`](skills/manage-game-state/SKILL.md) | Structure deterministic state, pointer lock, pause, reset, clocks, and cooldowns. |

Every integration loads the same canonical files from [`skills/`](skills/). Host manifests contain
distribution metadata only.

The beta does not automate the PlayCanvas Editor, create or publish Editor projects, manage cloud
services, or replace project-specific art direction and gameplay design. It provides Engine coding
workflows and verification boundaries.

See [CONTRIBUTING.md](CONTRIBUTING.md) for pull-request expectations. Report vulnerabilities through
[GitHub Security Advisories](https://github.com/playcanvas/skills/security/advisories/new). For
repeatable skill failures, use the
[skill feedback template](https://github.com/playcanvas/skills/issues/new?template=skill-feedback.yml)
and include the prompt, surface, package versions, output, and smallest incorrect behavior.

## License

PlayCanvas Skills is released under the [MIT License](LICENSE).
