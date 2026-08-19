import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import test from 'node:test';

const semver = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;
const codexFields = new Set([
    'id', 'name', 'version', 'description', 'skills', 'apps', 'mcpServers', 'interface',
    'author', 'homepage', 'repository', 'license', 'keywords'
]);
const interfaceFields = new Set([
    'displayName', 'shortDescription', 'longDescription', 'developerName', 'category',
    'capabilities', 'websiteURL', 'privacyPolicyURL', 'termsOfServiceURL', 'brandColor',
    'logo', 'icons', 'screenshots', 'defaultPrompt', 'default_prompt'
]);
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
            const paths = Array.isArray(manifest.skills) ? manifest.skills : [manifest.skills ?? 'skills'];

            assert.equal(manifest.name, entry.name, name);
            for (const path of paths) {
                const skills = resolve(root, path);
                assert.ok(
                    existsSync(resolve(skills, 'SKILL.md')) || readdirSync(skills).some((file) => file !== '.DS_Store'),
                    `${name}: ${path}`
                );
            }
        }
    }
});

test('plugin versions match across hosts and versioned marketplaces', () => {
    const pkg = JSON.parse(readFileSync('package.json'));
    const versions = maps.map(({ data, manifest, source }) =>
        JSON.parse(readFileSync(resolve(source(data.plugins[0]), manifest))).version);

    assert.equal(new Set([...versions, pkg.version]).size, 1);
    assert.equal(maps.find(({ name }) => name === 'claude').data.version, versions[0]);
    assert.equal(maps.find(({ name }) => name === 'cursor').data.metadata.version, versions[0]);
});

test('claude plugin ships the canonical skill inventory', () => {
    const data = JSON.parse(readFileSync('.claude-plugin/plugin.json'));

    assert.deepEqual(data.skills.map((file) => basename(file)).sort(), skills);
    for (const file of data.skills) assert.ok(existsSync(resolve(file, 'SKILL.md')), file);
});

test('codex plugin and marketplace match ingestion contracts', () => {
    const root = resolve('.');
    const data = JSON.parse(readFileSync(resolve(root, '.codex-plugin/plugin.json')));
    const market = maps.find(({ name }) => name === 'codex').data;

    assert.deepEqual(Object.keys(data).filter((key) => !codexFields.has(key)), []);
    assert.doesNotMatch(JSON.stringify(data), /\[TODO:/);
    for (const key of ['name', 'version', 'description']) {
        assert.ok(typeof data[key] === 'string' && data[key].trim(), key);
    }
    assert.match(data.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.match(data.version, semver);
    if (data.author) {
        assert.ok(typeof data.author.name === 'string' && data.author.name.trim());
        assert.deepEqual(Object.keys(data.author).filter((key) => !['name', 'email', 'url'].includes(key)), []);
        if (data.author.url) assert.match(data.author.url, /^https:\/\/[^/]+/);
    }
    if (data.homepage) assert.match(data.homepage, /^https:\/\/[^/]+/);
    assert.equal(resolve(root, data.skills ?? 'skills'), resolve(root, 'skills'));
    if (data.keywords) {
        assert.ok(Array.isArray(data.keywords) && data.keywords.every((word) => typeof word === 'string' && word.trim()));
    }

    const ui = data.interface;
    assert.ok(ui && typeof ui === 'object' && !Array.isArray(ui));
    assert.deepEqual(Object.keys(ui).filter((key) => !interfaceFields.has(key)), []);
    for (const key of ['displayName', 'shortDescription', 'longDescription', 'developerName', 'category']) {
        assert.ok(typeof ui[key] === 'string' && ui[key].trim(), key);
    }
    assert.ok(Array.isArray(ui.capabilities) && ui.capabilities.every((item) => typeof item === 'string' && item.trim()));
    assert.ok(typeof (ui.defaultPrompt ?? ui.default_prompt) === 'string' && (ui.defaultPrompt ?? ui.default_prompt).trim());

    assert.ok(typeof market.name === 'string' && market.name.trim());
    assert.ok(typeof market.interface?.displayName === 'string' && market.interface.displayName.trim());
    for (const entry of market.plugins) {
        assert.equal(entry.source.source, 'local');
        assert.equal(resolve(entry.source.path), root);
        assert.ok(['AVAILABLE', 'INSTALLED_BY_DEFAULT', 'REQUIRED'].includes(entry.policy.installation));
        assert.ok(['ON_INSTALL', 'ON_FIRST_USE', 'NOT_REQUIRED'].includes(entry.policy.authentication));
        assert.ok(typeof entry.category === 'string' && entry.category.trim());
    }
});

test('canonical skills contain no host-specific instructions', () => {
    const root = resolve('skills');

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
            readdirSync(resolve('skills', skill, 'references')).sort(),
            surfaces,
            skill
        );
    }
});

test('calibration references preserve yaw and pivot compensation', () => {
    const root = resolve('skills/calibrate-model/references');
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
        readdirSync('skills', { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name)
            .sort(),
        skills
    );
});

test('skill metadata is portable and matches its folder', () => {
    for (const skill of skills) {
        const file = resolve('skills', skill, 'SKILL.md');
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
    const root = resolve('skills');

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
        assert.ok(readme.includes(`[\`${skill}\`](skills/${skill}/SKILL.md)`), skill);
    }
});
