import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { AgentsStore } from '../lib/store.js';

test('lists nested AGENTS.md and searches content', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dsh-agents-'));
  await mkdir(path.join(root, 'src'));
  await writeFile(path.join(root, 'AGENTS.md'), 'Root rule');
  await writeFile(path.join(root, 'src', 'AGENTS.md'), 'Use TypeScript');
  const store = new AgentsStore({ workspaces: () => [{ id: 'one', path: root, title: 'One' }], home: root, agentsHome: path.join(root, 'shared') });
  const list = await store.list();
  assert.deepEqual(list.workspaces[0].files.map(f => f.relativePath), ['AGENTS.md', 'src/AGENTS.md']);
  assert.equal((await store.search('typescript')).length, 1);
});

test('rejects traversal and stale writes while preserving original content', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dsh-agents-'));
  await writeFile(path.join(root, 'AGENTS.md'), 'old');
  const store = new AgentsStore({ workspaces: () => [{ id: 'one', path: root }], home: root, agentsHome: path.join(root, 'shared') });
  await assert.rejects(store.read({ scope: 'workspace', workspaceId: 'one', relativePath: '../AGENTS.md' }), /Invalid path/);
  const target = { scope: 'workspace', workspaceId: 'one', relativePath: 'AGENTS.md' };
  const first = await store.read(target);
  await writeFile(path.join(root, 'AGENTS.md'), 'external');
  await assert.rejects(store.save(target, 'new', first.version), /Conflict/);
  assert.equal(await readFile(path.join(root, 'AGENTS.md'), 'utf8'), 'external');
});

test('searches global instructions and rejects global symlinks', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dsh-agents-'));
  const agentsHome = path.join(root, 'shared');
  await mkdir(agentsHome);
  await writeFile(path.join(root, 'AGENTS.md'), 'Global instruction');
  await symlink(path.join(root, 'AGENTS.md'), path.join(agentsHome, 'AGENTS.md'));
  const store = new AgentsStore({ workspaces: () => [], home: root, agentsHome });
  const results = await store.search('Global instruction');
  assert.equal(results.length, 1);
  assert.deepEqual(results[0].target, { scope: 'global', index: 0 });
  await assert.rejects(store.read({ scope: 'global', index: 1 }), /Invalid path/);
});
