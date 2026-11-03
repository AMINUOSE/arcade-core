import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeRow } from '../src/mergeRow.js';

const cases = [
  ['2 2 2 2 becomes 4 4, not 8', [2, 2, 2, 2], [4, 4, 0, 0], 8],
  ['4 4 8 becomes 8 8, not 16', [4, 4, 8, 0], [8, 8, 0, 0], 8],
  ['4 4 4 4 becomes 8 8', [4, 4, 4, 4], [8, 8, 0, 0], 16],
  ['2 2 4 4 becomes 4 8', [2, 2, 4, 4], [4, 8, 0, 0], 12],
  ['2 2 2 merges the leading pair, leaving the last 2', [2, 2, 2, 0], [4, 2, 0, 0], 4],
  ['a merged tile does not merge again: 2 2 4 becomes 4 4', [2, 2, 4, 0], [4, 4, 0, 0], 4],
  ['tiles slide across gaps before merging', [2, 0, 2, 0], [4, 0, 0, 0], 4],
  ['tiles separated by a different tile do not merge', [2, 4, 2, 0], [2, 4, 2, 0], 0],
  ['a lone tile slides to the front', [0, 0, 0, 2], [2, 0, 0, 0], 0],
  ['a row with no equal neighbours is unchanged', [2, 4, 2, 4], [2, 4, 2, 4], 0],
  ['an empty row stays empty', [0, 0, 0, 0], [0, 0, 0, 0], 0],
];

for (const [name, input, row, gained] of cases) {
  test(name, () => {
    assert.deepEqual(mergeRow(input), { row, gained });
  });
}

test('keeps the length of the row it is given', () => {
  assert.deepEqual(mergeRow([2, 2, 2]), { row: [4, 2, 0], gained: 4 });
  assert.deepEqual(mergeRow([0, 2, 0, 2, 0]), { row: [4, 0, 0, 0, 0], gained: 4 });
});

test('gained is the sum of every merged tile', () => {
  assert.equal(mergeRow([8, 8, 2, 2]).gained, 16 + 4);
});

test('does not modify its input and returns a new array', () => {
  const input = [2, 2, 4, 4];
  const { row } = mergeRow(input);
  assert.deepEqual(input, [2, 2, 4, 4]);
  assert.notEqual(row, input);
});

test('returns a new array even when nothing changes', () => {
  const input = [2, 4, 2, 4];
  assert.notEqual(mergeRow(input).row, input);
});
