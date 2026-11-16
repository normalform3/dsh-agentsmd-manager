import { promises as fs } from 'node:fs';
import { randomUUID } from 'node:crypto';
import path from 'node:path';

export class Templates {
  constructor(home) { this.file = path.join(home, 'agentsmd-manager', 'templates.json'); }
  async list() {
    try { const value = JSON.parse(await fs.readFile(this.file, 'utf8')); return Array.isArray(value) ? value : []; }
    catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  }
  async write(items) {
    await fs.mkdir(path.dirname(this.file), { recursive: true, mode: 0o700 });
    const temp = `${this.file}.${randomUUID()}.tmp`;
    try { await fs.writeFile(temp, JSON.stringify(items, null, 2), { flag: 'wx', mode: 0o600 }); await fs.rename(temp, this.file); }
    finally { await fs.unlink(temp).catch(() => {}); }
  }
  async put(input) {
    const name = String(input?.name || '').trim();
    const content = input?.content;
    if (!name || name.length > 100 || typeof content !== 'string' || content.length > 65536) throw new Error('Invalid template');
    const items = await this.list();
    const item = { id: typeof input.id === 'string' && items.some(x => x.id === input.id) ? input.id : randomUUID(), name, content };
    const index = items.findIndex(x => x.id === item.id);
    if (index >= 0) items[index] = item; else items.push(item);
    await this.write(items);
    return item;
  }
  async remove(id) { const items = await this.list(); await this.write(items.filter(x => x.id !== id)); }
  apply(draft, content, mode, cursor = draft.length) {
    if (mode === 'replace') return content;
    if (mode === 'insert' && Number.isInteger(cursor) && cursor >= 0 && cursor <= draft.length) return draft.slice(0, cursor) + content + draft.slice(cursor);
    throw new Error('Invalid template mode');
  }
}
