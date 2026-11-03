import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canMove, hasMoves } from '../src/index.js';

const DIRECTIONS = ['left', 'right', 'up', 'down'];

const empty = () => [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const stuck = () => [
  [2, 4, 2, 4],
  [4, 2, 4, 2],
  [2, 4, 2, 4],
  [4, 2, 4, 2],
];

// Full boards with exactly one pair of equal neighbours, so only one axis can merge.
const sidewaysOnly = () => [
  [2, 2, 4, 8],
  [4, 8, 16, 32],
  [8, 16, 32, 64],
  [16, 32, 64, 128],
];

const verticalOnly = () => sidewaysOnly()[0].map((_, c) => sidewaysOnly().map((row) => row[c]));

const withTile = (r, c, value = 2) => {
  const board = empty();
  board[r][c] = value;
  return board;
};

const canMoveIn = (board) => Object.fromEntries(DIRECTIONS.map((d) => [d, canMove(board, d)]));

test('canMove is false in every direction on an empty board', () => {
  assert.deepEqual(canMoveIn(empty()), { left: false, right: false, up: false, down: false });
});

test('canMove is true only for directions with room to slide: top-left corner', () => {
  assert.deepEqual(canMoveIn(withTile(0, 0)), { left: false, right: true, up: false, down: true });
});

test('canMove is true only for directions with room to slide: bottom-right corner', () => {
  assert.deepEqual(canMoveIn(withTile(3, 3)), { left: true, right: false, up: true, down: false });
});

test('canMove is true for a tile in the middle in every direction', () => {
  assert.deepEqual(canMoveIn(withTile(1, 2)), { left: true, right: true, up: true, down: true });
});

test('canMove is true when two equal neighbours would merge in place', () => {
  const board = empty();
  board[0][0] = 2;
  board[0][1] = 2;
  assert.equal(canMove(board, 'left'), true);
});

test('canMove is false when a packed row is blocked by a different tile', () => {
  const board = empty();
  board[0] = [2, 4, 8, 16];
  assert.equal(canMove(board, 'left'), false);
  assert.equal(canMove(board, 'right'), false);
});

test('canMove is false in every direction on a stuck full board', () => {
  assert.deepEqual(canMoveIn(stuck()), { left: false, right: false, up: false, down: false });
});

test('canMove sees a merge that only exists sideways on a full board', () => {
  const board = sidewaysOnly();
  assert.equal(canMove(board, 'left'), true);
  assert.equal(canMove(board, 'right'), true);
  assert.equal(canMove(board, 'up'), false);
  assert.equal(canMove(board, 'down'), false);
});

test('canMove sees a merge that only exists vertically on a full board', () => {
  const board = verticalOnly();
  assert.equal(canMove(board, 'up'), true);
  assert.equal(canMove(board, 'down'), true);
  assert.equal(canMove(board, 'left'), false);
  assert.equal(canMove(board, 'right'), false);
});

test('canMove does not modify the board', () => {
  const board = stuck();
  for (const direction of DIRECTIONS) canMove(board, direction);
  assert.deepEqual(board, stuck());
});

test('canMove rejects an unknown direction', () => {
  assert.throws(() => canMove(stuck(), 'sideways'), /Unknown direction/);
});

test('hasMoves is true when a single tile can still slide', () => {
  assert.equal(hasMoves(withTile(0, 0)), true);
  assert.equal(hasMoves(withTile(3, 3)), true);
});

test('hasMoves is true on a nearly full board with one gap', () => {
  const board = stuck();
  board[2][2] = 0;
  assert.equal(hasMoves(board), true);
});

test('hasMoves is true on a full board with one horizontal merge left', () => {
  assert.equal(hasMoves(sidewaysOnly()), true);
});

test('hasMoves is true on a full board with one vertical merge left', () => {
  assert.equal(hasMoves(verticalOnly()), true);
});

test('hasMoves is false on a full board with no equal neighbours', () => {
  assert.equal(hasMoves(stuck()), false);
});

test('hasMoves is false on a stuck board of large tiles', () => {
  const board = [
    [2, 4, 8, 16],
    [4, 8, 16, 32],
    [8, 16, 32, 2048],
    [16, 32, 2048, 4096],
  ];
  assert.equal(hasMoves(board), false);
});

test('hasMoves does not modify the board', () => {
  const board = stuck();
  hasMoves(board);
  assert.deepEqual(board, stuck());
});
