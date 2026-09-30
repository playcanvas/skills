---
name: build-app
description: Use when creating or restructuring a PlayCanvas app with the Engine API, @playcanvas/react, or @playcanvas/web-components, covering bootstrap, input, resize, physics, game loop, HUD, and lifecycle.
---

# Build an Engine application

Read `package.json` and the entry point, keep the surface that owns the lifecycle, and read only its
reference: [direct Engine](references/direct-engine.md), [React](references/react.md), or
[Web Components](references/web-components.md). Choose from imports and markup, not dependencies.

## Bootstrap

- Input is opt-in. `app.keyboard`, `mouse`, `touch`, `gamepads`, and `elementInput` stay `null`
  unless passed to `new Application(canvas, { ... })`; UI buttons need `new ElementInput(canvas)`.
- The Engine adds no window resize listener; call `app.resizeCanvas()` from your own handler.
- `graphicsDevice.maxPixelRatio` defaults to 1. Raise it, at most to `window.devicePixelRatio`, only
  where the target holds its frame budget, then call `app.resizeCanvas()`.
- Rigid bodies stay inert until Ammo loads through `WasmModule`. Copy the loader from the
  `physics/falling-shapes` example with `find-examples`.

## Game loop

- `dt` is already clamped by `app.maxDeltaTime` (0.1 s); tune it instead of clamping by hand.
  `app.timeScale = 0` pauses scaled time.
- Model control flow as an explicit state machine, such as ready, playing, paused, and over.
  Advance simulation only while playing, and reset through the same setup as the first start.
- Request pointer lock from a user gesture. Pause on lock loss or blur, and handle a repeated
  `pointerlockchange` without toggling.

## HUD

- Render UI from game state; never store gameplay truth in the DOM or UI elements.
- Use a DOM or React overlay, or Engine `screen` and `element` components adapted from a
  `user-interface` example.
- Hide idle elements with `enabled = false`; an element at opacity 0 still draws.

## Ownership

- Keep one owner for app creation, assets, entities, update callbacks, and teardown.
- Prefer the surface's declarative primitives. Put per-entity and per-frame behaviour in an Engine
  `Script`.
- Remove external events and resources in the lifecycle that created them.
