import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as api from '../src/index.js';

test('exports the four required functions plus slide', () => {
  assert.deepEqual(Object.keys(api).sort(), ['canMove', 'hasMoves', 'move', 'slide', 'spawn']);
  for (const fn of Object.values(api)) assert.equal(typeof fn, 'function');
});

test('the functions work together on a plain board under Node', () => {
  const start = api.spawn([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  assert.equal(api.hasMoves(start), true);

  const direction = ['left', 'right', 'up', 'down'].find((d) => api.canMove(start, d));
  const { board, gained } = api.slide(start, direction);
  assert.deepEqual(board, api.move(start, direction));
  assert.equal(gained, 0);
});
