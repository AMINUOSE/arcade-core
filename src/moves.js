import { move } from './move.js';

const DIRECTIONS = ['left', 'right', 'up', 'down'];

const sameBoard = (a, b) => a.every((row, r) => row.every((value, c) => value === b[r][c]));

/**
 * Whether sliding in the given direction would change the board.
 *
 * @param {number[][]} board
 * @param {'left' | 'right' | 'up' | 'down'} direction
 * @returns {boolean}
 */
export function canMove(board, direction) {
  return !sameBoard(board, move(board, direction));
}

/**
 * Whether any direction would still change the board. False means game over.
 *
 * @param {number[][]} board
 * @returns {boolean}
 */
export function hasMoves(board) {
  return DIRECTIONS.some((direction) => canMove(board, direction));
}
