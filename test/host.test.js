import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { Readable } from 'node:stream';
import { allowedRequest, apply, inject } from '../index.js';

test('host rejects cross-origin mutation requests', () => {
  assert.equal(allowedRequest({ method: 'POST', headers: { host: '127.0.0.1:3080', origin: 'https://evil.example', 'content-type': 'application/json', 'x-dsh-agentsmd-manager': '1' } }), false);
  assert.equal(allowedRequest({ method: 'POST', headers: { host: '127.0.0.1:3080', origin: 'http://127.0.0.1:3080', 'content-type': 'application/json', 'x-dsh-agentsmd-manager': '1' } }), true);
});

test('every HTTP route checks DSH access before reading the request body', async () => {
  const routes = [];
  let rejection = 401;
  const connection = { requestRejection: () => rejection };
  apply({
    connection,
    get: () => undefined,
    effect: register => register(),
    webServer: { register: route => { routes.push(route); return () => {}; } },
  });

  assert.ok(routes.length > 0);
  const request = async (route, body) => {
    const req = Readable.from([Buffer.from(body)]);
    req.method = 'POST';
    req.headers = { host: '127.0.0.1:3080', origin: 'http://127.0.0.1:3080', 'content-type': 'application/json', 'x-dsh-agentsmd-manager': '1' };
    const res = new EventEmitter();
    res.writeHead = status => { res.status = status; };
    res.end = data => { res.body = JSON.parse(data); };
    await route.handler(req, res);
    return res;
  };
  for (const route of routes) {
    const res = await request(route, '{');
    assert.equal(res.status, 401, route.path);
    assert.equal(res.body.ok, false, route.path);
  }
  rejection = 403;
  assert.equal((await request(routes[0], '{')).status, 403);
  rejection = undefined;
  const models = routes.find(route => route.path.endsWith('/models'));
  const accepted = await request(models, '{}');
  assert.equal(accepted.status, 200, JSON.stringify(accepted.body));
  assert.deepEqual(accepted.body, { ok: true, data: [] });
  assert.ok(inject.includes('connection'));
});
