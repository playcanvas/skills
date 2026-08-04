# PlayCanvas Skills

[![License](https://img.shields.io/github/license/playcanvas/skills)](https://github.com/playcanvas/skills/blob/main/LICENSE)
[![Discord](https://img.shields.io/badge/Discord-5865F2?style=flat&logo=discord&logoColor=white&color=black)](https://discord.gg/RSaMRzg)
[![Reddit](https://img.shields.io/badge/Reddit-FF4500?style=flat&logo=reddit&logoColor=white&color=black)](https://www.reddit.com/r/PlayCanvas)
[![X](https://img.shields.io/badge/X-000000?style=flat&logo=x&logoColor=white&color=black)](https://x.com/intent/follow?screen_name=playcanvas)

| [Developer Site](https://developer.playcanvas.com/) | [Engine Manual](https://developer.playcanvas.com/user-manual/engine/) | [API Reference](https://api.playcanvas.com/engine/) | [Examples](https://playcanvas.com/examples/) | [Forum](https://forum.playcanvas.com/) |

Reusable, agent-agnostic skills for AI coding agents working with PlayCanvas products. This
repository is a plugin marketplace, so each product can provide its own focused plugin.

The initial `0.1` release is a focused Engine beta. Its skills encode PlayCanvas-specific package
contracts and workflows while remaining portable across compatible coding agents.

## Supported products

| Plugin | Product | Project types |
| --- | --- | --- |
| `engine` | PlayCanvas Engine | Direct Engine, `@playcanvas/react`, `@playcanvas/web-components` |

Skills read installed dependency versions and package contracts instead of assuming the latest
release.

## Supported agents

| Agent | Surfaces | Distribution |
| --- | --- | --- |
| Claude Code | CLI, desktop app | Marketplace |
| Codex | CLI, app | Marketplace |
| Cursor | CLI, app | Local plugin or team marketplace |

## Install

Every integration loads the same canonical skills from
[`plugins/engine/skills/`](plugins/engine/skills/).

### Claude Code and Claude Code desktop

Add the marketplace and install the Engine plugin:

```sh
claude plugin marketplace add playcanvas/skills
claude plugin install engine@playcanvas
```

In the desktop app's Code tab, installed plugins are available under **+ → Plugins**.

### Codex CLI and app

```sh
codex plugin marketplace add playcanvas/skills
codex plugin add engine@playcanvas
```

Start a new conversation after installing or updating the plugin. The Codex app uses the same
marketplace and plugin.

### Cursor

Load the plugin directly from a checkout:

```sh
cursor-agent --plugin-dir ./plugins/engine
```

For persistent local use in the Cursor app, link `plugins/engine` into
`~/.cursor/plugins/local/engine`. Teams and Enterprise organizations can also import this repository
as a team marketplace.

Each skill uses the portable `SKILL.md` format with optional `references/` and `scripts/` resources.
Other compatible agent harnesses can consume the canonical skills directory directly.

## Engine skills

| Skill | Purpose |
| --- | --- |
| [`build-app`](plugins/engine/skills/build-app/SKILL.md) | Structure Direct Engine, React, and Web Components applications with the correct lifecycle. |
| [`apply-conventions`](plugins/engine/skills/apply-conventions/SKILL.md) | Apply stable Engine coordinate, transform, physics, material, and import conventions. |
| [`find-examples`](plugins/engine/skills/find-examples/SKILL.md) | Find and adapt official examples matching the installed Engine version. |
| [`reuse-scripts`](plugins/engine/skills/reuse-scripts/SKILL.md) | Discover and reuse production scripts shipped with the Engine. |
| [`inspect-glb`](plugins/engine/skills/inspect-glb/SKILL.md) | Inspect GLB bounds, transforms, animation clips, joints, and hierarchy offline. |
| [`calibrate-model`](plugins/engine/skills/calibrate-model/SKILL.md) | Measure model scale, grounding offset, and orientation once for reliable reuse. |
| [`configure-animation`](plugins/engine/skills/configure-animation/SKILL.md) | Set up GLB animation playback, blending, and retargeting from inspected data. |
| [`assemble-scene`](plugins/engine/skills/assemble-scene/SKILL.md) | Compose predictable gameplay entity, model, collider, and physics hierarchies. |
| [`light-scene`](plugins/engine/skills/light-scene/SKILL.md) | Light, expose, shadow, and grade a scene using Engine-native rendering capabilities. |
| [`add-effects`](plugins/engine/skills/add-effects/SKILL.md) | Add transient effects and trails with correct placement, lifecycle, and verification. |
| [`build-hud`](plugins/engine/skills/build-hud/SKILL.md) | Build state-driven game overlays, menus, gauges, timers, and indicators. |
| [`manage-game-state`](plugins/engine/skills/manage-game-state/SKILL.md) | Structure deterministic game states, pointer lock, pause, reset, clocks, and cooldowns. |

## Feedback and iteration

If a skill produces a repeatable PlayCanvas-specific failure, [open a skill feedback
issue](https://github.com/playcanvas/skills/issues/new?template=skill-feedback.yml). Include the task
prompt, authoring surface, installed package versions, generated output, and the smallest behavior
that should improve. Screenshots, runtime diagnostics, and links to reproducible projects are more
useful than general quality ratings.

## Development

The repository has no install step or runtime dependencies. Run the tests with Node.js 24:

```sh
node --test test/*.test.mjs
```

Before distribution, also run `claude plugin validate --strict .` and validate the Codex plugin and
each skill with the validators bundled with Codex.

## License

PlayCanvas Skills is released under the [MIT License](LICENSE).
