#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const FILES = [
    'plugins/engine/.claude-plugin/plugin.json',
    'plugins/engine/.codex-plugin/plugin.json',
    'plugins/engine/.cursor-plugin/plugin.json',
    '.claude-plugin/marketplace.json',
    '.cursor-plugin/marketplace.json'
];

const tag = process.argv[2];
assert.match(tag ?? '', /^v\d+\.\d+\.\d+$/, 'expected a vMAJOR.MINOR.PATCH tag');
const version = tag.slice(1);

for (const file of FILES) {
    const data = JSON.parse(readFileSync(file));
    assert.equal(file === '.cursor-plugin/marketplace.json' ? data.metadata?.version : data.version, version, file);
}

console.log(`release metadata matches ${tag}`);
