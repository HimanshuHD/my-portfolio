export const FACE_NAMES = ['U', 'R', 'F', 'D', 'L', 'B'];

const NORMAL_TO_FACE = new Map([
  ['0,1,0', 'U'],
  ['1,0,0', 'R'],
  ['0,0,1', 'F'],
  ['0,-1,0', 'D'],
  ['-1,0,0', 'L'],
  ['0,0,-1', 'B'],
]);

const FACE_NORMALS = {
  U: [0, 1, 0], R: [1, 0, 0], F: [0, 0, 1],
  D: [0, -1, 0], L: [-1, 0, 0], B: [0, 0, -1],
};

const STICKER_COLORS = Object.fromEntries(FACE_NAMES.map((face) => [face, face]));

function key(vector) {
  return vector.join(',');
}

function createSticker(face, row, col) {
  const r = row - 1;
  const c = col - 1;
  switch (face) {
    case 'U': return { color: 'U', position: [c, 1, -r], normal: FACE_NORMALS.U.slice() };
    case 'R': return { color: 'R', position: [1, -r, -c], normal: FACE_NORMALS.R.slice() };
    case 'F': return { color: 'F', position: [c, -r, 1], normal: FACE_NORMALS.F.slice() };
    case 'D': return { color: 'D', position: [c, -1, r], normal: FACE_NORMALS.D.slice() };
    case 'L': return { color: 'L', position: [-1, -r, c], normal: FACE_NORMALS.L.slice() };
    case 'B': return { color: 'B', position: [-c, -r, -1], normal: FACE_NORMALS.B.slice() };
    default: throw new Error(`Unknown face: ${face}`);
  }
}

function createSolvedStickers() {
  const stickers = [];
  for (const face of FACE_NAMES) {
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        stickers.push(createSticker(face, row, col));
      }
    }
  }
  return stickers;
}

function rotateVector([x, y, z], axis, quarterTurns) {
  let result = [x, y, z];
  const turns = ((quarterTurns % 4) + 4) % 4;
  for (let i = 0; i < turns; i += 1) {
    if (axis === 'x') result = [result[0], -result[2], result[1]];
    if (axis === 'y') result = [result[2], result[1], -result[0]];
    if (axis === 'z') result = [-result[1], result[0], result[2]];
  }
  return result;
}

export const MOVE_DEFINITIONS = {
  U: { axis: 'y', layer: 1, quarterTurns: -1 },
  D: { axis: 'y', layer: -1, quarterTurns: 1 },
  R: { axis: 'x', layer: 1, quarterTurns: -1 },
  L: { axis: 'x', layer: -1, quarterTurns: 1 },
  F: { axis: 'z', layer: 1, quarterTurns: -1 },
  B: { axis: 'z', layer: -1, quarterTurns: 1 },
};

export function createSolvedCube() {
  return { stickers: createSolvedStickers() };
}

export function cloneCube(cube) {
  return { stickers: cube.stickers.map((sticker) => ({ ...sticker, position: sticker.position.slice(), normal: sticker.normal.slice() })) };
}

export function applyQuarterTurn(cube, face, quarterTurns = 1) {
  const definition = MOVE_DEFINITIONS[face];
  if (!definition) throw new Error(`Invalid face move: ${face}`);
  const next = cloneCube(cube);
  next.stickers = next.stickers.map((sticker) => {
    const axisIndex = definition.axis === 'x' ? 0 : definition.axis === 'y' ? 1 : 2;
    if (sticker.position[axisIndex] !== definition.layer) return sticker;
    const turns = definition.quarterTurns * quarterTurns;
    return {
      ...sticker,
      position: rotateVector(sticker.position, definition.axis, turns),
      normal: rotateVector(sticker.normal, definition.axis, turns),
    };
  });
  return next;
}

export function getFacelets(cube) {
  const facelets = {};
  for (const face of FACE_NAMES) facelets[face] = Array(9).fill(null);

  for (const sticker of cube.stickers) {
    const face = NORMAL_TO_FACE.get(key(sticker.normal));
    if (!face) throw new Error('Invalid cube state: sticker normal is not a cube face');
    const [x, y, z] = sticker.position;
    let row;
    let col;
    switch (face) {
      case 'U': row = 1 - z; col = x + 1; break;
      case 'R': row = 1 - y; col = 1 - z; break;
      case 'F': row = 1 - y; col = x + 1; break;
      case 'D': row = z + 1; col = x + 1; break;
      case 'L': row = 1 - y; col = z + 1; break;
      case 'B': row = 1 - y; col = 1 - x; break;
      default: throw new Error(`Unknown face: ${face}`);
    }
    facelets[face][row * 3 + col] = sticker.color;
  }
  return facelets;
}

export function isSolved(cube) {
  const facelets = getFacelets(cube);
  return FACE_NAMES.every((face) => facelets[face].every((color) => color === STICKER_COLORS[face]));
}

export function serializeCube(cube) {
  const facelets = getFacelets(cube);
  return FACE_NAMES.flatMap((face) => facelets[face]).join('');
}
