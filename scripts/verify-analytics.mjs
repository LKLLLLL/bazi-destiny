import fs from 'node:fs';

const measurementId = 'G-LSKG39NRGF';
const requiredByFile = new Map([
  ['src/layouts/Base.astro', [measurementId]],
  ['src/components/ChineseNameGenerator.astro', ['generate_chinese_name', 'view_paywall', 'checkout_cancel']],
  ['src/components/StepCalculator.astro', ['generate_bazi_chart', 'view_paywall', 'checkout_cancel']],
  ['src/pages/love-match-result.astro', ['generate_love_match', 'view_offer', 'checkout_cancel']],
  ['src/components/PaymentModal.astro', ['click_payment', 'begin_checkout', 'view_paywall', 'checkout_error']],
  ['src/pages/success.astro', ['purchase']],
]);

const failures = [];
for (const [file, tokens] of requiredByFile) {
  const source = fs.readFileSync(file, 'utf8');
  for (const token of tokens) {
    if (!source.includes(token)) failures.push(`${file}: missing ${token}`);
  }
}

const layout = fs.readFileSync('src/layouts/Base.astro', 'utf8');
const configuredIds = [...layout.matchAll(/G-[A-Z0-9]+/g)].map((match) => match[0]);
const unexpectedIds = [...new Set(configuredIds.filter((id) => id !== measurementId))];
if (unexpectedIds.length) failures.push(`src/layouts/Base.astro: unexpected GA IDs ${unexpectedIds.join(', ')}`);

if (failures.length) {
  console.error(`Analytics audit failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

const requiredEventCount = new Set([...requiredByFile.values()].flat()).size;
console.log(`Analytics audit passed: ${measurementId} and ${requiredEventCount} funnel events verified.`);
