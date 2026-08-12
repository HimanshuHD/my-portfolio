import * as THREE from 'three';

const FACE_COLORS = {
  U: '#f4f0d7',
  R: '#e12d2d',
  F: '#198b49',
  D: '#f0d329',
  L: '#ef7822',
  B: '#1769aa',
};

const STICKER_SIZE = 0.43;
const STICKER_RADIUS = 0.048;
const CUBIE_SIZE = 0.53;
const CUBIE_GAP = 0.02;
const CUBIE_SPACING = CUBIE_SIZE + CUBIE_GAP;
const STICKER_OFFSET = CUBIE_SIZE / 2 + 0.001;
const CUBIE_CORNER_RADIUS = 0.01;
const CUBIE_CORNER_SEGMENTS = 2;

const stickerGeometry = createRoundedStickerGeometry(STICKER_SIZE, STICKER_RADIUS);
const cubieGeometry = createRoundedBoxGeometry(
  CUBIE_SIZE,
  CUBIE_CORNER_RADIUS,
  CUBIE_CORNER_SEGMENTS,
);
const cubieMaterial = new THREE.MeshStandardMaterial({ color: '#111315', roughness: 0.34 });
const stickerMaterials = Object.fromEntries(
  Object.entries(FACE_COLORS).map(([face, color]) => [
    face,
    new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.08,
      roughness: 0.38,
      metalness: 0.02,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    }),
  ]),
);

function createRoundedBoxGeometry(size, radius, segments) {
  if (radius <= 0) return new THREE.BoxGeometry(size, size, size);

  const half = size / 2;
  const shape = new THREE.Shape();
  const r = Math.min(radius, half);
  shape.moveTo(-half + r, -half);
  shape.lineTo(half - r, -half);
  shape.quadraticCurveTo(half, -half, half, -half + r);
  shape.lineTo(half, half - r);
  shape.quadraticCurveTo(half, half, half - r, half);
  shape.lineTo(-half + r, half);
  shape.quadraticCurveTo(-half, half, -half, half - r);
  shape.lineTo(-half, -half + r);
  shape.quadraticCurveTo(-half, -half, -half + r, -half);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: size,
    bevelEnabled: true,
    bevelSegments: segments,
    bevelSize: radius,
    bevelThickness: radius,
    curveSegments: 4,
  });
  geometry.center();
  return geometry;
}

function createRoundedStickerGeometry(size, radius) {
  const half = size / 2;
  const r = Math.min(radius, half);
  const shape = new THREE.Shape();
  shape.moveTo(-half + r, -half);
  shape.lineTo(half - r, -half);
  shape.quadraticCurveTo(half, -half, half, -half + r);
  shape.lineTo(half, half - r);
  shape.quadraticCurveTo(half, half, half - r, half);
  shape.lineTo(-half + r, half);
  shape.quadraticCurveTo(-half, half, -half, half - r);
  shape.lineTo(-half, -half + r);
  shape.quadraticCurveTo(-half, -half, -half + r, -half);
  return new THREE.ShapeGeometry(shape, 8);
}

function Sticker({ sticker }) {
  const [nx, ny, nz] = sticker.normal;
  const material = stickerMaterials[sticker.color] || stickerMaterials.U;
  let rotation = [0, 0, 0];
  if (ny) rotation = [Math.PI / 2, 0, 0];
  else if (nx) rotation = [0, Math.PI / 2, 0];

  return (
    <mesh
      geometry={stickerGeometry}
      material={material}
      position={[nx * STICKER_OFFSET, ny * STICKER_OFFSET, nz * STICKER_OFFSET]}
      rotation={rotation}
      renderOrder={1}
    />
  );
}

export default function Cubie({ position, stickers = [] }) {
  return (
    <group position={position}>
      <mesh geometry={cubieGeometry} material={cubieMaterial} castShadow />
      {stickers.map((sticker, index) => (
        <Sticker key={`${sticker.color}-${sticker.normal.join(',')}-${index}`} sticker={sticker} />
      ))}
    </group>
  );
}

export { CUBIE_SIZE, CUBIE_SPACING };
