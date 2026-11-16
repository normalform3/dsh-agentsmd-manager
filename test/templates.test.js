import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { Templates } from '../lib/templates.js';

test('persists multiple templates and applies one to a draft', async () => {
  const home = await mkdtemp(path.join(tmpdir(), 'dsh-templates-'));
  const templates = new Templates(home);
  const first = await templates.put({ name: 'General', content: 'Rule A' });
  const second = await templates.put({ name: 'Testing', content: 'Rule B' });
  assert.equal((await new Templates(home).list()).length, 2);
  assert.equal(templates.apply('Existing', second.content, 'insert', 8), 'ExistingRule B');
  assert.equal(templates.apply('Existing', first.content, 'replace'), 'Rule A');
});
