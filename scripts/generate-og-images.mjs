// Build-time OG image generator for all blog posts.
// Runs as: node scripts/generate-og-images.mjs
// Generates public/og/*.png for each blog article.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const CONTENT_DIR = new URL('../src/content/blog/', import.meta.url).pathname;
const OUTPUT_DIR = new URL('../public/og/', import.meta.url).pathname;
const PRODUCT_OUTPUT_DIR = new URL('../public/products/', import.meta.url).pathname;

function svg(title, emoji) {
  const lines = title.length > 42 ? [title.slice(0, 42), title.slice(42)] : [title];
  const y = lines.length === 1 ? 370 : 350;
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#0a0a0f"/>
    <stop offset="40%" stop-color="#120f16"/>
    <stop offset="100%" stop-color="#1a130a"/>
  </linearGradient>
  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#d4af6a"/>
    <stop offset="50%" stop-color="#f0d89d"/>
    <stop offset="100%" stop-color="#d4af6a"/>
  </linearGradient>
  <radialGradient id="glow" cx="50%" cy="35%" r="45%">
    <stop offset="0%" stop-color="rgba(212,175,106,0.06)"/>
    <stop offset="100%" stop-color="rgba(212,175,106,0)"/>
  </radialGradient>
</defs>
<rect width="1200" height="630" fill="url(#bg)"/>
<rect width="1200" height="630" fill="url(#glow)"/>
<circle cx="600" cy="250" r="160" fill="none" stroke="rgba(212,175,106,0.1)" stroke-width="1"/>
<circle cx="600" cy="250" r="120" fill="none" stroke="rgba(212,175,106,0.06)" stroke-width="0.5"/>
<text x="600" y="258" text-anchor="middle" font-family="sans-serif" font-size="52">${esc(emoji)}</text>
<text x="600" y="${y}" text-anchor="middle" font-family="serif" font-size="42" font-weight="700" fill="url(#gold)" letter-spacing="1">${esc(lines[0])}</text>
${lines[1] ? `<text x="600" y="${y + 48}" text-anchor="middle" font-family="serif" font-size="42" font-weight="700" fill="url(#gold)" letter-spacing="1">${esc(lines[1])}</text>` : ''}
<text x="600" y="${y + (lines.length === 1 ? 60 : 110)}" text-anchor="middle" font-family="sans-serif" font-size="18" fill="rgba(200,195,180,0.4)" letter-spacing="3">BaZi Destiny · mybazidestiny.com</text>
</svg>`;
}

function productSvg({ title, subtitle, mark }, width, height) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const compact = width / height > 1.5;
  const titleSize = compact ? 64 : 76;
  const titleY = compact ? height * 0.58 : height * 0.61;
  const subtitleY = titleY + (compact ? 62 : 74);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<defs>
  <linearGradient id="product-bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#090b11"/>
    <stop offset="58%" stop-color="#151119"/>
    <stop offset="100%" stop-color="#21160d"/>
  </linearGradient>
  <linearGradient id="product-gold" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#b98b43"/>
    <stop offset="50%" stop-color="#f0d89d"/>
    <stop offset="100%" stop-color="#c99d55"/>
  </linearGradient>
</defs>
<rect width="${width}" height="${height}" fill="url(#product-bg)"/>
<rect x="${width * 0.045}" y="${height * 0.055}" width="${width * 0.91}" height="${height * 0.89}" rx="12" fill="none" stroke="rgba(212,175,106,0.28)" stroke-width="2"/>
<circle cx="${width / 2}" cy="${height * 0.34}" r="${height * 0.17}" fill="none" stroke="rgba(212,175,106,0.18)" stroke-width="2"/>
<circle cx="${width / 2}" cy="${height * 0.34}" r="${height * 0.125}" fill="rgba(212,175,106,0.035)" stroke="rgba(212,175,106,0.1)"/>
<text x="${width / 2}" y="${height * 0.1}" text-anchor="middle" font-family="sans-serif" font-size="${Math.max(18, width * 0.018)}" font-weight="600" fill="#d4af6a" letter-spacing="5">MYBAZIDESTINY</text>
<text x="${width / 2}" y="${height * 0.38}" text-anchor="middle" font-family="serif" font-size="${height * 0.14}" fill="url(#product-gold)">${esc(mark)}</text>
<text x="${width / 2}" y="${titleY}" text-anchor="middle" font-family="serif" font-size="${titleSize}" font-weight="700" fill="#f0d89d">${esc(title)}</text>
<text x="${width / 2}" y="${subtitleY}" text-anchor="middle" font-family="sans-serif" font-size="${compact ? 24 : 28}" fill="rgba(232,226,211,0.72)" letter-spacing="2">${esc(subtitle)}</text>
<text x="${width / 2}" y="${height * 0.88}" text-anchor="middle" font-family="sans-serif" font-size="${Math.max(17, width * 0.016)}" fill="rgba(232,226,211,0.46)" letter-spacing="3">PERSONALIZED DIGITAL GUIDE</text>
</svg>`;
}

if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });
if (!existsSync(PRODUCT_OUTPUT_DIR)) mkdirSync(PRODUCT_OUTPUT_DIR, { recursive: true });

// Read all blog post frontmatter (simple YAML frontmatter extraction)
const { readdirSync } = await import('node:fs');
const files = readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));

let count = 0;
for (const file of files) {
  const slug = file.replace('.md', '');
  const raw = readFileSync(join(CONTENT_DIR, file), 'utf-8');
  // Extract frontmatter
  const fm = {};
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (match) {
    const lines = match[1].split('\n');
    for (const line of lines) {
      const kv = line.match(/^(\w+):\s*(.+)/);
      if (kv) fm[kv[1]] = kv[2].replace(/^['"]|['"]$/g, '');
    }
  }
  const title = fm.title || slug.replace(/-/g, ' ');
  const emoji = fm.emoji || '☯';

  const png = await sharp(Buffer.from(svg(title, emoji)))
    .resize(1200, 630)
    .png({ compressionLevel: 9 })
    .toBuffer();

  writeFileSync(join(OUTPUT_DIR, `${slug}.png`), png);
  count++;
}

console.log(`generated ${count} OG images → public/og/`);

const products = [
  { slug: 'life-blueprint', title: 'Life Blueprint', subtitle: 'Your BaZi alignment guide', mark: '命' },
  { slug: 'synergy-boost-guide', title: 'Synergy Boost Guide', subtitle: 'Your relationship alignment guide', mark: '缘' },
];
const productSizes = [
  { suffix: '1x1', width: 1200, height: 1200 },
  { suffix: '4x3', width: 1200, height: 900 },
  { suffix: '16x9', width: 1200, height: 675 },
];

for (const product of products) {
  for (const size of productSizes) {
    const png = await sharp(Buffer.from(productSvg(product, size.width, size.height)))
      .png({ compressionLevel: 9 })
      .toBuffer();
    writeFileSync(join(PRODUCT_OUTPUT_DIR, `${product.slug}-${size.suffix}.png`), png);
  }
}

console.log(`generated ${products.length * productSizes.length} product images → public/products/`);
