import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, resolve, sep } from 'node:path';

const ROOT = new URL('../.vercel/output/static/', import.meta.url).pathname;
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };
const SEED = [
  { name1: 'Liam', name2: 'Olivia', score: 97, tier: 'Soulmate Bond', elem1: 'Wood', elem2: 'Fire', ts: 1751000000000 },
  { name1: 'Noah', name2: 'Emma', score: 94, tier: 'Soulmate Bond', elem1: 'Water', elem2: 'Wood', ts: 1751100000000 },
  { name1: 'Ethan', name2: 'Ava', score: 92, tier: 'Soulmate Bond', elem1: 'Fire', elem2: 'Earth', ts: 1751200000000 },
  { name1: 'Mason', name2: 'Sophia', score: 89, tier: 'Strong Harmony', elem1: 'Earth', elem2: 'Metal', ts: 1751300000000 },
];

createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  let path;
  try { path = decodeURIComponent(u.pathname); }
  catch { res.writeHead(400); res.end('400 Bad Request'); return; }
  if (path === '/api/leaderboard') {
    if (req.method === 'POST') {
      let b = '';
      req.on('data', (c) => (b += c));
      req.on('end', () => {
        const e = JSON.parse(b || '{}');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, entry: { ...e, rank: 4 } }));
      });
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ entries: SEED, kv: false }));
    return;
  }
  let file = resolve(ROOT, `.${path}`);
  // Path traversal guard — never serve outside the static root.
  const root = resolve(ROOT);
  if (file !== root && !file.startsWith(root + sep)) { res.writeHead(404); res.end('404 ' + path); return; }
  if (path.endsWith('/')) file = join(ROOT, path, 'index.html');
  if (!existsSync(file) && !extname(path)) file = file + '.html';
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) { res.writeHead(404); res.end('404 ' + path); return; }
  res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
}).listen(4321, () => console.log('qa server on http://localhost:4321'));
