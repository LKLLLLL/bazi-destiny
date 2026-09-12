import { readFile, readdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const errors = [];

const [homeSource, calculatorSource, calculatorComponent, sitemapSource] = await Promise.all([
  readFile(new URL('src/pages/index.astro', root), 'utf8'),
  readFile(new URL('src/pages/calculator.astro', root), 'utf8'),
  readFile(new URL('src/components/StepCalculator.astro', root), 'utf8'),
  readFile(new URL('src/pages/sitemap.xml.ts', root), 'utf8'),
]);

if (/title="Free BaZi Calculator/i.test(homeSource)) {
  errors.push('index.astro: homepage must not compete with the calculator page for the primary calculator title');
}
if (!/title="Free BaZi Calculator & Four Pillars Analysis"/.test(calculatorSource)) {
  errors.push('calculator.astro: primary calculator search title is missing or changed');
}
if (!/>Free BaZi & Four Pillars of Destiny Calculator<\/h1>/.test(calculatorSource)) {
  errors.push('calculator.astro: primary calculator H1 is missing or changed');
}
if (/type="date"/.test(calculatorComponent) || !/Month \/ Day \/ Year/.test(calculatorComponent)) {
  errors.push('StepCalculator.astro: English date input must use an explicit Month / Day / Year interface');
}
if (/new Date\(\)\.toISOString\(\)/.test(sitemapSource)) {
  errors.push('sitemap.xml.ts: lastmod must describe content changes, not the build date');
}

function frontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const values = {};
  for (const line of match[1].split('\n')) {
    const field = line.match(/^(\w+):\s*(.*)$/);
    if (!field) continue;
    values[field[1]] = field[2].replace(/^['"]|['"]$/g, '');
  }
  return values;
}

const blogDir = new URL('src/content/blog/', root);
const blogFiles = (await readdir(blogDir)).filter((file) => file.endsWith('.md'));
const indexedMetadata = [];

for (const file of blogFiles) {
  const source = await readFile(new URL(file, blogDir), 'utf8');
  const data = frontmatter(source);
  for (const match of source.matchAll(/\]\((\/[^)#?]+\/)\)/g)) {
    if (match[1] !== '/') errors.push(`${file}: directory-style internal link ${match[1]} should use the canonical file URL`);
  }
  if (data.noindex === 'true') continue;
  const title = data.seoTitle || data.title || '';
  const description = data.description || '';
  indexedMetadata.push({ file, title, description });
  if (title.length < 30 || title.length > 60) errors.push(`${file}: SEO title is ${title.length} characters`);
  if (description.length < 120 || description.length > 160) errors.push(`${file}: description is ${description.length} characters`);
}

for (const field of ['title', 'description']) {
  const seen = new Map();
  for (const item of indexedMetadata) {
    const value = item[field].toLowerCase();
    if (seen.has(value)) errors.push(`${item.file}: duplicate ${field} also used by ${seen.get(value)}`);
    else seen.set(value, item.file);
  }
}

const bannedDestinyPatterns = [
  /Famous People Born/i,
  /Decade Luck Cycles/i,
  /Monthly Fortune/i,
  /同年出生的名人/,
  /十年大运周期/,
  /逐月运势/,
];

for (const language of ['en', 'zh']) {
  const file = `src/data/destiny-${language}.json`;
  const source = await readFile(new URL(file, root), 'utf8');
  const records = JSON.parse(source);
  for (const pattern of bannedDestinyPatterns) {
    if (pattern.test(source)) errors.push(`${file}: contains banned scaled-content pattern ${pattern}`);
  }
  const titles = new Set();
  const descriptions = new Set();
  for (const record of records) {
    if (record.sections.length < 5) errors.push(`${file}: ${record.slug} has fewer than five substantive sections`);
    if (record.faqs.length < 3) errors.push(`${file}: ${record.slug} has fewer than three FAQs`);
    if (titles.has(record.title)) errors.push(`${file}: duplicate title ${record.title}`);
    if (descriptions.has(record.description)) errors.push(`${file}: duplicate description for ${record.slug}`);
    titles.add(record.title);
    descriptions.add(record.description);
  }
}

if (errors.length) {
  console.error(`SEO audit failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`SEO audit passed: ${indexedMetadata.length} articles and 142 bilingual year pages checked.`);
