# Changelog

## 1.0.1

No changes to the game logic.

- Added `repository`, `bugs`, and `homepage` to `package.json`, so the npm page links to the GitHub repository.
- Added a Svelte 5 example to the README that shows `slide`, `canMove`, `hasMoves`, and `spawn` working together.

## 1.0.0

Initial release.

- `move(board, direction)` slides and merges tiles in any direction and returns a new board.
- `spawn(board, rng?)` places a 2 or 4 in a random empty cell, with an optional `rng` for repeatable results.
- `hasMoves(board)` reports whether the game can continue.
- `canMove(board, direction)` reports whether a single direction would change the board.
- `slide(board, direction)` does the same as `move` and also returns the points earned by the merges.
