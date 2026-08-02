import assert from 'node:assert/strict';
import BaZiEngine from '../src/lib/bazi/engine.ts';
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

const publicObservations = PUBLIC_BAZI_TEST_CASES.reduce((total, testCase) => total + testCase.observations.length, 0);
console.log(`bazi-engine: 8 anchors and ${publicObservations} public boundary observations passed (${process.env.TZ || 'system timezone'})`);
