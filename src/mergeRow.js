/**
 * Slides one row toward index 0 and merges equal neighbours.
 * Each tile merges at most once per call.
 *
 * @param {number[]} row
 * @returns {{ row: number[], gained: number }} the new row and the points earned
 */
export function mergeRow(row) {
  const tiles = row.filter((value) => value !== 0);
  const merged = [];
  let gained = 0;

  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i] === tiles[i + 1]) {
      const value = tiles[i] * 2;
      merged.push(value);
      gained += value;
      i++;
    } else {
      merged.push(tiles[i]);
    }
  }

  while (merged.length < row.length) {
    merged.push(0);
  }

  return { row: merged, gained };
}
