import { MOVE_NAMES } from './CubeMoves';

export function createScramble(length = 20, random = Math.random) {
  const scramble = [];
  let previousFace = null;

  while (scramble.length < length) {
    const face = MOVE_NAMES[Math.floor(random() * MOVE_NAMES.length)];
    if (face === previousFace) continue;
    const suffixRoll = Math.floor(random() * 3);
    const suffix = suffixRoll === 0 ? '' : suffixRoll === 1 ? "'" : '2';
    scramble.push(`${face}${suffix}`);
    previousFace = face;
  }

  return scramble;
}

export function scrambleToString(scramble) {
  return scramble.join(' ');
}
