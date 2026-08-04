import { readFileSync, writeFileSync } from 'node:fs';

// version of record lives in the plugin manifests (there is no package.json); this keeps every
// host manifest and marketplace entry on the same number so `plugin.test.mjs` stays green.
const SOURCE = 'plugins/engine/.claude-plugin/plugin.json';
const MANIFESTS = [
    SOURCE,
    'plugins/engine/.codex-plugin/plugin.json',
    'plugins/engine/.cursor-plugin/plugin.json',
    '.claude-plugin/marketplace.json',
    '.cursor-plugin/marketplace.json'
];

const type = process.argv[2];
const dryRun = process.argv.includes('--dry-run');

if (!['major', 'minor', 'patch'].includes(type)) {
    console.error('usage: node scripts/version.mjs (major|minor|patch) [--dry-run]');
    process.exit(1);
}

const [major, minor, patch] = JSON.parse(readFileSync(SOURCE, 'utf8')).version.split('.').map(Number);
const next = type === 'major' ? `${major + 1}.0.0`
    : type === 'minor' ? `${major}.${minor + 1}.0`
        : `${major}.${minor}.${patch + 1}`;

if (!dryRun) {
    for (const file of MANIFESTS) {
        const src = readFileSync(file, 'utf8');
        const out = src.replace(/("version":\s*")[^"]+(")/, `$1${next}$2`);
        if (out === src) throw new Error(`no version field in ${file}`);
        writeFileSync(file, out);
    }
}

process.stdout.write(`${next}\n`);
