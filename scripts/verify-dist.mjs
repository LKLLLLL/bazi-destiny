// Verify the built output against legacy URL list (optional — skips if url list missing).
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../.vercel/output/static/', import.meta.url).pathname;
const URL_FILE = new URL('../../live/urls.txt', import.meta.url);

const requiredFiles = ['index.html', 'pricing.html', 'methodology.html', 'llms.txt', 'sitemap.xml'];
const errors = [];
for (const file of requiredFiles) {
  if (!existsSync(join(ROOT, file))) errors.push(`missing required output ${file}`);
}

if (errors.length === 0) {
  const index = readFileSync(join(ROOT, 'index.html'), 'utf8');
  const pricing = readFileSync(join(ROOT, 'pricing.html'), 'utf8');
  const methodology = readFileSync(join(ROOT, 'methodology.html'), 'utf8');
  const llms = readFileSync(join(ROOT, 'llms.txt'), 'utf8');
  const sitemap = readFileSync(join(ROOT, 'sitemap.xml'), 'utf8');

  if (!index.includes('MyBaziDestiny')) errors.push('index.html: canonical brand missing');
  if (!index.includes('alternateName')) errors.push('index.html: structured brand aliases missing');
  if (!pricing.includes('9.90') || !pricing.includes('4.90')) errors.push('pricing.html: official prices missing');
  if (!methodology.includes('Li Chun') || !methodology.includes('historical timezone')) errors.push('methodology.html: rules or limitations missing');
  if (!llms.includes('MyBaziDestiny') || !llms.includes('USD 9.90')) errors.push('llms.txt: canonical facts missing');

  const urlCount = (sitemap.match(/<url>/g) || []).length;
  const lastmodCount = (sitemap.match(/<lastmod>/g) || []).length;
  if (urlCount === 0 || urlCount !== lastmodCount) {
    errors.push(`sitemap.xml: ${urlCount} URLs but ${lastmodCount} lastmod values`);
  }

  const stalePattern = /Soul Guide|Destiny Master|Explorer(?:'s)? Reading|\$29\.90|Pro\s*\/\s*Ultimate|Limited-Time Free/gi;
  for (const file of readdirSync(ROOT).filter((name) => name.endsWith('.html'))) {
    const matches = readFileSync(join(ROOT, file), 'utf8').match(stalePattern);
    if (matches) errors.push(`${file}: stale offer text found (${[...new Set(matches)].join(', ')})`);
  }
}

if (errors.length) {
  console.error(`verify-dist failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('verify-dist: GEO outputs, offer text, and sitemap lastmod coverage verified');

if (!existsSync(URL_FILE)) {
  console.log('verify-dist: urls.txt not found — legacy URL verification skipped');
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
