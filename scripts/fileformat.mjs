// Post-build: convert directory-format pages (foo/index.html) to legacy .html
// files (foo.html) inside .vercel/output/static, preserving the site's exact
// pre-redesign URLs. The Vercel adapter forces directory format at build time,
// but Vercel's static hosting serves literal file paths, so foo.html works.
import { readdirSync, statSync, renameSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../.vercel/output/static/', import.meta.url).pathname;

function collapse(dir, relBase) {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    if (!statSync(abs).isDirectory()) continue;
    if (name.startsWith('_') || name === 'assets' || name === 'node_modules') continue;
    collapse(abs, join(relBase, name));
    const indexFile = join(abs, 'index.html');
    if (existsSync(indexFile) && readdirSync(abs).length === 1) {
      const target = join(dir, `${name}.html`);
      renameSync(indexFile, target);
      rmSync(abs, { recursive: true });
    }
  }
}

collapse(ROOT, '');
console.log('file-format: done');
