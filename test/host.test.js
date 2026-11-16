import { test } from 'node:test';
import assert from 'node:assert/strict';
import { allowedRequest } from '../index.js';

test('host rejects cross-origin mutation requests', () => {
  assert.equal(allowedRequest({ method: 'POST', headers: { host: '127.0.0.1:3080', origin: 'https://evil.example', 'content-type': 'application/json', 'x-dsh-agentsmd-manager': '1' } }), false);
  assert.equal(allowedRequest({ method: 'POST', headers: { host: '127.0.0.1:3080', origin: 'http://127.0.0.1:3080', 'content-type': 'application/json', 'x-dsh-agentsmd-manager': '1' } }), true);
});
