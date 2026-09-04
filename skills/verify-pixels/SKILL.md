---
name: verify-pixels
description: Use when changing PlayCanvas rendering code that must not visibly change the rendered image — draw-call optimization, hardware instancing, shader or material refactors, noise or lightmap bakes, or asset pipeline swaps — before shipping.
---

# Prove pixels unchanged

A rendering change that must not alter the image is not proven by eyeballing a screenshot at one
pose. Classify the change first: a pure refactor is proven by a byte-exact capture matrix, and a
change that re-rolls any number cannot be, so it is proven by a reviewed side-by-side instead. Pick
the gate before building anything.

## Classify the change

| Change | Gate |
| --- | --- |
| Batching, instancing, mesh indexing, chunking, pooling that preserves RNG order, an asset format swap with identical decoded data | Byte-exact matrix |
| Re-rolled or re-sampled procedural noise, a changed RNG consumption order, math moved between CPU and GPU, changed precision, fewer octaves or samples | Not byte-gateable: side-by-side review |

Float results differ across GPUs and often across two builds of the same shader; for the second
class a hash will always differ, and a luminance histogram, perceptual threshold, or "bounded diff"
invented on the spot is not a gate — it is a number nobody has calibrated. Write "not byte-gateable"
in the change description and go straight to the review section.

## Cover every touched surface

Every material or surface the change touches must dominate at least one capture pose. A horizon
strip of water does not cover a water shader change, and a terrain-dominant gameplay pose says
nothing about the sky. Two poses is the floor and four is the cap. Add a second animation phase,
mid-animation rather than frame zero, only for surfaces that animate.

## Make the frame deterministic

- Drive every animated shader or vertex effect from one app-owned time value, never `Date.now()` or
  `performance.now()` read inside the render path, so a captured phase is exactly reproducible.
- Freeze the clock with `app.timeScale = 0` before capturing; nothing should advance between frames
  you did not explicitly step.
- Step frames explicitly: set `app.autoRender = false` once, then set `app.renderNextFrame = true`
  before each frame you want rendered. The engine renders exactly that frame and clears the flag —
  do not rely on the free-running render loop plus a timed screenshot.
- Read the rendered pixels with `await device.readPixelsAsync(x, y, w, h, pixels)` against the exact
  backbuffer, not a re-encoded screenshot (e.g. `canvas.toDataURL`) that can introduce compression or
  colour-management differences the eye won't catch. In the installed engine this method lives on
  `WebglGraphicsDevice`, not the base `GraphicsDevice` type, so narrow to it (or branch on
  `device.isWebGL2`) before calling; a WebGPU project needs its own equivalent readback. If the
  project already has a screenshot path, hold it to the same rule: fixed size, fixed pose, no lossy
  step before the byte comparison.

## Run a same-build control first

Before trusting any diff between the old and new build, capture the same pose × phase matrix twice
from the *unmodified* build. Two captures of identical, frozen state must be bit-identical. If they
are not, the capture path itself is the source of noise — an unseeded animation, an asset still
loading, a GPU timing race — and must be fixed before it can say anything about the real change.

## Gate and report the byte-exact class

Byte-compare each pose × phase pair between the two builds; do not diff by looking. Zero differing
pixels passes outright. Any nonzero diff must be reviewed on-screen, and its cause and extent stated
in the change description — never merged silently. Report the actual count every time, for example
"0 of 65536 pixels differ" or "312 of 65536 pixels differ, confined to the object's silhouette edge".
"Looks the same" or "no visible difference" is not a result.

## Review the other class side by side

1. List each touched surface with the pose that it dominates. A surface with no such pose gets a
   new one before any capture; poses saved by an earlier task were framed for that task and rarely
   qualify.
2. For each listed pose, render the old and new build at the same pose and size into one image —
   left and right, or top and bottom — and show that image to the user for an accept or reject.
3. State what differs and why, for example "noise tile replaces runtime fbm: pattern period changed,
   tint and amplitude match". If the difference is not visible in the side-by-side, say so instead
   of tuning further.

Do not run the byte matrix on this class; it fails by construction and proves nothing.

## Cap the harness

One same-build control, at most four poses and two phases, one capture path. When the project
already has a capture harness, reuse it; do not add a second. Keep harness code out of the shipped
bundle, behind a dev-only import or in a tools directory, and list its files in the change
description. Capture with a headless browser and return images only at accept-or-reject points,
not after every edit.
