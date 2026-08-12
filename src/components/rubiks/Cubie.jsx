import { useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';

const FACE_COLORS = {
  U: '#f4f0d7',
  R: '#e12d2d',
  F: '#198b49',
  D: '#f0d329',
  L: '#ef7822',
  B: '#1769aa',
};

const STICKER_SIZE = 0.43;
const STICKER_RADIUS = 0.018;
const CUBIE_SIZE = 0.52;

// Keep the sticker on the cubie face with only a tiny rendering epsilon.
// The sticker itself is a flat mesh, so there is no artificial thickness/gap.
const STICKER_OFFSET = CUBIE_SIZE / 2 + 0.0008;

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
  const color = FACE_COLORS[sticker.color] || '#ffffff';
  const geometry = useMemo(
    () => createRoundedStickerGeometry(STICKER_SIZE, STICKER_RADIUS),
    [],
  );

  let rotation = [0, 0, 0];

  if (ny) {
    rotation = [Math.PI / 2, 0, 0];
  } else if (nx) {
    rotation = [0, Math.PI / 2, 0];
  } else if (nz) {
    rotation = [0, 0, 0];
  }

  return (
    <mesh
      geometry={geometry}
      position={[nx * STICKER_OFFSET, ny * STICKER_OFFSET, nz * STICKER_OFFSET]}
      rotation={rotation}
      renderOrder={1}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.08}
        roughness={0.38}
        metalness={0.02}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function Cubie({ position, stickers = [] }) {
  return (
    <group position={position}>
      <RoundedBox
        args={[CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE]}
        radius={0.055}
        smoothness={3}
        castShadow
      >
        <meshStandardMaterial color="#111315" roughness={0.34} />
      </RoundedBox>
      {stickers.map((sticker, index) => (
        <Sticker key={`${sticker.color}-${sticker.normal.join(',')}-${index}`} sticker={sticker} />
      ))}
    </group>
  );
}

export { CUBIE_SIZE };
