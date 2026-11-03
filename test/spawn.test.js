import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from '../src/index.js';

const empty = () => [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const full = () => [
  [2, 4, 2, 4],
  [4, 2, 4, 2],
  [2, 4, 2, 4],
  [4, 2, 4, 2],
];

// A constant rng keeps these tests independent of how often spawn calls it.
const always = (value) => () => value;

const filled = (board) => board.flat().filter((value) => value !== 0);

const seeded = (seed) => {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
};

test('picks the empty cell that rng points at', () => {
  assert.equal(spawn(empty(), always(0))[0][0] !== 0, true);
  assert.equal(spawn(empty(), always(0.5))[2][0] !== 0, true);
  assert.equal(spawn(empty(), always(0.99))[3][3] !== 0, true);
});

test('adds exactly one tile and leaves every other cell alone', () => {
  const board = [[2, 0, 0, 0], [0, 4, 0, 0], [0, 0, 8, 0], [0, 0, 0, 16]];
  const result = spawn(board, always(0.3));
  const changed = result.flat().filter((value, i) => value !== board.flat()[i]);
  assert.equal(changed.length, 1);
  assert.equal(filled(result).length, filled(board).length + 1);
});

test('only fills an empty cell', () => {
  const board = full();
  board[2][2] = 0;
  for (const value of [0, 0.4, 0.99]) {
    const result = spawn(board, always(value));
    assert.equal(result[2][2] !== 0, true);
    assert.deepEqual(result.flat().filter((v) => v === 0), []);
  }
});

test('spawns a 2 when the value roll is 0.1 or higher', () => {
  assert.equal(filled(spawn(empty(), always(0.1)))[0], 2);
  assert.equal(filled(spawn(empty(), always(0.5)))[0], 2);
  assert.equal(filled(spawn(empty(), always(0.99)))[0], 2);
});

test('spawns a 4 when the value roll is below 0.1', () => {
  assert.equal(filled(spawn(empty(), always(0)))[0], 4);
  assert.equal(filled(spawn(empty(), always(0.0999)))[0], 4);
});

test('spawns a 4 about one time in ten', () => {
  const rng = seeded(2048);
  let fours = 0;
  const runs = 5000;
  for (let i = 0; i < runs; i++) {
    if (filled(spawn(empty(), rng))[0] === 4) fours++;
  }
  assert.ok(fours / runs > 0.07 && fours / runs < 0.13, `got ${fours} fours in ${runs}`);
});

test('every empty cell can be chosen', () => {
  const rng = seeded(7);
  const seen = new Set();
  for (let i = 0; i < 500; i++) {
    const result = spawn(empty(), rng);
    seen.add(result.flat().findIndex((value) => value !== 0));
  }
  assert.equal(seen.size, 16);
});

test('the same rng sequence gives the same board', () => {
  assert.deepEqual(spawn(empty(), seeded(11)), spawn(empty(), seeded(11)));
});

test('does not modify the input board', () => {
  const board = empty();
  spawn(board, always(0.5));
  assert.deepEqual(board, empty());
});

test('returns a new board whose rows are new arrays', () => {
  const board = empty();
  const result = spawn(board, always(0.5));
  assert.notEqual(result, board);
  result.forEach((row, r) => assert.notEqual(row, board[r]));
});

test('returns an unchanged copy when the board is full', () => {
  const board = full();
  const result = spawn(board, always(0.5));
  assert.deepEqual(result, full());
  assert.notEqual(result, board);
  result.forEach((row, r) => assert.notEqual(row, board[r]));
});

test('defaults to Math.random and always spawns a 2 or a 4', () => {
  for (let i = 0; i < 100; i++) {
    const tiles = filled(spawn(empty()));
    assert.equal(tiles.length, 1);
    assert.ok(tiles[0] === 2 || tiles[0] === 4);
  }
});
