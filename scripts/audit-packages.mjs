#!/usr/bin/env node
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const MAX_BUFFER = 64 * 1024 * 1024;
const CONTRACTS = [
    {
        name: 'playcanvas',
        exports: ['.', './scripts/*'],
        files: [
            'build/playcanvas.d.ts',
            'scripts/esm/camera-controls.mjs',
            'scripts/esm/camera-frame.mjs',
            'scripts/esm/sky/procedural-sky.mjs',
            'scripts/esm/water.mjs'
        ],
        checks: {
            'build/playcanvas.d.ts': [/declare class Entity\b/, /declare class CameraFrame\b/, /declare class ContainerResource\b/],
            'scripts/esm/camera-controls.mjs': [/static scriptName = 'cameraControls'/],
            'scripts/esm/sky/procedural-sky.mjs': [/static scriptName = 'proceduralSky'/],
            'scripts/esm/water.mjs': [/static scriptName = 'water'/]
        }
    },
    {
        name: '@playcanvas/react',
        exports: ['.', './components', './hooks'],
        files: ['dist/index.d.ts', 'dist/components/index.d.ts', 'dist/hooks/index.d.ts', 'dist/components/Anim.js'],
        checks: {
            'dist/index.d.ts': [/export \{ Container \}/, /export \{ Entity \}/],
            'dist/components/index.d.ts': [/export \{ Anim \}/, /export \{ Camera \}/, /export \{ Render \}/, /export \{ Script \}/],
            'dist/hooks/index.d.ts': [/\buseModel\b/],
            'dist/components/Anim.js': [/assignAnimation\('animation', animation\.resource\)/]
        },
        peer: /^\^2\./
    },
    {
        name: '@playcanvas/web-components',
        exports: ['.', './dist/*'],
        files: [
            'dist/index.d.ts',
            'dist/model.d.ts',
            'dist/components/anim-component.d.ts',
            'dist/components/anim-clip.d.ts',
            'dist/pwc.mjs'
        ],
        checks: {
            'dist/index.d.ts': [
                /\bwhenReady\b/,
                /'pc-model': ModelElement/,
                /'pc-anim': AnimComponentElement/,
                /'pc-anim-clip': AnimClipElement/
            ],
            'dist/model.d.ts': [/declare class ModelElement\b/, /get asset\(\): string/],
            'dist/components/anim-component.d.ts': [
                /declare class AnimComponentElement\b/,
                /transition\(name: string, time\?: number\): void/,
                /get clips\(\): string\[\]/
            ],
            'dist/components/anim-clip.d.ts': [/declare class AnimClipElement\b/, /set asset\(value: string\)/]
        },
        peer: /^\^2\./
    }
];

const dir = mkdtempSync(join(tmpdir(), 'playcanvas-skills-packages-'));
process.on('exit', () => rmSync(dir, { recursive: true, force: true }));

const run = (cmd, args) => execFileSync(cmd, args, {
    encoding: 'utf8',
    maxBuffer: MAX_BUFFER,
    stdio: ['ignore', 'pipe', 'inherit']
});

const packed = CONTRACTS.map((contract) => {
    const data = JSON.parse(run('npm', ['pack', `${contract.name}@latest`, '--json', '--silent', '--pack-destination', dir]))[0];
    const tar = join(dir, data.filename);
    const files = new Set(data.files.map((file) => file.path));
    const read = (file) => run('tar', ['-xOf', tar, `package/${file}`]);
    const pkg = JSON.parse(read('package.json'));

    assert.equal(pkg.version, data.version, contract.name);
    for (const key of contract.exports) assert.ok(pkg.exports?.[key], `${contract.name}: export ${key}`);
    for (const file of contract.files) assert.ok(files.has(file), `${contract.name}: ${file}`);
    for (const [file, patterns] of Object.entries(contract.checks)) {
        const src = read(file);
        for (const pattern of patterns) assert.match(src, pattern, `${contract.name}: ${file}`);
    }
    if (contract.peer) assert.match(pkg.peerDependencies?.playcanvas ?? '', contract.peer, `${contract.name}: playcanvas peer`);

    return { name: contract.name, version: data.version };
});

console.log(JSON.stringify({ checkedAt: new Date().toISOString(), packages: packed }, null, 2));
