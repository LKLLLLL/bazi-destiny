import assert from 'node:assert/strict';
import BaZiEngine from '../src/lib/bazi/engine.ts';

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

console.log(`bazi-engine: 8 anchors passed (${process.env.TZ || 'system timezone'})`);
