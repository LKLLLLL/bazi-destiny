import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const errors = [];

async function source(path) {
  return readFile(new URL(path, root), 'utf8');
}

function requireMatch(path, value, pattern, message) {
  if (!pattern.test(value)) errors.push(`${path}: ${message}`);
}

const [brand, index, pricing, methodology, testCases, testCaseData, llms, sitemap, products, indexNow, indexNowKey] = await Promise.all([
  source('src/lib/brand.ts'),
  source('src/pages/index.astro'),
  source('src/pages/pricing.astro'),
  source('src/pages/methodology.astro'),
  source('src/pages/test-cases.astro'),
  source('src/data/public-bazi-test-cases.ts'),
  source('public/llms.txt'),
  source('src/pages/sitemap.xml.ts'),
  source('src/lib/paypal/products.ts'),
  source('scripts/indexnow-submit.mjs'),
  source('public/272bd5de5baf4ae5b83bf3b043803fa9.txt'),
]);

requireMatch('src/lib/brand.ts', brand, /BRAND_NAME = 'MyBaziDestiny'/, 'canonical brand constant is missing');
requireMatch('src/lib/brand.ts', brand, /BaZi Destiny.*My Bazi Destiny/s, 'brand aliases are missing');
requireMatch('src/pages/index.astro', index, /alternateName:\s*BRAND_ALIASES/, 'Organization/WebSite aliases are missing');
requireMatch('src/pages/index.astro', index, /ORGANIZATION_ID/, 'stable Organization identifier is missing');
requireMatch('src/pages/pricing.astro', pricing, /Basic Reading[\s\S]*9\.90[\s\S]*4\.90/, 'official product prices are incomplete');
requireMatch('src/pages/pricing.astro', pricing, /no subscription/i, 'no-subscription fact is missing');
requireMatch('src/pages/methodology.astro', methodology, /Li Chun[\s\S]*Jie solar terms[\s\S]*23:00 through 00:59/, 'core calculation rules are incomplete');
requireMatch('src/pages/methodology.astro', methodology, /static UTC offsets[\s\S]*historical timezone/i, 'timezone limitation is missing');
requireMatch('src/pages/test-cases.astro', testCases, /TechArticle[\s\S]*Dataset[\s\S]*test-cases\.json/, 'public test case schemas or JSON distribution are missing');
requireMatch('src/pages/test-cases.astro', testCases, /does not calculate Hidden Stems/, 'unsupported Hidden Stems scope is not disclosed');
requireMatch('src/data/public-bazi-test-cases.ts', testCaseData, /li-chun-2024[\s\S]*jing-zhe-2024[\s\S]*zi-hour-2024[\s\S]*chengdu-solar-time-2024/, 'public boundary test vectors are incomplete');
requireMatch('public/llms.txt', llms, /Canonical website: https:\/\/mybazidestiny\.com\//, 'canonical website is missing');
requireMatch('public/llms.txt', llms, /USD 9\.90[\s\S]*USD 4\.90/, 'official prices are missing');
requireMatch('public/llms.txt', llms, /test-cases\.html[\s\S]*test-cases\.json/, 'public test case sources are missing');
requireMatch('src/pages/sitemap.xml.ts', sitemap, /pricing\.html[\s\S]*methodology\.html[\s\S]*test-cases\.html/, 'fact pages are absent from sitemap');
requireMatch('src/lib/paypal/products.ts', products, /TEMPORARY_FREE_ACCESS = false/, 'temporary free mode must remain disabled for the published prices');
requireMatch('scripts/indexnow-submit.mjs', indexNow, /api\.indexnow\.org\/indexnow/, 'IndexNow endpoint is missing');
requireMatch('public/272bd5de5baf4ae5b83bf3b043803fa9.txt', indexNowKey, /^272bd5de5baf4ae5b83bf3b043803fa9\n?$/, 'IndexNow verification key is invalid');

if (errors.length) {
  console.error(`GEO audit failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('GEO audit passed: canonical entity, official offers, methodology, public test cases, llms.txt, and sitemap sources verified.');
