import { readFileSync, writeFileSync } from 'node:fs';

const SOURCE = 'package.json';
const MANIFESTS = [
    'plugins/playcanvas/.codex-plugin/plugin.json',
    'plugins/playcanvas/.cursor-plugin/plugin.json',
    'plugins/playcanvas/.claude-plugin/plugin.json',
    '.claude-plugin/marketplace.json',
    '.cursor-plugin/marketplace.json'
];

const version = JSON.parse(readFileSync(SOURCE, 'utf8')).version;
const check = process.argv.includes('--check');
const stale = [];

for (const file of MANIFESTS) {
    const src = readFileSync(file, 'utf8');
    const data = JSON.parse(src);
    const current = file === '.cursor-plugin/marketplace.json' ? data.metadata?.version : data.version;
    if (current === version) continue;
    stale.push(file);

    if (!check) {
        const out = src.replace(/("version":\s*")[^"]+(")/, `$1${version}$2`);
        if (out === src) throw new Error(`no version field in ${file}`);
        writeFileSync(file, out);
    }
}

if (check && stale.length) {
    console.error(`package version ${version} differs from ${stale.join(', ')}`);
    process.exit(1);
}

console.log(stale.length ? `synced plugin versions to ${version}` : `plugin versions match ${version}`);
