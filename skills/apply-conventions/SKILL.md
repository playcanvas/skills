---
name: apply-conventions
description: Use when writing PlayCanvas Engine code touching transforms, cameras, lights, materials, meshes, bounds, or imports, to apply Engine conventions and avoid legacy APIs.
---

# Engine conventions

Check version-sensitive APIs against the installed `playcanvas` declarations.

## Coordinates

- Right-handed, +Y up, metres. `entity.forward` and cameras look down -Z; `lookAt` aims -Z.
- Directional and spot lights shine along local -Y, straight down by default. Aim them with
  `setEulerAngles`, not `lookAt`.
- glTF models usually face +Z; record a yaw per model with `calibrate-model`.
- Keep pitch, yaw, and roll as app state; never feed `getEulerAngles()` back into
  `setEulerAngles()`. Interpolate with `math.lerpAngle` or `Quat.slerp`.
- Use world setters on semantic roots and `setLocal*` below a parent. Never scale rigid-body roots
  or skinned bones.

## Current APIs

- `render` and `anim` components, not `model` and `animation`.
- ESM `class X extends Script` with `static scriptName`, not `createScript`.
- `Mesh.fromGeometry(device, new BoxGeometry())`, not `createBox` and the other `create*` helpers.
- Named imports from `playcanvas`; shipped scripts only from `playcanvas/scripts/esm/**`.

## Cameras

- FOV is vertical, 45° by default. Prefer the shipped `CameraControls` (`reuse-scripts`).
- Smooth an orbit camera's focus, yaw, pitch, and distance, then derive its position.

## Materials and bounds

- `StandardMaterial.useMetalness` defaults to `false`; enable it before using `metalness`.
- Call `material.update()` after property edits. Per-mesh values use `meshInstance.setParameter()`
  with no update or clone.
- Clone a shared material, including imported ones, before editing it for only some meshes.
- `setParameter` uploads raw values; convert sRGB colours with `Color#linear()`.
- Entities have no `aabb`; union descendant `meshInstance.aabb`. Expand mesh bounds by any
  vertex-shader displacement.

## Verify in the running app

Offline values cannot prove facing, animated poses, or placement. Log values from inside the app,
from a `Script` or update callback, and judge visuals only from screenshots you have inspected. A
saved file path is not evidence. Other skills rely on this rule.
