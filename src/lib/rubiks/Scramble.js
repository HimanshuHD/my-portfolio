import { MOVE_NAMES } from './CubeMoves';

export const MIN_SCRAMBLE_LENGTH = 10;
export const MAX_SCRAMBLE_LENGTH = 25;

export function createScramble(length, random = Math.random) {
  const scrambleLength = length ?? (
    MIN_SCRAMBLE_LENGTH
    + Math.floor(random() * (MAX_SCRAMBLE_LENGTH - MIN_SCRAMBLE_LENGTH + 1))
  );

  const scramble = [];
  let previousFace = null;

  while (scramble.length < scrambleLength) {
    const face = MOVE_NAMES[Math.floor(random() * MOVE_NAMES.length)];
    if (face === previousFace) continue;
    const suffixRoll = Math.floor(random() * 3);
    const suffix = suffixRoll === 0 ? '' : suffixRoll === 1 ? "'" : '2';
    scramble.push(`${face}${suffix}`);
    previousFace = face;
  }

  return scramble;
}

// A half-turn is displayed as U2/F2/etc. in scramble notation, but it is
// animated as two consecutive 90-degree turns so every animation uses the
// same fixed duration.
export function expandAnimationMoves(scramble) {
  return scramble.flatMap((move) => move.endsWith('2')
    ? [move[0], move[0]]
    : [move]);
}

export function scrambleToString(scramble) {
  return scramble.join(' ');
}
