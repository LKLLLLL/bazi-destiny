// Verify the built output against legacy URL list (optional — skips if url list missing).
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../.vercel/output/static/', import.meta.url).pathname;
const URL_FILE = new URL('../../live/urls.txt', import.meta.url);

const productImages = [
  'products/life-blueprint-1x1.png',
  'products/life-blueprint-4x3.png',
  'products/life-blueprint-16x9.png',
  'products/synergy-boost-guide-1x1.png',
  'products/synergy-boost-guide-4x3.png',
  'products/synergy-boost-guide-16x9.png',
];
const requiredFiles = ['index.html', 'pricing.html', 'methodology.html', 'test-cases.html', 'test-cases.json', 'llms.txt', 'sitemap.xml', '272bd5de5baf4ae5b83bf3b043803fa9.txt', ...productImages];
const errors = [];
for (const file of requiredFiles) {
  if (!existsSync(join(ROOT, file))) errors.push(`missing required output ${file}`);
}

if (errors.length === 0) {
  const index = readFileSync(join(ROOT, 'index.html'), 'utf8');
  const pricing = readFileSync(join(ROOT, 'pricing.html'), 'utf8');
  const methodology = readFileSync(join(ROOT, 'methodology.html'), 'utf8');
  const testCases = readFileSync(join(ROOT, 'test-cases.html'), 'utf8');
  const testCaseJson = JSON.parse(readFileSync(join(ROOT, 'test-cases.json'), 'utf8'));
  const llms = readFileSync(join(ROOT, 'llms.txt'), 'utf8');
  const sitemap = readFileSync(join(ROOT, 'sitemap.xml'), 'utf8');

  if (!index.includes('MyBaziDestiny')) errors.push('index.html: canonical brand missing');
  if (!index.includes('alternateName')) errors.push('index.html: structured brand aliases missing');
  if (!pricing.includes('9.90') || !pricing.includes('4.90')) errors.push('pricing.html: official prices missing');
  if (!pricing.includes('No physical item is shipped')) errors.push('pricing.html: visible digital delivery disclosure missing');

  const productJsonLd = [...pricing.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]))
    .filter((value) => value['@type'] === 'Product');
  if (productJsonLd.length !== 2) errors.push(`pricing.html: expected two Product JSON-LD objects, found ${productJsonLd.length}`);
  for (const product of productJsonLd) {
    if (!Array.isArray(product.image) || product.image.length !== 3) errors.push(`pricing.html: ${product.name} must include three product images`);
    if (product.brand?.['@type'] !== 'Brand' || product.brand?.name !== 'MyBaziDestiny') errors.push(`pricing.html: ${product.name} has an invalid brand object`);
    if (product.offers?.availability !== 'https://schema.org/OnlineOnly') errors.push(`pricing.html: ${product.name} is not marked as online-only`);
    if (product.aggregateRating || product.review) errors.push(`pricing.html: ${product.name} contains unverified rating or review data`);
  }
  if (!methodology.includes('Li Chun') || !methodology.includes('historical timezone')) errors.push('methodology.html: rules or limitations missing');
  if (!testCases.includes('li-chun-2024') || !testCases.includes('chengdu-solar-time-2024')) errors.push('test-cases.html: public boundary cases missing');
  if (!Array.isArray(testCaseJson.testCases) || testCaseJson.testCases.length !== 4) errors.push('test-cases.json: expected four public test cases');
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
