// Verify the built output against legacy URL list (optional — skips if url list missing).
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../.vercel/output/static/', import.meta.url).pathname;
const URL_FILE = new URL('../../live/urls.txt', import.meta.url);

if (!existsSync(URL_FILE)) {
  console.log('verify-dist: urls.txt not found — skipping verification');
  process.exit(0);
}

const urls = readFileSync(URL_FILE, 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean);

let missing = 0;
for (const url of urls) {
  const path = url.replace('https://mybazidestiny.com', '') || '/';
  const file = path === '/' ? 'index.html' : path.replace(/^\//, '');
  if (!existsSync(join(ROOT, file))) {
    console.log(`MISSING  ${path}`);
    missing++;
  }
}
console.log(missing === 0 ? `✓ all ${urls.length} legacy URLs present` : `✗ ${missing} missing`);
process.exit(missing === 0 ? 0 : 1);
