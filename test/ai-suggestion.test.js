import { test } from 'node:test';
import assert from 'node:assert/strict';
import { collectSuggestion } from '../index.js';

test('AI failure and cancellation never return an editable proposal', async () => {
  const statuses = [];
  const journal = { start: async () => async status => { statuses.push(status); } };
  const options = { provider: 'test', model: 'test', messages: [] };
  const failed = { stream: async function* () { yield { type: 'text-delta', text: 'partial' }; yield { type: 'finish', reason: { kind: 'error', failure: { message: 'provider failed' } } }; } };
  await assert.rejects(collectSuggestion(failed, options, new AbortController().signal, journal), /provider failed/);
  const controller = new AbortController();
  const aborted = { stream: async function* (request) { controller.abort(); assert.equal(request.signal.aborted, true); yield { type: 'finish', reason: { kind: 'aborted', failure: { message: 'canceled' } } }; } };
  await assert.rejects(collectSuggestion(aborted, options, controller.signal, journal), /canceled/);
  assert.deepEqual(statuses, ['error', 'aborted']);
});
