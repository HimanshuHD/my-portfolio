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
const STICKER_THICKNESS = 0.008;
const STICKER_RADIUS = 0.018;
const CUBIE_SIZE = 0.52;

// Keep the sticker essentially flush with the cubie face. The tiny epsilon
// prevents z-fighting without creating a visible gap between the sticker and body.
const STICKER_OFFSET = CUBIE_SIZE / 2 + STICKER_THICKNESS / 2 + 0.0005;

function Sticker({ sticker }) {
  const [nx, ny, nz] = sticker.normal;
  const color = FACE_COLORS[sticker.color] || '#ffffff';

  let args = [STICKER_SIZE, STICKER_THICKNESS, STICKER_SIZE];
  let rotation = [0, 0, 0];

  if (ny) {
    args = [STICKER_SIZE, STICKER_THICKNESS, STICKER_SIZE];
    rotation = [Math.PI / 2, 0, 0];
  } else if (nx) {
    args = [STICKER_THICKNESS, STICKER_SIZE, STICKER_SIZE];
    rotation = [0, Math.PI / 2, 0];
  } else if (nz) {
    args = [STICKER_SIZE, STICKER_SIZE, STICKER_THICKNESS];
  }

  return (
    <RoundedBox
      args={args}
      radius={STICKER_RADIUS}
      smoothness={3}
      position={[nx * STICKER_OFFSET, ny * STICKER_OFFSET, nz * STICKER_OFFSET]}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.08}
        roughness={0.38}
        metalness={0.02}
      />
    </RoundedBox>
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
