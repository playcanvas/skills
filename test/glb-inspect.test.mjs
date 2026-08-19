import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';

import { inspectGlb } from '../skills/inspect-glb/scripts/inspect.mjs';

const glb = (json, bin = Buffer.alloc(0)) => {
    const j = Buffer.from(JSON.stringify(json));
    const jp = (j.length + 3) & ~3;
    const bp = (bin.length + 3) & ~3;
    const total = 20 + jp + (bin.length ? 8 + bp : 0);
    const buf = Buffer.alloc(total, 0);
    buf.writeUInt32LE(0x46546c67, 0);
    buf.writeUInt32LE(2, 4);
    buf.writeUInt32LE(total, 8);
    buf.writeUInt32LE(jp, 12);
    buf.writeUInt32LE(0x4e4f534a, 16);
    j.copy(buf, 20);
    buf.fill(0x20, 20 + j.length, 20 + jp);
    if (bin.length) {
        buf.writeUInt32LE(bp, 20 + jp);
        buf.writeUInt32LE(0x004e4942, 24 + jp);
        bin.copy(buf, 28 + jp);
    }
    return buf;
};

const f32 = (nums) => {
    const b = Buffer.alloc(nums.length * 4);
    nums.forEach((n, i) => b.writeFloatLE(n, i * 4));
    return b;
};

const yawQuat = (deg) => [0, Math.sin((deg * Math.PI) / 360), 0, Math.cos((deg * Math.PI) / 360)];

// vertices sit on the axes, so the mesh does not fill its own local box
const OCTAHEDRON = [0.5, 0, 0, -0.5, 0, 0, 0, 0.5, 0, 0, -0.5, 0, 0, 0, 0.5, 0, 0, -0.5];

const octaGlb = ({ node = {}, prim = {}, accessor = {}, view = {}, skins } = {}) =>
    glb(
        {
            asset: { version: '2.0' },
            scene: 0,
            scenes: [{ nodes: skins ? [0, 1] : [0] }],
            nodes: skins ? [{ name: 'M', mesh: 0, ...node }, { name: 'J' }] : [{ name: 'M', mesh: 0, ...node }],
            meshes: [{ primitives: [{ attributes: { POSITION: 0 }, ...prim }] }],
            accessors: [
                {
                    bufferView: 0,
                    componentType: 5126,
                    count: 6,
                    type: 'VEC3',
                    min: [-0.5, -0.5, -0.5],
                    max: [0.5, 0.5, 0.5],
                    ...accessor
                }
            ],
            bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: 72, ...view }],
            buffers: [{ byteLength: 72 }],
            ...(skins ? { skins } : {})
        },
        f32(OCTAHEDRON)
    );

test('applies node transforms to GLB bounds', () => {
    const out = inspectGlb(
        glb({
            asset: { version: '2.0' },
            scene: 0,
            scenes: [{ nodes: [0] }],
            nodes: [{ children: [1] }, { mesh: 0, translation: [0, 2, 0] }],
            meshes: [{ primitives: [{ attributes: { POSITION: 0 } }] }],
            accessors: [{ min: [-1, -2, -3], max: [1, 2, 3] }]
        })
    );

    assert.deepEqual(out.dims, [2, 4, 6]);
    assert.deepEqual(out.aabb, { min: [-1, 0, -3], max: [1, 4, 3] });
    assert.deepEqual(out.nodePaths, ['node_0', 'node_0/node_1']);
    assert.equal(out.groundOffset, 0);
    // no BIN chunk, so bounds fall back to the accessor box and must say so
    assert.equal(out.boundsSource, 'accessor-minmax');
    assert.deepEqual(out.boundsNotes, ['no-vertex-data']);
    assert.equal(out.boundsPose, 'static');
    assert.equal(out.requiresRuntimeCheck, true);
});

test('bounds come from vertex positions, not the accessor box', () => {
    const out = inspectGlb(octaGlb({ node: { rotation: yawQuat(45) } }));

    assert.equal(out.boundsSource, 'vertices');
    assert.equal(out.requiresRuntimeCheck, false);
    // the rotated octahedron really is 0.7071 wide; its rotated local box would read 1.4142
    assert.deepEqual(out.dims, [0.7071, 1, 0.7071]);
});

test('decodes sparse positions', () => {
    const bin = Buffer.alloc(28);
    bin[0] = 0;
    bin[1] = 2;
    f32([-1, 0, 0, 2, 1, 0]).copy(bin, 4);
    const out = inspectGlb(
        glb(
            {
                asset: { version: '2.0' },
                scene: 0,
                scenes: [{ nodes: [0] }],
                nodes: [{ mesh: 0 }],
                meshes: [{ primitives: [{ attributes: { POSITION: 0 } }] }],
                accessors: [{
                    componentType: 5126,
                    count: 3,
                    type: 'VEC3',
                    sparse: {
                        count: 2,
                        indices: { bufferView: 0, componentType: 5121 },
                        values: { bufferView: 1 }
                    }
                }],
                bufferViews: [
                    { buffer: 0, byteOffset: 0, byteLength: 2 },
                    { buffer: 0, byteOffset: 4, byteLength: 24 }
                ],
                buffers: [{ byteLength: 28 }]
            },
            bin
        )
    );

    assert.equal(out.boundsSource, 'vertices');
    assert.deepEqual(out.aabb, { min: [-1, 0, 0], max: [2, 1, 0] });
});

test('applies default morph weights and flags animated bounds', () => {
    const out = inspectGlb(
        glb(
            {
                asset: { version: '2.0' },
                scene: 0,
                scenes: [{ nodes: [0] }],
                nodes: [{ mesh: 0, weights: [1] }],
                meshes: [{
                    weights: [0.5],
                    primitives: [{ attributes: { POSITION: 0 }, targets: [{ POSITION: 1 }] }]
                }],
                accessors: [
                    { bufferView: 0, componentType: 5126, count: 2, type: 'VEC3' },
                    { bufferView: 1, componentType: 5126, count: 2, type: 'VEC3' },
                    { componentType: 5126, count: 1, type: 'SCALAR', max: [1] }
                ],
                bufferViews: [
                    { buffer: 0, byteOffset: 0, byteLength: 24 },
                    { buffer: 0, byteOffset: 24, byteLength: 24 }
                ],
                buffers: [{ byteLength: 48 }],
                animations: [{
                    samplers: [{ input: 2, output: 2 }],
                    channels: [{ sampler: 0, target: { node: 0, path: 'weights' } }]
                }]
            },
            Buffer.concat([f32([0, 0, 0, 1, 0, 0]), f32([0, 0, 0, 1, 0, 0])])
        )
    );

    assert.equal(out.boundsSource, 'vertices');
    assert.equal(out.boundsPose, 'default-morph');
    assert.equal(out.morphed, true);
    assert.equal(out.morphAnimated, true);
    assert.equal(out.requiresRuntimeCheck, true);
    assert.deepEqual(out.dims, [2, 0, 0]);
});

test('decodes interleaved and quantized positions', () => {
    const inter = Buffer.alloc(64);
    [
        [0.5, 0, 0],
        [-0.5, 0, 0.25]
    ].forEach((v, i) => v.forEach((n, k) => inter.writeFloatLE(n, i * 32 + k * 4)));
    const strided = inspectGlb(
        glb(
            {
                asset: { version: '2.0' },
                scene: 0,
                scenes: [{ nodes: [0] }],
                nodes: [{ mesh: 0 }],
                meshes: [{ primitives: [{ attributes: { POSITION: 0 } }] }],
                accessors: [{ bufferView: 0, componentType: 5126, count: 2, type: 'VEC3' }],
                bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: 64, byteStride: 32 }],
                buffers: [{ byteLength: 64 }]
            },
            inter
        )
    );

    assert.equal(strided.boundsSource, 'vertices');
    assert.deepEqual(strided.aabb, { min: [-0.5, 0, 0], max: [0.5, 0, 0.25] });

    const q = Buffer.alloc(12);
    [32767, 0, -32767, 16383, 0, 0].forEach((n, i) => q.writeInt16LE(n, i * 2));
    const quantized = inspectGlb(
        glb(
            {
                asset: { version: '2.0' },
                scene: 0,
                scenes: [{ nodes: [0] }],
                nodes: [{ mesh: 0 }],
                meshes: [{ primitives: [{ attributes: { POSITION: 0 } }] }],
                accessors: [{ bufferView: 0, componentType: 5122, normalized: true, count: 2, type: 'VEC3' }],
                bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: 12 }],
                buffers: [{ byteLength: 12 }]
            },
            q
        )
    );

    assert.equal(quantized.boundsSource, 'vertices');
    assert.deepEqual(quantized.aabb, { min: [0.5, 0, -1], max: [1, 0, 0] });
});

test('reports why bounds are approximate when vertices cannot be decoded', () => {
    const out = inspectGlb(
        octaGlb({
            node: { rotation: yawQuat(45) },
            prim: { extensions: { KHR_draco_mesh_compression: { bufferView: 0, attributes: { POSITION: 0 } } } }
        })
    );

    assert.equal(out.boundsSource, 'accessor-minmax');
    assert.deepEqual(out.boundsNotes, ['draco-compressed']);
    assert.deepEqual(out.dims, [1.4142, 1, 1.4142]);
});

test('does not report misleading meshopt accessor bounds', () => {
    const out = inspectGlb(
        octaGlb({ view: { extensions: { EXT_meshopt_compression: { buffer: 0, byteOffset: 0 } } } })
    );

    assert.equal(out.aabb, null);
    assert.equal(out.boundsSource, null);
    assert.equal(out.requiresRuntimeCheck, true);
    assert.deepEqual(out.boundsNotes, ['meshopt-compressed']);
});

test('ignores the transform of a skinned mesh node', () => {
    const out = inspectGlb(octaGlb({ node: { skin: 0, scale: [10, 10, 10] }, skins: [{ joints: [1] }] }));

    assert.equal(out.skinned, true);
    assert.equal(out.boundsPose, 'bind');
    assert.equal(out.requiresRuntimeCheck, true);
    assert.deepEqual(out.dims, [1, 1, 1]);
});

test('rejects invalid container lengths and node graphs', () => {
    const length = octaGlb();
    length.writeUInt32LE(length.length + 4, 8);
    assert.throws(() => inspectGlb(length), /invalid GLB length/);

    assert.throws(() => inspectGlb(glb({
        asset: { version: '2.0' },
        scene: 0,
        scenes: [{ nodes: [0] }],
        nodes: [{ children: [1] }, { children: [0] }]
    })), /invalid node graph/);
});

test('runs as a CLI through direct and linked skill paths', (t) => {
    const dir = mkdtempSync(join(tmpdir(), 'playcanvas-inspect-'));
    t.after(() => rmSync(dir, { recursive: true, force: true }));
    const root = resolve('skills/inspect-glb');
    const link = join(dir, 'inspect-glb');
    symlinkSync(root, link, 'junction');

    for (const file of [join(root, 'scripts/inspect.mjs'), join(link, 'scripts/inspect.mjs')]) {
        const result = spawnSync(process.execPath, [file], { encoding: 'utf8' });
        assert.equal(result.status, 1, file);
        assert.match(result.stderr, /usage: node inspect\.mjs/, file);
    }
});
