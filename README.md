# @aminuose/arcade-core

Pure game logic for 2048. Every function takes a board and returns a new one, with no side effects. The package does not import Svelte, does not touch the DOM, and runs under plain Node or in any browser.

## Install

```sh
npm install @aminuose/arcade-core
```

## Usage

```js
import { move, spawn, hasMoves, canMove } from '@aminuose/arcade-core';

let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

board = spawn(spawn(board));

if (canMove(board, 'left')) {
  board = spawn(move(board, 'left'));
}

if (!hasMoves(board)) {
  console.log('Game over');
}
```

## Board and directions

A board is a 4×4 array of rows. `0` is an empty cell and every other value is a tile.
Directions are `'left'`, `'right'`, `'up'`, and `'down'`.

## API

### `move(board, direction)`

Slides every tile as far as it can go in `direction`, merges equal neighbours once each, and returns the new board. The input board is not modified. Throws if `direction` is not one of the four above.

```js
move([[2, 2, 2, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], 'left')[0];
// [4, 4, 0, 0]
```

A tile merges at most once per move, so `2 2 2 2` becomes `4 4` and `4 4 8` becomes `8 8`.

### `spawn(board, rng?)`

Puts a new `2` (90% of the time) or `4` (10%) in a random empty cell and returns the new board. If the board is full, an unchanged copy is returned.

`rng` is an optional function that returns a number in `[0, 1)`. It defaults to `Math.random`. It is called once to pick the cell and once to pick the value, so the same sequence of values always produces the same board.

### `hasMoves(board)`

Returns `true` if any direction would still change the board, and `false` when the game is over.

### `canMove(board, direction)`

Returns `true` if sliding in `direction` would change the board, and `false` if nothing would happen. A move that changes nothing should not spawn a new tile.

### `slide(board, direction)`

Does the same work as `move` and also reports the points earned. Returns `{ board, gained }`, where `gained` is the total of every tile created by a merge.

```js
slide([[2, 2, 4, 4], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], 'left').gained;
// 4 + 8 = 12
```

## Development

```sh
npm test
```
