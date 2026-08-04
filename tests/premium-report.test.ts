import assert from 'node:assert/strict';
import BaZiEngine from '../src/lib/bazi/engine.ts';
import { getLifestyleGuide } from '../src/lib/bazi/lifestyle.ts';
import { getPremiumReport } from '../src/lib/bazi/premium-report.ts';

const data = BaZiEngine.calculate('1990-06-15', 10);
const report = getPremiumReport(data);

assert.equal(report.length, 12, 'paid Life Blueprint contains 12 sections');
assert.deepEqual(report.map((section) => section.number), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
assert.deepEqual(report.map((section) => section.key), [
  'chart-overview',
  'day-master',
  'element-balance',
  'career',
  'wealth',
  'relationships',
  'health',
  'communication',
  'growth',
  'daily-alignment',
  'lucky-elements',
  'feng-shui',
]);
assert.doesNotMatch(report[1].title, /Balanced Soul/, 'Day Master uses its own element-specific profile');

for (const section of report) {
  assert.ok(section.intro.length > 40, `${section.title} has a substantive introduction`);
  assert.ok(section.groups.length > 0, `${section.title} has detailed content`);
  assert.ok(section.groups.every((group) => group.items.length > 0), `${section.title} has no empty content groups`);
}

const woodGuide = getLifestyleGuide('木', '甲');
assert.match(woodGuide.wear[0], /Green/, 'Chinese element keys select the matching lifestyle guide');

console.log('premium-report: 12 complete paid sections passed');
