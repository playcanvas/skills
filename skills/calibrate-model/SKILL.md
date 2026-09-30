---
name: calibrate-model
description: Use before repeatedly placing GLB models in PlayCanvas to record each asset's uniform scale, grounding offset, pivot compensation, and yaw once.
---

# Model calibration

Measure each unique GLB once with `inspect-glb`, only trusting bounds when `boundsSource` is
`vertices`, and keep one tuning record per asset:

```ts
const ASSET_TUNING = {
    ship: {
        boundsSource: 'vertices', dims: [8, 7, 18], center: [0, 2.5, 0], groundOffset: 1,
        intended: { dimension: 'length', size: 18 }, scale: 1, y: 1, yaw: 180
    }
} as const;
```

1. Pick the intended dimension and size, such as character height or vehicle length, in metres or
   relative to an already calibrated model.
2. Set `scale = intendedSize / measuredDimension` and, for floor-resting models,
   `y = groundOffset * scale`. Record deliberate offsets for waterlines or airborne models.
3. Confirm facing once in the running app and record `yaw`.

Nest three levels so a root position means the same for every asset: the gameplay root, a yaw
wrapper, then the visual child with the scale and local position
`(-center.x * scale, y, -center.z * scale)`. Apply calibration once, never per instance.

Place the root on a measured support point, such as a mount point or raycast, not a global AABB
maximum. Skinned bounds are bind-pose estimates; confirm foot contact in active poses.

Read only the reference matching the code: [direct Engine](references/direct-engine.md),
[React](references/react.md), or [Web Components](references/web-components.md).
