import { test } from 'node:test';
import assert from 'node:assert/strict';
import { move, slide } from '../src/move.js';

const DIRECTIONS = ['left', 'right', 'up', 'down'];

const isVertical = (direction) => direction === 'up' || direction === 'down';
const isReversed = (direction) => direction === 'right' || direction === 'down';

const empty = () => [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

// Lays a line out in the first lane of an empty board so that index 0 is the
// side the tiles move toward, whichever direction is being tested.
const put = (line, direction) => {
  const board = empty();
  const ordered = isReversed(direction) ? [...line].reverse() : line;
  ordered.forEach((value, i) => {
    if (isVertical(direction)) board[i][0] = value;
    else board[0][i] = value;
  });
  return board;
};

const read = (board, direction) => {
  const line = isVertical(direction) ? board.map((row) => row[0]) : board[0];
  return isReversed(direction) ? [...line].reverse() : [...line];
};

const board = () => [
  [2, 0, 2, 4],
  [0, 4, 4, 4],
  [2, 2, 0, 0],
  [0, 0, 0, 8],
];

const lineCases = [
  ['2 2 2 2 becomes 4 4, not 8', [2, 2, 2, 2], [4, 4, 0, 0], 8],
  ['4 4 8 becomes 8 8, not 16', [4, 4, 8, 0], [8, 8, 0, 0], 8],
  ['4 4 4 4 becomes 8 8', [4, 4, 4, 4], [8, 8, 0, 0], 16],
  ['2 2 4 4 becomes 4 8', [2, 2, 4, 4], [4, 8, 0, 0], 12],
  ['three equal tiles merge the pair nearest the wall', [2, 2, 2, 0], [4, 2, 0, 0], 4],
  ['a merged tile does not merge again', [2, 2, 4, 0], [4, 4, 0, 0], 4],
  ['tiles slide across gaps before merging', [2, 0, 2, 2], [4, 2, 0, 0], 4],
  ['a lone tile slides all the way to the wall', [0, 0, 0, 2], [2, 0, 0, 0], 0],
  ['unequal tiles never merge', [2, 4, 2, 4], [2, 4, 2, 4], 0],
];

for (const direction of DIRECTIONS) {
  for (const [name, line, expected] of lineCases) {
    test(`${direction}: ${name}`, () => {
      assert.deepEqual(read(move(put(line, direction), direction), direction), expected);
    });
  }
}

test('left slides and merges each row', () => {
  assert.deepEqual(move(board(), 'left'), [
    [4, 4, 0, 0],
    [8, 4, 0, 0],
    [4, 0, 0, 0],
    [8, 0, 0, 0],
  ]);
});

test('right slides and merges each row toward the right edge', () => {
  assert.deepEqual(move(board(), 'right'), [
    [0, 0, 4, 4],
    [0, 0, 4, 8],
    [0, 0, 0, 4],
    [0, 0, 0, 8],
  ]);
});

test('up slides and merges each column', () => {
  assert.deepEqual(move(board(), 'up'), [
    [4, 4, 2, 8],
    [0, 2, 4, 8],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
});

test('down slides and merges each column toward the bottom', () => {
  assert.deepEqual(move(board(), 'down'), [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 4, 2, 8],
    [4, 2, 4, 8],
  ]);
});

test('rows never merge with each other when moving sideways', () => {
  const stacked = [
    [2, 0, 0, 0],
    [2, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  assert.deepEqual(move(stacked, 'left'), stacked);
  assert.deepEqual(move(stacked, 'up')[0], [4, 0, 0, 0]);
});

test('columns never merge with each other when moving vertically', () => {
  const side = [
    [2, 2, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  assert.deepEqual(move(side, 'up'), side);
  assert.deepEqual(move(side, 'left')[0], [4, 0, 0, 0]);
});

test('a move that changes nothing returns an equal board in every direction', () => {
  const stuck = [
    [2, 4, 2, 4],
    [4, 2, 4, 2],
    [2, 4, 2, 4],
    [4, 2, 4, 2],
  ];
  for (const direction of DIRECTIONS) {
    assert.deepEqual(move(stuck, direction), stuck);
  }
});

test('tiles never appear or vanish: the total is the same after a move', () => {
  const total = (b) => b.flat().reduce((sum, value) => sum + value, 0);
  for (const direction of DIRECTIONS) {
    assert.equal(total(move(board(), direction)), total(board()));
  }
});

test('does not modify the input board', () => {
  for (const direction of DIRECTIONS) {
    const input = board();
    move(input, direction);
    assert.deepEqual(input, board());
  }
});

test('returns a new board whose rows are new arrays', () => {
  const stuck = [
    [2, 4, 2, 4],
    [4, 2, 4, 2],
    [2, 4, 2, 4],
    [4, 2, 4, 2],
  ];
  for (const input of [board(), stuck]) {
    for (const direction of DIRECTIONS) {
      const result = move(input, direction);
      assert.notEqual(result, input);
      result.forEach((row, r) => assert.notEqual(row, input[r]));
    }
  }
});

test('rejects an unknown direction', () => {
  assert.throws(() => move(board(), 'sideways'), /Unknown direction/);
  assert.throws(() => move(board(), undefined), /Unknown direction/);
});

test('slide returns the same board as move', () => {
  for (const direction of DIRECTIONS) {
    assert.deepEqual(slide(board(), direction).board, move(board(), direction));
  }
});

for (const direction of DIRECTIONS) {
  for (const [name, line, , gained] of lineCases) {
    test(`slide ${direction}: gained for ${name}`, () => {
      assert.equal(slide(put(line, direction), direction).gained, gained);
    });
  }
}

test('slide adds up the merges from every row and column', () => {
  assert.equal(slide(board(), 'left').gained, 4 + 8 + 4);
  assert.equal(slide(board(), 'right').gained, 4 + 8 + 4);
  assert.equal(slide(board(), 'up').gained, 4 + 8);
  assert.equal(slide(board(), 'down').gained, 4 + 8);
});

test('slide reports no points when nothing merges', () => {
  for (const direction of DIRECTIONS) {
    assert.equal(slide(board(), direction).board.length, 4);
    assert.equal(slide(put([2, 4, 8, 16], direction), direction).gained, 0);
  }
});

test('slide rejects an unknown direction', () => {
  assert.throws(() => slide(board(), 'sideways'), /Unknown direction/);
});
