import assert from 'node:assert/strict';
import BaZiEngine from '../src/lib/bazi/engine.ts';
import { GUARDIAN_SPIRITS, getGuardianSpirit } from '../src/lib/bazi/guardian-spirits.ts';

assert.equal(GUARDIAN_SPIRITS.length, 81, 'the guardian roster should contain exactly 81 figures');
assert.equal(new Set(GUARDIAN_SPIRITS.map((spirit) => spirit.chinese)).size, 81, 'Chinese names should be unique');
assert.equal(new Set(GUARDIAN_SPIRITS.map((spirit) => spirit.name)).size, 81, 'English names should be unique');
assert.ok(GUARDIAN_SPIRITS.every((spirit) => spirit.name && spirit.title && spirit.background.endsWith('.')));

const chart = BaZiEngine.calculate('1990-06-15', 9);
assert.deepEqual(getGuardianSpirit(chart), getGuardianSpirit(chart), 'the same chart should produce a stable result');

const unknownHourChart = { ...chart, isThreePillar: true };
const changedUnknownHourChart = {
  ...unknownHourChart,
  elements: {
    dominant: '水',
    counts: { 木: 9, 火: 1, 土: 8, 金: 2, 水: 7 },
  },
  pillars: {
    ...unknownHourChart.pillars,
    hour: { ...unknownHourChart.pillars.hour, stemIdx: 8, branchIdx: 11 },
  },
};
assert.deepEqual(
  getGuardianSpirit(unknownHourChart),
  getGuardianSpirit(changedUnknownHourChart),
  'three-pillar matching should ignore the placeholder hour pillar',
);

console.log('Guardian Spirit roster and matching tests passed.');
