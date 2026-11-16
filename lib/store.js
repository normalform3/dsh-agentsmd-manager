import { promises as fs } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';
import path from 'node:path';

const SKIP = new Set(['.git', '.hg', 'node_modules', '.venv', 'venv', 'dist', 'build', 'target', 'coverage', '.next']);
const MAX_BYTES = 1024 * 1024;
const hash = value => createHash('sha256').update(value).digest('hex');

function relativeFile(value) {
  if (typeof value !== 'string' || !value || value.includes('\\') || value.includes('\0') || path.isAbsolute(value)) throw new Error('Invalid path');
  const parts = value.split('/');
  if (parts.some(part => !part || part === '.' || part === '..') || parts.at(-1) !== 'AGENTS.md') throw new Error('Invalid path');
  return parts;
}

async function existingStat(file) {
  try { return await fs.lstat(file); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

export class AgentsStore {
  constructor({ workspaces, home, agentsHome }) {
    this.workspaces = workspaces;
    this.globalFiles = [path.join(home, 'AGENTS.md'), path.join(agentsHome, 'AGENTS.md')];
  }

  async resolve(target) {
    if (target?.scope === 'global' && Number.isInteger(target.index) && target.index >= 0 && target.index < 2) {
      const file = this.globalFiles[target.index];
      const stat = await existingStat(file);
      if (stat && (!stat.isFile() || stat.isSymbolicLink())) throw new Error('Invalid path');
      return file;
    }
    if (target?.scope !== 'workspace') throw new Error('Invalid target');
    const workspace = this.workspaces().find(item => String(item.id) === String(target.workspaceId));
    if (!workspace) throw new Error('Unknown workspace');
    const parts = relativeFile(target.relativePath);
    const root = await fs.realpath(workspace.path);
    let current = root;
    for (const part of parts.slice(0, -1)) {
      current = path.join(current, part);
      const stat = await fs.lstat(current);
      if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error('Invalid path');
    }
    const file = path.join(current, 'AGENTS.md');
    const stat = await existingStat(file);
    if (stat && (!stat.isFile() || stat.isSymbolicLink())) throw new Error('Invalid path');
    return file;
  }

  async read(target) {
    const file = await this.resolve(target);
    const stat = await existingStat(file);
    if (!stat) return { content: '', version: null, exists: false };
    if (!stat.isFile() || stat.size > MAX_BYTES) throw new Error('File is unavailable or too large');
    const content = await fs.readFile(file, 'utf8');
    return { content, version: hash(content), exists: true };
  }

  async save(target, content, expectedVersion) {
    if (typeof content !== 'string' || Buffer.byteLength(content) > MAX_BYTES) throw new Error('Invalid content');
    const file = await this.resolve(target);
    const current = await this.read(target);
    if (current.version !== expectedVersion) throw new Error('Conflict: file changed on disk');
    const previous = await existingStat(file);
    const temp = path.join(path.dirname(file), `.AGENTS.md.${randomUUID()}.tmp`);
    try {
      await fs.writeFile(temp, content, { flag: 'wx', mode: 0o600 });
      if (previous) await fs.chmod(temp, previous.mode);
      if ((await this.read(target)).version !== expectedVersion) throw new Error('Conflict: file changed on disk');
      await fs.rename(temp, file);
    } finally { await fs.unlink(temp).catch(() => {}); }
    return this.read(target);
  }

  async list() {
    const workspaces = [];
    for (const workspace of this.workspaces()) {
      const files = [];
      let truncated = false;
      try {
        const root = await fs.realpath(workspace.path);
        const queue = [{ dir: root, rel: '', depth: 0 }];
        let visited = 0;
        while (queue.length) {
          const item = queue.shift();
          if (++visited > 20000 || item.depth > 20) { truncated = true; break; }
          const entries = await fs.readdir(item.dir, { withFileTypes: true });
          for (const entry of entries) {
            const rel = item.rel ? `${item.rel}/${entry.name}` : entry.name;
            if (entry.isFile() && entry.name === 'AGENTS.md') files.push({ relativePath: rel, target: { scope: 'workspace', workspaceId: String(workspace.id), relativePath: rel } });
            if (entry.isDirectory() && !SKIP.has(entry.name)) queue.push({ dir: path.join(item.dir, entry.name), rel, depth: item.depth + 1 });
          }
        }
      } catch (error) { workspaces.push({ ...workspace, files, truncated, error: error.message }); continue; }
      files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
      workspaces.push({ ...workspace, id: String(workspace.id), files, truncated });
    }
    const global = await Promise.all(this.globalFiles.map(async (file, index) => ({ index, path: file, target: { scope: 'global', index }, exists: Boolean(await existingStat(file)) })));
    return { workspaces, global };
  }

  async search(query) {
    const q = String(query || '').trim().toLowerCase();
    if (!q) return [];
    const inventory = await this.list();
    const results = [];
    for (const workspace of inventory.workspaces) for (const file of workspace.files) {
      const heading = `${workspace.title || ''} ${workspace.path} ${file.relativePath}`.toLowerCase();
      if (heading.includes(q) || (await this.read(file.target)).content.toLowerCase().includes(q)) results.push({ workspaceId: workspace.id, title: workspace.title, ...file });
    }
    for (const global of inventory.global) {
      if (!global.exists) continue;
      if (global.path.toLowerCase().includes(q) || (await this.read(global.target)).content.toLowerCase().includes(q)) results.push({ title: 'Global', relativePath: global.path, target: global.target });
    }
    return results;
  }
}
