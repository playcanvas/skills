#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const dir = mkdtempSync(join(tmpdir(), 'playcanvas-skills-smoke-'));
process.on('exit', () => rmSync(dir, { recursive: true, force: true }));
cpSync(resolve('test/smoke'), dir, { recursive: true });

const run = (args) => execFileSync('npm', args, { cwd: dir, stdio: 'inherit' });
run(['install', '--ignore-scripts', '--no-audit', '--no-fund']);
run(['run', 'check']);

console.log('Direct Engine, React, and Web Components package surfaces compile.');
