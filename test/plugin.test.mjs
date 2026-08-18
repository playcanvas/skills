import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import test from 'node:test';

const hosts = [
    {
        name: 'claude',
        map: '.claude-plugin/marketplace.json',
        manifest: '.claude-plugin/plugin.json',
        source: (entry) => entry.source
    },
    {
        name: 'codex',
        map: '.agents/plugins/marketplace.json',
        manifest: '.codex-plugin/plugin.json',
        source: (entry) => entry.source.path
    },
    {
        name: 'cursor',
        map: '.cursor-plugin/marketplace.json',
        manifest: '.cursor-plugin/plugin.json',
        source: (entry) => entry.source
    }
];

const maps = hosts.map((host) => ({ ...host, data: JSON.parse(readFileSync(host.map)) }));
const surfaces = ['direct-engine.md', 'react.md', 'web-components.md'];
const adapted = [
    'assemble-scene',
    'build-app',
    'calibrate-model',
    'configure-animation',
    'find-examples',
    'reuse-scripts'
];
const skills = [...adapted, 'apply-conventions', 'inspect-glb',
    'add-effects', 'build-hud', 'light-scene', 'manage-game-state'].sort();

test('marketplaces expose the same plugins', () => {
    const names = maps[0].data.plugins.map((entry) => entry.name);

    for (const { data, name } of maps) {
        assert.equal(data.name, 'playcanvas', name);
        assert.deepEqual(data.plugins.map((entry) => entry.name), names, name);
    }
});

test('marketplace plugins match their manifests', () => {
    for (const { data, manifest: file, name, source } of maps) {
        for (const entry of data.plugins) {
            const root = resolve(source(entry));
            const manifest = JSON.parse(readFileSync(resolve(root, file)));
            const skills = resolve(root, manifest.skills ?? 'skills');

            assert.equal(basename(root), entry.name, name);
            assert.equal(manifest.name, entry.name, name);
            assert.ok(readdirSync(skills).some((file) => file !== '.DS_Store'), name);
        }
    }
});

test('plugin versions match across hosts and versioned marketplaces', () => {
    const versions = maps.map(({ data, manifest, source }) =>
        JSON.parse(readFileSync(resolve(source(data.plugins[0]), manifest))).version);

    assert.equal(new Set(versions).size, 1);
    assert.equal(maps.find(({ name }) => name === 'claude').data.version, versions[0]);
    assert.equal(maps.find(({ name }) => name === 'cursor').data.metadata.version, versions[0]);
});

test('canonical skills contain no host-specific instructions', () => {
    const root = resolve('plugins/engine/skills');

    for (const file of readdirSync(root, { recursive: true })) {
        if (file.endsWith('.md')) {
            assert.doesNotMatch(
                readFileSync(resolve(root, file), 'utf8'),
                /\.claude|\.codex|\.cursor|\.agents|claude code|codex cli|cursor agent/i,
                file
            );
        }
    }
});

test('framework-aware skills treat every authoring surface equally', () => {
    for (const skill of adapted) {
        assert.deepEqual(
            readdirSync(resolve('plugins/engine/skills', skill, 'references')).sort(),
            surfaces,
            skill
        );
    }
});

test('calibration references preserve yaw and pivot compensation', () => {
    const root = resolve('plugins/engine/skills/calibrate-model/references');
    const refs = Object.fromEntries(surfaces.map((file) => [file, readFileSync(resolve(root, file), 'utf8')]));

    for (const [file, src] of Object.entries(refs)) {
        assert.match(src, /center(?:\[0\]|\.x).*scale/, file);
        assert.match(src, /center(?:\[2\]|\.z).*scale/, file);
    }
    assert.match(refs['direct-engine.md'], /yaw\.addChild\(model\);\s+root\.addChild\(yaw\);/);
    assert.match(refs['react.md'], /<Entity rotation=\{\[0, t\.yaw, 0\]\}>[\s\S]*<Entity[\s\S]*position=\{\[-t\.center\[0\]/);
    assert.match(refs['web-components.md'], /<pc-entity rotation="0 180 0">\s+<pc-entity position="-0\.45 1\.2 0\.225"/);
});

test('plugin exposes the intended task-oriented skills', () => {
    assert.deepEqual(
        readdirSync('plugins/engine/skills', { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name)
            .sort(),
        skills
    );
});

test('skill metadata is portable and matches its folder', () => {
    for (const skill of skills) {
        const file = resolve('plugins/engine/skills', skill, 'SKILL.md');
        const frontmatter = readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---\n/)?.[1];
        assert.ok(frontmatter, skill);
        const data = Object.fromEntries(frontmatter.split('\n').map((line) => {
            const split = line.indexOf(':');
            return [line.slice(0, split), line.slice(split + 1).trim()];
        }));

        assert.deepEqual(Object.keys(data).sort(), ['description', 'name'], skill);
        assert.equal(data.name, skill);
        assert.ok(data.description, skill);
    }
});

test('local links in skill documentation resolve', () => {
    const root = resolve('plugins/engine/skills');

    for (const name of readdirSync(root, { recursive: true })) {
        if (!name.endsWith('.md')) continue;
        const file = resolve(root, name);
        for (const match of readFileSync(file, 'utf8').matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
            const target = match[1].split('#')[0];
            if (target && !target.includes('://')) assert.ok(existsSync(resolve(dirname(file), target)), `${name}: ${target}`);
        }
    }
});

test('README documents every shipped skill', () => {
    const readme = readFileSync('README.md', 'utf8');

    for (const skill of skills) {
        assert.ok(readme.includes(`[\`${skill}\`](plugins/engine/skills/${skill}/SKILL.md)`), skill);
    }
});

test('evaluation cases cover every skill and authoring surface', () => {
    const data = JSON.parse(readFileSync('evals/evals.json', 'utf8'));
    const expected = [...data.triggerCases, ...data.behaviorCases].flatMap((entry) => entry.expected);

    assert.equal(data.version, 1);
    assert.deepEqual([...new Set(expected)].sort(), skills);
    assert.deepEqual([...new Set(data.behaviorCases.map((entry) => entry.surface))].sort(), [
        'direct-engine',
        'react',
        'web-components'
    ]);
    assert.ok(data.triggerCases.some((entry) => entry.expected.length === 0));
    for (const entry of [...data.triggerCases, ...data.behaviorCases]) {
        assert.ok(entry.id && (entry.prompt?.trim() || entry.scenario), entry.id);
        assert.ok(entry.expected.every((skill) => skills.includes(skill)), entry.id);
    }
});

test('forward evaluations have prompts and graders', () => {
    const root = resolve('evals');
    const cases = readdirSync(root, { withFileTypes: true }).filter((entry) => entry.isDirectory());

    assert.deepEqual(cases.map((entry) => entry.name).sort(), [
        'calibrate-direct',
        'inspect-morph',
        'react-animation',
        'web-components-lifecycle'
    ]);
    for (const entry of cases) {
        assert.ok(readFileSync(resolve(root, entry.name, 'prompt.md'), 'utf8').trim(), entry.name);
        assert.ok(readFileSync(resolve(root, entry.name, 'graders/criteria.md'), 'utf8').trim(), entry.name);
    }
});
