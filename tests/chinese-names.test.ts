import assert from 'node:assert/strict';
import { generateChineseNames } from '../src/lib/chinese-names.ts';

const first = generateChineseNames({
  birthDate: '1990-06-15',
  birthHour: 9,
  englishName: 'Alex',
  gender: 'neutral',
});

assert.equal(first.names.length, 3);
assert.equal(new Set(first.names.map((name) => name.hanzi)).size, 3);
assert.ok(first.names.every((name) => name.hanzi.length === 2));
assert.ok(first.names.every((name) => name.sourceQuote && name.characters.length === 2));
assert.deepEqual(first.names.map((name) => name.inspirationLabel), [
  'Classical poetry choice',
  'Birth season choice',
  'Herbal & botanical choice',
]);
assert.deepEqual(
  first,
  generateChineseNames({ birthDate: '1990-06-15', birthHour: 9, englishName: 'Alex', gender: 'neutral' }),
  'the same inputs should produce stable results',
);

const botanical = generateChineseNames({ birthDate: '1997-03-20', gender: 'feminine' });
assert.equal(botanical.names.length, 3);
assert.ok(['杜若', '辛夷', '紫苏', '青黛'].includes(botanical.names[2].hanzi));

console.log('Chinese name generator tests passed.');
