---
name: add-effects
description: Use when adding particles, trails, flashes, decals, or other transient visual effects to a PlayCanvas app, to pick the right Engine building block.
---

# Effects

Pick the Engine building block first, then adapt its closest official example with
`find-examples`:

- Particles such as smoke, sparks, snow, or bursts: the `particlesystem` component. See the
  `graphics/particles-*` examples.
- Custom looks such as glows, dissolves, or animated surfaces: override `StandardMaterial` chunks
  with `override-shader-chunks`. Use a `ShaderMaterial` only when the effect needs its own shader
  pair.
- Custom geometry such as trails, ribbons, or beams: a runtime-updated `Mesh` on a `render`
  component (see `graphics/mesh-generation` and `graphics/mesh-deformation`), or `WideLineRenderer`
  for thick lines.
- Decals: see `graphics/mesh-decals`.
- Screen effects such as bloom, vignette, or DOF: `CameraFrame` (`light-scene`).
- Splat effects: the shipped gsplat scripts (`reuse-scripts`).

## Engine gotchas

- `CurveSet` takes one key array per channel. A flattened array type-checks, then fails at texture
  upload.
- Create emitters and meshes at load and reuse them. Fire an emitter with `reset()` then `play()`;
  one-shots use `loop: false`.
- The first use of a shader stalls a frame. Render each effect once behind a loading or ready screen.
- Animate values with `setParameter`, not a per-frame `material.update()`.
- A lit material on a custom mesh needs normals; otherwise use an unlit material.

Fire each effect from real input, and confirm that repeated events keep entity counts stable.
