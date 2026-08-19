import * as THREE from 'three';

const FACE_COLORS = {
  U: '#f4f0d7',
  R: '#e12d2d',
  F: '#198b49',
  D: '#f0d329',
  L: '#ef7822',
  B: '#1769aa',
};

const STICKER_SIZE = 0.36;
const STICKER_RADIUS = 0.048;
const CUBIE_SIZE = 0.40;
const CUBIE_GAP = 0.025;
const CUBIE_SPACING = CUBIE_SIZE + CUBIE_GAP;
const STICKER_OFFSET = CUBIE_SIZE / 2 + 0.001;

const stickerGeometry = createRoundedStickerGeometry(STICKER_SIZE, STICKER_RADIUS);
const cubieGeometry = new THREE.BoxGeometry(CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE);
const cubieMaterial = new THREE.MeshStandardMaterial({
  color: '#111315',
  roughness: 0.34,
});

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

function Sticker({ sticker, onPointerDown }) {
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
      onPointerDown={(event) => {
        event.stopPropagation();
        event.nativeEvent?.stopImmediatePropagation?.();
        onPointerDown?.(event, sticker);
      }}
    />
  );
}

export default function Cubie({ position, stickers = [], onStickerPointerDown }) {
  return (
    <group position={position}>
      <mesh geometry={cubieGeometry} material={cubieMaterial} />
      {stickers.map((sticker, index) => (
        <Sticker
          key={`${sticker.color}-${sticker.normal.join(',')}-${index}`}
          sticker={sticker}
          onPointerDown={onStickerPointerDown}
        />
      ))}
    </group>
  );
}

export { CUBIE_SIZE, CUBIE_SPACING };
