import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { AiJournal } from '../lib/ai-journal.js';

test('records exact model input before dispatch and settles the result', async () => {
  const home = await mkdtemp(path.join(tmpdir(), 'dsh-agents-journal-'));
  const journal = new AiJournal(home);
  const request = { provider: 'test', model: 'one', messages: [{ role: 'user', content: [{ type: 'text', text: 'draft and context' }] }] };
  const settle = await journal.start(request);
  const dir = path.join(home, 'agentsmd-manager', 'requests');
  const file = path.join(dir, (await readdir(dir))[0]);
  assert.deepEqual(JSON.parse(await readFile(file, 'utf8')).request, request);
  assert.equal((await stat(file)).mode & 0o777, 0o600);
  await settle('stop', { content: 'proposal' });
  assert.equal(JSON.parse(await readFile(file, 'utf8')).response.content, 'proposal');
});
