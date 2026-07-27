// Verify the built output: every legacy URL from the live sitemap must exist.
import { existsSync, readFileSync } from 'node:fs';

const ROOT = new URL('../.vercel/output/static/', import.meta.url).pathname;
const urls = readFileSync(new URL('../../live/urls.txt', import.meta.url), 'utf8')
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
import { join } from 'node:path';
console.log(missing === 0 ? `✓ all ${urls.length} legacy URLs present` : `✗ ${missing} missing`);
process.exit(missing === 0 ? 0 : 1);
