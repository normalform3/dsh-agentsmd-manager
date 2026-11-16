import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export class AiJournal {
  constructor(home) { this.dir = path.join(home, 'agentsmd-manager', 'requests'); }

  async start(request) {
    await fs.mkdir(this.dir, { recursive: true, mode: 0o700 });
    const file = path.join(this.dir, `${randomUUID()}.json`);
    const record = { createdAt: new Date().toISOString(), status: 'pending', request };
    await fs.writeFile(file, JSON.stringify(record, null, 2), { flag: 'wx', mode: 0o600 });
    return async (status, response) => {
      record.status = status;
      record.completedAt = new Date().toISOString();
      record.response = response;
      await fs.writeFile(file, JSON.stringify(record, null, 2), { mode: 0o600 });
    };
  }
}
