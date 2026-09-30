---
name: add-effects
description: Use when adding particles, trails, flashes, or camera shake to a PlayCanvas app, to use Engine particle systems, pool emitters, and avoid shader stalls.
---

# Effects

Use the `particlesystem` component for smoke, sparks, and spray, adapting the closest particle
example from `find-examples`. Reserve a custom mesh for continuous ribbons such as wakes or trails.

## Particles

- `CurveSet` takes one key array per channel: `new CurveSet([0, x0, 1, x1], [0, y0, 1, y1],
  [0, z0, 1, z1])`. A flattened array type-checks, then fails at texture upload.
- Create emitters at load and pool them. To fire one, set its transform, then call `reset()` and
  `play()`. One-shots use `loop: false`; `stop()` only ends emission early.
- The first use of a shader stalls a frame. Render every material and particle variant once behind
  a loading or ready screen; `graphicsDevice.shaders.length` growing after the first real event
  means a variant was missed.
- Animate values with `meshInstance.setParameter` or `material.setParameter`. `material.update()`
  rebuilds variants, so avoid it per frame.

## Trail meshes

- Match vertex streams to the material. A lit `StandardMaterial` needs `SEMANTIC_NORMAL` data before
  the first `mesh.update()`; otherwise use an unlit material.
- Never attach an empty dynamic mesh to an enabled render component. Upload valid seed geometry
  first and never `mesh.clear()` while it renders; reflection cameras expose this first.
- Append segments on small time or distance steps and fade the tail; coarse chunks stutter.

## Placement

- Spawn at the emitter's world mount point and size from calibrated bounds.
- Bias transparent effects toward the camera to avoid z-fighting; check grazing angles for black
  quads or hard edges.
- Apply camera shake as a decaying offset on a camera parent, never inside the follow position.

Fire each effect from real input, and confirm that repeated events keep entity counts stable.
