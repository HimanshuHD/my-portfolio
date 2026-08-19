import { applyQuarterTurn, MOVE_DEFINITIONS } from './CubeState';

export { MOVE_DEFINITIONS };

export const MOVE_NAMES = ['U', 'D', 'L', 'R', 'F', 'B'];

export function parseMove(move) {
  const match = /^([UDLRFB])([2']?)$/.exec(move);
  if (!match) throw new Error(`Invalid Rubik's Cube move: ${move}`);
  return { face: match[1], amount: match[2] === '2' ? 2 : match[2] === "'" ? -1 : 1 };
}

export function applyMove(cube, move) {
  const { face, amount } = parseMove(move);
  return applyQuarterTurn(cube, face, amount);
}

export function applyMoves(cube, moves) {
  return moves.reduce((current, move) => applyMove(current, move), cube);
}

export function inverseMove(move) {
  const { face, amount } = parseMove(move);
  if (amount === 2) return `${face}2`;
  return `${face}${amount === 1 ? "'" : ''}`;
}

export function invertMoves(moves) {
  return [...moves].reverse().map(inverseMove);
}
