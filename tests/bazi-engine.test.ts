import assert from 'node:assert/strict';
import BaZiEngine from '../src/lib/bazi/engine.ts';
import { getExpertVerdict } from '../src/lib/bazi/expert-reading.ts';
import { PUBLIC_BAZI_TEST_CASES } from '../src/data/public-bazi-test-cases.ts';
import { CITIES, solarTimeCorrection } from '../src/data/cities.ts';

function pillar(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return BaZiEngine.calculateFourPillars(year, month, day, 12).pillars;
}

for (const [date, expected] of [
  ['1949-10-01', '甲子'],
  ['2000-01-01', '戊午'],
  ['2024-02-10', '甲辰'],
] as const) {
  const day = pillar(date).day;
  assert.equal(day.stem + day.branch, expected, `${date} day pillar`);
}

assert.equal(pillar('2024-03-04').month.stem + pillar('2024-03-04').month.branch, '丙寅');
assert.equal(pillar('2024-03-15').month.stem + pillar('2024-03-15').month.branch, '丁卯');
assert.equal(pillar('2025-01-15').year.stem + pillar('2025-01-15').year.branch, '甲辰');

assert.deepEqual(BaZiEngine.solarToLunar(2024, 2, 10), {
  year: 2024,
  month: 1,
  day: 1,
  isLeap: false,
});
assert.deepEqual(BaZiEngine.solarToLunar(2025, 7, 30), {
  year: 2025,
  month: 6,
  day: 6,
  isLeap: true,
});

for (const testCase of PUBLIC_BAZI_TEST_CASES) {
  for (const observation of testCase.observations) {
    const [year, month, day] = observation.date.split('-').map(Number);
    const actual = BaZiEngine.calculateFourPillars(year, month, day, observation.effectiveHour).pillars;
    assert.deepEqual(
      {
        year: actual.year.stem + actual.year.branch,
        month: actual.month.stem + actual.month.branch,
        day: actual.day.stem + actual.day.branch,
        hour: actual.hour.stem + actual.hour.branch,
      },
      observation.expected,
      `${testCase.id}: ${observation.label}`
    );
  }
}

const chengdu = CITIES.find((city) => city.name === 'Chengdu');
assert.ok(chengdu, 'Chengdu public solar-time test city');
assert.ok(Math.abs(solarTimeCorrection(chengdu) - -63.6) < 1e-9, 'Chengdu longitude correction');

const referencePillars = BaZiEngine.calculateFourPillars(2025, 12, 15, 3).pillars;
const referenceVerdict = getExpertVerdict({
  pillars: referencePillars,
  elements: {
    percentages: { '木': 36, '火': 14, '土': 43, '金': 0, '水': 7 },
    dominant: '土',
    deficient: '金',
  },
}, 2026);
assert.equal(referenceVerdict.title, 'Pressure Is Meant to Become Authority');
assert.match(referenceVerdict.evidence[0], /杀印相生/);
assert.equal(referenceVerdict.timingTitle, '2026 丙午: A Year of Decisive Movement');
assert.match(referenceVerdict.timing, /午 directly clashes with the 戊子 pillar/);

const referenceVerdictZh = getExpertVerdict({
  pillars: referencePillars,
  elements: {
    percentages: { '木': 36, '火': 14, '土': 43, '金': 0, '水': 7 },
    dominant: '土',
    deficient: '金',
  },
}, 2026, 'zh');
assert.equal(referenceVerdictZh.title, '压力终会转化为权柄');
assert.match(referenceVerdictZh.evidence[0], /时干甲透出七杀/);
assert.match(referenceVerdictZh.evidence[0], /杀印相生/);
assert.equal(referenceVerdictZh.timingTitle, '2026 丙午：变动与决断之年');
assert.match(referenceVerdictZh.timing, /子午冲/);

const publicObservations = PUBLIC_BAZI_TEST_CASES.reduce((total, testCase) => total + testCase.observations.length, 0);
console.log(`bazi-engine: 8 anchors, ${publicObservations} public boundary observations, and the expert-reading reference case passed (${process.env.TZ || 'system timezone'})`);
