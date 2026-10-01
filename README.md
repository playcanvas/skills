# PlayCanvas Skills

[![Skills.sh](https://skills.sh/b/playcanvas/skills)](https://skills.sh/playcanvas/skills)
[![Version](https://img.shields.io/github/v/release/playcanvas/skills?include_prereleases&label=version)](https://github.com/playcanvas/skills/releases)
[![CI](https://github.com/playcanvas/skills/actions/workflows/ci.yml/badge.svg)](https://github.com/playcanvas/skills/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/playcanvas/skills)](LICENSE)
[![Context](https://img.shields.io/badge/context-~700_tokens_at_startup-blue)](#context-cost)
[![Discord](https://img.shields.io/badge/Discord-5865F2?style=flat&logo=discord&logoColor=white&color=black)](https://discord.gg/RSaMRzg)
[![Reddit](https://img.shields.io/badge/Reddit-FF4500?style=flat&logo=reddit&logoColor=white&color=black)](https://www.reddit.com/r/PlayCanvas)
[![X](https://img.shields.io/badge/X-000000?style=flat&logo=x&logoColor=white&color=black)](https://x.com/playcanvas)

| [Skills.sh](https://skills.sh/playcanvas/skills) | [Developer Site](https://developer.playcanvas.com/) | [Engine Manual](https://developer.playcanvas.com/user-manual/engine/) | [API Reference](https://api.playcanvas.com/engine/) | [Examples](https://playcanvas.com/examples/) | [Forum](https://forum.playcanvas.com/) |

Portable skills that help AI coding agents build and verify polished applications with
[`playcanvas`](https://www.npmjs.com/package/playcanvas),
[`@playcanvas/react`](https://www.npmjs.com/package/@playcanvas/react), and
[`@playcanvas/web-components`](https://www.npmjs.com/package/@playcanvas/web-components).

## Install

Add the skills to your project with the [Agent Skills](https://skills.sh/) installer:

```bash
npx skills add playcanvas/skills
```

Use `--all` to install every skill into all detected agents or `-g` for a user-level installation.
Start a new conversation after installing or updating so the agent discovers the new skill metadata.

Choose one installation route for each agent. Installing both Agent Skills and a native plugin for
the same agent exposes duplicate skills.

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

## Why PlayCanvas Skills

- Resolve the active PlayCanvas authoring surface from the project instead of guessing from installed
  dependencies.
- Check installed package declarations, exports, examples, and production scripts before using an
  API.
- Inspect GLB geometry, transforms, clips, joints, morphs, and hierarchy before choosing placement or
  animation values.
- Keep scene ownership, model calibration, physics, effects, UI, and app state predictable.
- Reuse Engine features such as `CameraControls`, `Water`, `ProceduralSky`, and `CameraFrame` with
  their required integrations intact.
- Finish with runtime and screenshot evidence instead of treating a successful build as visual proof.

## Usage

Ask your coding agent for the outcome you want. The matching skills supply the PlayCanvas-specific
workflow and verification steps. For example:

```text
Build a Direct Engine product viewer for these GLBs. Inspect and calibrate every model, reuse the
shipped camera controls, and verify grounding and framing in the browser.
```

```text
Polish this @playcanvas/react prototype with compressed assets, reused Engine scripts, pooled
effects, deliberate lighting and tone mapping, and screenshot checks.
```

## Supported surfaces

The skills resolve the active surface from imports and markup, then read only its matching reference:

| Surface | Packages | Coverage |
| --- | --- | --- |
| Direct Engine | `playcanvas` | bootstrap, assets, scripts, rendering, animation, physics, lifecycle |
| React | `playcanvas`, `@playcanvas/react` | React ownership, hooks, components, assets, Engine interop |
| Web Components | `playcanvas`, `@playcanvas/web-components` | declarative elements, lifecycle, assets, Engine interop |

Skills prefer the packages installed in the target project. CI compiles representative usage against
pinned supported package versions, and Renovate proposes dependency updates.

## Skills

| Skill | Purpose | Tokens |
| --- | --- | ---: |
| [`build-app`](skills/build-app/SKILL.md) | Select and structure Direct Engine, React, or Web Components applications. | ~550 |
| [`apply-conventions`](skills/apply-conventions/SKILL.md) | Apply stable coordinates, transforms, physics, materials, imports, and verification rules. | ~550 |
| [`find-examples`](skills/find-examples/SKILL.md) | Find and adapt official examples matching the installed package version. | ~550 |
| [`reuse-scripts`](skills/reuse-scripts/SKILL.md) | Discover and integrate production scripts shipped with the Engine. | ~450 |
| [`inspect-glb`](skills/inspect-glb/SKILL.md) | Measure default-pose GLB bounds, transforms, clips, joints, morphs, and hierarchy offline. | ~450 |
| [`inspect-runtime`](skills/inspect-runtime/SKILL.md) | Read live app state through the Engine devtools hook without changing app code. | ~550 |
| [`load-assets`](skills/load-assets/SKILL.md) | Load glTF containers, set up Draco and Basis decoders, and choose compression. | ~500 |
| [`calibrate-model`](skills/calibrate-model/SKILL.md) | Record stable scale, grounding, pivot compensation, and yaw for repeated models. | ~400 |
| [`configure-animation`](skills/configure-animation/SKILL.md) | Configure clip playback, blending, state graphs, and retargeting from inspected data. | ~450 |
| [`assemble-scene`](skills/assemble-scene/SKILL.md) | Compose semantic, visual, collider, physics, and effect hierarchies. | ~400 |
| [`light-scene`](skills/light-scene/SKILL.md) | Set lighting, environment, shadows, tone mapping, exposure, and post-processing. | ~500 |
| [`add-effects`](skills/add-effects/SKILL.md) | Choose particles, custom shaders, geometry, or screen effects for transient visuals. | ~350 |
| [`verify-pixels`](skills/verify-pixels/SKILL.md) | Prove a rendering change is pixel-identical or bounded before shipping. | ~400 |
| [`reduce-draw-calls`](skills/reduce-draw-calls/SKILL.md) | Measure and cut draw calls with element lifecycle, batching, and instancing. | ~450 |
| [`override-shader-chunks`](skills/override-shader-chunks/SKILL.md) | Customize StandardMaterial shading with version-pinned shader chunk overrides. | ~400 |
| [`bake-lighting`](skills/bake-lighting/SKILL.md) | Precompute static lighting with the engine Lightmapper or an offline bake. | ~450 |

Every integration loads the same canonical files from [`skills/`](skills/). Host manifests contain
distribution metadata only.

PlayCanvas Skills targets Engine application workflows. It does not automate the PlayCanvas Editor,
create or publish Editor projects, manage cloud services, or replace project-specific art direction
and gameplay design.

## Context cost

Agents load only each skill's name and description at session start, about 700 tokens for all 16
skills. A skill's full instructions load when a task triggers it, adding 350–550 tokens, plus at most
one surface reference of up to 500 tokens. Estimates assume 4 characters per token. Each skill
stays within the word budget in [`AGENTS.md`](AGENTS.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for pull-request expectations. For repeatable skill failures,
use the [skill feedback template](https://github.com/playcanvas/skills/issues/new?template=skill-feedback.yml)
and include the prompt, surface, package versions, output, and smallest incorrect behavior. Report
vulnerabilities through
[GitHub Security Advisories](https://github.com/playcanvas/skills/security/advisories/new).

## License

PlayCanvas Skills is released under the [MIT License](LICENSE).
