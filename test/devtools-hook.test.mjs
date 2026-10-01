import assert from 'node:assert/strict';
import test from 'node:test';

// 2.23.0 announces apps only from the debug build; engine#9646 fixes the others
import { AppBase, AppOptions, NullGraphicsDevice, version } from 'playcanvas/debug';

const KEY = Symbol.for('playcanvas.inspector');
const HOOK = '../skills/inspect-runtime/scripts/devtools-hook.js';

// stands in for a hook a devtools extension defined first
const seen = [];
globalThis[KEY] = {
    register: (app) => seen.push(['register', app]),
    unregister: (app) => seen.push(['unregister', app])
};
await import(HOOK);
const installed = globalThis[KEY];

const create = (devtools) => {
    const device = new NullGraphicsDevice();
    const app = new AppBase(device.canvas);
    const opts = new AppOptions();
    opts.graphicsDevice = device;
    if (devtools !== undefined) opts.devtools = devtools;
    app.init(opts);
    return app;
};

test('records an app from init until destroy', () => {
    const app = create();
    const info = globalThis.__playcanvasApps.get(app);
    assert.equal(info.version, version);
    assert.equal(info.protocol, 1);

    app.destroy();
    assert.equal(globalThis.__playcanvasApps.has(app), false);
});

test('skips apps created with devtools disabled', () => {
    const app = create(false);
    assert.equal(globalThis.__playcanvasApps.has(app), false);
    app.destroy();
});

test('chains the earlier hook', () => {
    seen.length = 0;
    const app = create();
    app.destroy();
    assert.deepEqual(seen, [['register', app], ['unregister', app]]);
});

test('installs once when injected again', async () => {
    await import(`${HOOK}?again`);
    assert.equal(globalThis[KEY], installed);

    seen.length = 0;
    const app = create();
    assert.equal(seen.length, 1);
    app.destroy();
});
