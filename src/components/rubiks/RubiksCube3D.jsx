import { Canvas } from '@react-three/fiber';
import { OrbitControls, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const FACE_COLORS = { U: '#f4f0d7', R: '#e12d2d', F: '#198b49', D: '#f0d329', L: '#ef7822', B: '#1769aa' };
const NORMAL_FACE = { '0,1,0': 'U', '1,0,0': 'R', '0,0,1': 'F', '0,-1,0': 'D', '-1,0,0': 'L', '0,0,-1': 'B' };

function Sticker({ sticker }) {
  const [x, y, z] = sticker.position;
  const [nx, ny, nz] = sticker.normal;
  let rotation = [0, 0, 0];
  if (ny) rotation = [-Math.PI / 2, 0, 0];
  else if (nx) rotation = [0, Math.PI / 2, 0];
  else if (nz < 0) rotation = [0, Math.PI, 0];
  const color = FACE_COLORS[sticker.color] || '#ffffff';
  return <mesh position={[x * 0.52 + nx * 0.275, y * 0.52 + ny * 0.275, z * 0.52 + nz * 0.275]} rotation={rotation}>
    <planeGeometry args={[0.43, 0.43]} />
    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.08} roughness={0.38} metalness={0.02} side={THREE.DoubleSide} toneMapped={false} />
  </mesh>;
}

function GameCube({ cube }) {
  return <group rotation={[0.48, -0.68, 0]}>
    <RoundedBox args={[1.65, 1.65, 1.65]} radius={0.08} smoothness={4} castShadow><meshStandardMaterial color="#111315" roughness={0.34} /></RoundedBox>
    {cube.stickers.map((sticker, index) => <Sticker key={index} sticker={sticker} />)}
  </group>;
}

export default function RubiksCube3D({ cube }) {
  return <div className="rubiks-game-canvas"><Canvas camera={{ position: [3.5, 3.1, 4.4], fov: 42 }} shadows><ambientLight intensity={1.5} /><directionalLight position={[4, 6, 5]} intensity={2.4} castShadow /><GameCube cube={cube} /><OrbitControls enablePan={false} minDistance={3.5} maxDistance={7} /></Canvas></div>;
}

export { NORMAL_FACE };
