const FOUR_CHANCE = 0.1;

/**
 * Puts a new 2 (90%) or 4 (10%) in a random empty cell. Returns a new board;
 * a full board is returned as an unchanged copy.
 *
 * @param {number[][]} board
 * @param {() => number} [rng] returns a number in [0, 1), defaults to Math.random
 * @returns {number[][]}
 */
export function spawn(board, rng = Math.random) {
  const next = board.map((row) => [...row]);
  const empty = [];

  next.forEach((row, r) => {
    row.forEach((value, c) => {
      if (value === 0) empty.push([r, c]);
    });
  });

  if (empty.length === 0) return next;

  const [r, c] = empty[Math.floor(rng() * empty.length)];
  next[r][c] = rng() < FOUR_CHANCE ? 4 : 2;
  return next;
}
