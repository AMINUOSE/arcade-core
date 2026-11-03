import { mergeRow } from './mergeRow.js';

const DIRECTIONS = ['left', 'right', 'up', 'down'];

const transpose = (board) => board[0].map((_, col) => board.map((row) => row[col]));

/**
 * Same as move, but also reports the points earned by the merges.
 *
 * @param {number[][]} board
 * @param {'left' | 'right' | 'up' | 'down'} direction
 * @returns {{ board: number[][], gained: number }}
 */
export function slide(board, direction) {
  if (!DIRECTIONS.includes(direction)) {
    throw new Error(`Unknown direction: ${direction}`);
  }

  const vertical = direction === 'up' || direction === 'down';
  const reversed = direction === 'right' || direction === 'down';

  let lines = vertical ? transpose(board) : board;
  let gained = 0;

  lines = lines.map((line) => {
    const input = reversed ? [...line].reverse() : line;
    const result = mergeRow(input);
    gained += result.gained;
    return reversed ? result.row.reverse() : result.row;
  });

  return { board: vertical ? transpose(lines) : lines, gained };
}

/**
 * Slides every tile as far as it can go in the given direction and merges
 * equal neighbours once each. Returns a new board; the input is not modified.
 *
 * @param {number[][]} board
 * @param {'left' | 'right' | 'up' | 'down'} direction
 * @returns {number[][]}
 */
export function move(board, direction) {
  return slide(board, direction).board;
}
