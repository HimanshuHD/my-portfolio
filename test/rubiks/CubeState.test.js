import test from 'node:test';
import assert from 'node:assert/strict';
import { createSolvedCube, isSolved, serializeCube } from '../../src/lib/rubiks/CubeState.js';
import { applyMove, applyMoves, invertMoves } from '../../src/lib/rubiks/CubeMoves.js';
import { createScramble } from '../../src/lib/rubiks/Scramble.js';

test('a new cube is solved', () => {
  const cube = createSolvedCube();
  assert.equal(isSolved(cube), true);
  assert.equal(serializeCube(cube).length, 54);
});

test('every quarter-turn followed by its inverse restores the cube', () => {
  for (const move of ['U', 'D', 'L', 'R', 'F', 'B']) {
    const cube = applyMove(createSolvedCube(), move);
    assert.equal(isSolved(applyMove(cube, `${move}'`)), true, `${move} inverse failed`);
  }
});

test('four quarter-turns restore the solved state', () => {
  for (const move of ['U', 'D', 'L', 'R', 'F', 'B']) {
    assert.equal(isSolved(applyMoves(createSolvedCube(), [move, move, move, move])), true, `${move} x4 failed`);
  }
});

test('double turns are equivalent to two quarter-turns', () => {
  for (const move of ['U', 'D', 'L', 'R', 'F', 'B']) {
    assert.equal(
      serializeCube(applyMove(createSolvedCube(), `${move}2`)),
      serializeCube(applyMoves(createSolvedCube(), [move, move])),
    );
  }
});

test('a sequence followed by its inverse restores the cube', () => {
  const moves = ['R', 'U', "R'", 'F2', 'D', "L'", 'B2'];
  const scrambled = applyMoves(createSolvedCube(), moves);
  assert.equal(isSolved(applyMoves(scrambled, invertMoves(moves))), true);
});

test('scramble generator creates legal, non-repeating-face scrambles', () => {
  const randomValues = Array.from({ length: 100 }, (_, index) => ((index * 37) % 100) / 100);
  let cursor = 0;
  const scramble = createScramble(20, () => randomValues[cursor++ % randomValues.length]);
  assert.equal(scramble.length, 20);
  for (let i = 0; i < scramble.length; i += 1) {
    assert.match(scramble[i], /^[UDLRFB][2']?$/);
    if (i > 0) assert.notEqual(scramble[i][0], scramble[i - 1][0]);
  }
});
