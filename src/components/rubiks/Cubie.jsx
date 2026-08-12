import { RoundedBox } from '@react-three/drei';
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
const CUBIE_SIZE = 0.52;
const STICKER_OFFSET = CUBIE_SIZE / 2 + 0.012;

function Sticker({ sticker }) {
  const [nx, ny, nz] = sticker.normal;
  let rotation = [0, 0, 0];

  if (ny) rotation = [-Math.PI / 2, 0, 0];
  else if (nx) rotation = [0, Math.PI / 2, 0];
  else if (nz < 0) rotation = [0, Math.PI, 0];

  const color = FACE_COLORS[sticker.color] || '#ffffff';

  return (
    <mesh
      position={[nx * STICKER_OFFSET, ny * STICKER_OFFSET, nz * STICKER_OFFSET]}
      rotation={rotation}
    >
      <planeGeometry args={[STICKER_SIZE, STICKER_SIZE]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.08}
        roughness={0.38}
        metalness={0.02}
        side={THREE.DoubleSide}
        toneMapped={false}
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
