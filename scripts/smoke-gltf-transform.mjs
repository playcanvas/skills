#!/usr/bin/env node
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { inspectGlb } from '../plugins/engine/skills/inspect-glb/scripts/inspect.mjs';

const CLI = '@gltf-transform/cli@4.4.2';
const dir = mkdtempSync(join(tmpdir(), 'playcanvas-skills-gltf-'));
process.on('exit', () => rmSync(dir, { recursive: true, force: true }));

const positions = Buffer.alloc(36);
[-1, 0, 0, 1, 0, 0, 0, 1, 0].forEach((value, i) => positions.writeFloatLE(value, i * 4));
const json = Buffer.from(JSON.stringify({
    asset: { version: '2.0' },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ name: 'Triangle', mesh: 0 }],
    meshes: [{ primitives: [{ attributes: { POSITION: 0 } }] }],
    accessors: [{ bufferView: 0, componentType: 5126, count: 3, type: 'VEC3', min: [-1, 0, 0], max: [1, 1, 0] }],
    bufferViews: [{ buffer: 0, byteLength: positions.length, target: 34962 }],
    buffers: [{ byteLength: positions.length }]
}));
const jsonLength = (json.length + 3) & ~3;
const input = Buffer.alloc(28 + jsonLength + positions.length, 0);
input.writeUInt32LE(0x46546c67, 0);
input.writeUInt32LE(2, 4);
input.writeUInt32LE(input.length, 8);
input.writeUInt32LE(jsonLength, 12);
input.writeUInt32LE(0x4e4f534a, 16);
json.copy(input, 20);
input.fill(0x20, 20 + json.length, 20 + jsonLength);
input.writeUInt32LE(positions.length, 20 + jsonLength);
input.writeUInt32LE(0x004e4942, 24 + jsonLength);
positions.copy(input, 28 + jsonLength);

const source = join(dir, 'source.glb');
writeFileSync(source, input);

for (const type of ['draco', 'meshopt']) {
    const compressed = join(dir, `${type}.glb`);
    const copied = join(dir, `${type}-copy.glb`);
    execFileSync('npx', ['--yes', CLI, type, source, compressed], { stdio: 'inherit' });
    execFileSync('npx', ['--yes', CLI, 'copy', compressed, copied], { stdio: 'inherit' });
    const before = inspectGlb(readFileSync(compressed));
    const out = inspectGlb(readFileSync(copied));

    assert.equal(before.requiresRuntimeCheck, true, type);
    assert.ok(before.boundsNotes.includes(`${type}-compressed`), type);
    if (type === 'meshopt') assert.equal(before.aabb, null, type);
    assert.equal(out.boundsSource, 'vertices', type);
    assert.ok(out.dims.every((value, i) => Math.abs(value - [2, 1, 0][i]) < 0.001), type);
    assert.deepEqual(out.nodePaths, ['Triangle'], type);
}

console.log('glTF Transform copy removes Draco and Meshopt while preserving decoded geometry.');
