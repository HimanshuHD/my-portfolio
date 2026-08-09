import { Canvas } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const accent = '#d9ff54';
const DESK_TOP = 0.16;
const DESK_DEPTH = 4.25;

function Laptop() {
  const rows = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>']
  ];
  return <group position={[0, DESK_TOP + 0.1, -0.18]} rotation={[0, -0.08, 0]}>
    <RoundedBox args={[3.45, 0.16, 2.1]} radius={0.08} smoothness={5} castShadow><meshStandardMaterial color="#24272a" metalness={0.82} roughness={0.22} /></RoundedBox>
    <RoundedBox args={[3.1, 1.82, 0.12]} radius={0.08} smoothness={5} position={[0, 1.2, -0.96]} rotation={[-0.08, 0, 0]} castShadow><meshStandardMaterial color="#17191b" metalness={0.8} roughness={0.2} /></RoundedBox>
    <mesh position={[0, 1.2, -0.89]} rotation={[-0.08, 0, 0]}><planeGeometry args={[2.82, 1.56]} /><meshStandardMaterial color="#102033" emissive="#07131c" emissiveIntensity={0.65} roughness={0.3} /></mesh>
    {rows.map((row, ri) => row.map((key, ki) => {
      const width = ri === 1 ? 2.7 : 2.8;
      const spacing = width / row.length;
      return <RoundedBox key={`${ri}-${ki}`} args={[spacing - 0.045, 0.045, 0.22]} radius={0.025} smoothness={2} position={[(ki - (row.length - 1) / 2) * spacing, 0.25, -0.37 + ri * 0.26]}><meshStandardMaterial color={key === 'F' || key === 'J' ? '#455019' : '#34383b'} metalness={0.25} roughness={0.38} /></RoundedBox>;
    }))}
    <RoundedBox args={[0.9, 0.035, 0.5]} radius={0.04} smoothness={3} position={[0, 0.24, 0.63]}><meshStandardMaterial color="#303437" metalness={0.45} roughness={0.28} /></RoundedBox>
  </group>;
}

function Mug() {
  return <group position={[-2.45, DESK_TOP + 0.35, 0.55]} rotation={[0, 0.1, 0]}>
    <mesh castShadow><cylinderGeometry args={[0.42, 0.37, 0.66, 48]} /><meshStandardMaterial color="#d9d5c9" roughness={0.62} metalness={0.04} /></mesh>
    <mesh position={[0, 0.335, 0]}><torusGeometry args={[0.385, 0.035, 16, 48]} /><meshStandardMaterial color="#c9c4b9" roughness={0.5} /></mesh>
    <mesh position={[0, 0.332, 0]}><circleGeometry args={[0.335, 48]} /><meshStandardMaterial color="#171311" roughness={0.4} /></mesh>
    <mesh position={[0.43, 0, 0]}><torusGeometry args={[0.22, 0.065, 18, 40]} /><meshStandardMaterial color="#d0cbc0" roughness={0.55} metalness={0.04} /></mesh>
  </group>;
}

function RubiksCube() {
  const colors = ['#d92828', '#f2f2e8', '#f1d12b', '#168c46', '#1769aa', '#f07b21'];
  const cubies = [];
  for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) cubies.push({ x, y, z, id: `${x}${y}${z}` });
  return <group position={[2.05, DESK_TOP + 0.5, 0.42]} rotation={[0.2, -0.45, 0.18]}>{cubies.map(({ x, y, z, id }) => <group key={id} position={[x * 0.31, y * 0.31, z * 0.31]}>
    <RoundedBox args={[0.285, 0.285, 0.285]} radius={0.035} smoothness={2} castShadow><meshStandardMaterial color="#17191a" metalness={0.2} roughness={0.35} /></RoundedBox>
    {x === 1 && <mesh position={[0.146, 0, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.22, 0.22]} /><meshStandardMaterial color={colors[0]} /></mesh>}
    {x === -1 && <mesh position={[-0.146, 0, 0]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[0.22, 0.22]} /><meshStandardMaterial color={colors[3]} /></mesh>}
    {y === 1 && <mesh position={[0, 0.146, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.22, 0.22]} /><meshStandardMaterial color={colors[2]} /></mesh>}
    {y === -1 && <mesh position={[0, -0.146, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[0.22, 0.22]} /><meshStandardMaterial color={colors[1]} /></mesh>}
    {z === 1 && <mesh position={[0, 0, 0.146]}><planeGeometry args={[0.22, 0.22]} /><meshStandardMaterial color={colors[4]} /></mesh>}
    {z === -1 && <mesh position={[0, 0, -0.146]} rotation={[0, Math.PI, 0]}><planeGeometry args={[0.22, 0.22]} /><meshStandardMaterial color={colors[5]} /></mesh>}
  </group>)}</group>;
}

function Camera() {
  return <group position={[2.9, DESK_TOP + 0.32, -0.62]} rotation={[0.04, -0.28, 0.05]}>
    <RoundedBox args={[1, 0.62, 0.58]} radius={0.08} smoothness={4} castShadow><meshStandardMaterial color="#202326" metalness={0.62} roughness={0.28} /></RoundedBox>
    <RoundedBox args={[0.36, 0.17, 0.31]} radius={0.04} smoothness={3} position={[0, 0.39, 0]}><meshStandardMaterial color="#292d30" metalness={0.5} roughness={0.3} /></RoundedBox>
    <mesh position={[0, 0, 0.32]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.27, 0.27, 0.19, 32]} /><meshStandardMaterial color="#0b0d0f" metalness={0.9} roughness={0.12} /></mesh>
    <mesh position={[0, 0, 0.43]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.15, 0.15, 0.035, 32]} /><meshStandardMaterial color="#69a3a9" emissive="#153c3e" emissiveIntensity={0.55} /></mesh>
  </group>;
}

function Headphones() {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.55, 0.03, 0),
    new THREE.Vector3(-0.48, 0.38, 0),
    new THREE.Vector3(-0.2, 0.62, 0),
    new THREE.Vector3(0, 0.67, 0),
    new THREE.Vector3(0.2, 0.62, 0),
    new THREE.Vector3(0.48, 0.38, 0),
    new THREE.Vector3(0.55, 0.03, 0)
  ]);
  return <group position={[0, DESK_TOP + 0.24, 1.2]} rotation={[0.02, -0.12, 0]}>
    <mesh castShadow><tubeGeometry args={[curve, 32, 0.065, 12, false]} /><meshStandardMaterial color="#101214" metalness={0.78} roughness={0.2} /></mesh>
    {[-0.55, 0.55].map((x) => <group key={x} position={[x, 0, 0]}>
      <RoundedBox args={[0.34, 0.48, 0.32]} radius={0.1} smoothness={5} castShadow><meshStandardMaterial color="#25282b" metalness={0.65} roughness={0.25} /></RoundedBox>
      <mesh position={[0, 0, 0.17]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.12, 0.12, 0.045, 32]} /><meshStandardMaterial color="#596066" metalness={0.25} roughness={0.45} /></mesh>
    </group>)}
  </group>;
}

function Plant() {
  const leaves = [[-0.2, 0.62, 0, -0.25, 0.15], [-0.08, 0.83, 0, -0.1, -0.05], [0.08, 0.72, 0, 0.18, 0.08], [0.22, 0.9, 0, 0.3, -0.15], [0, 1.02, 0, 0, 0.2], [-0.28, 0.82, 0, -0.35, -0.12]];
  return <group position={[-3, DESK_TOP, -0.65]}>
    <mesh position={[0, 0.28, 0]} castShadow><cylinderGeometry args={[0.43, 0.34, 0.56, 32]} /><meshStandardMaterial color="#8b7562" roughness={0.78} /></mesh>
    <mesh position={[0, 0.57, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.39, 32]} /><meshStandardMaterial color="#2c2119" roughness={0.95} /></mesh>
    <mesh position={[0, 0.8, 0]}><cylinderGeometry args={[0.035, 0.045, 0.75, 10]} /><meshStandardMaterial color="#536b2d" roughness={0.9} /></mesh>
    {leaves.map(([x, y, z, rx, rz], i) => <group key={i} position={[x, y, z]} rotation={[rx, 0, rz]}><mesh scale={[0.75, 1.35, 0.14]} castShadow><sphereGeometry args={[0.24, 16, 12]} /><meshStandardMaterial color={i % 2 ? '#4f7d2d' : '#658f37'} roughness={0.82} /></mesh></group>)}
  </group>;
}

function Lamp() {
  return <group position={[3.45, DESK_TOP, -0.95]}>
    <mesh position={[0, 0.06, 0]} castShadow><cylinderGeometry args={[0.38, 0.46, 0.12, 32]} /><meshStandardMaterial color="#26282a" metalness={0.72} roughness={0.24} /></mesh>
    <mesh position={[0, 0.64, 0]} castShadow><cylinderGeometry args={[0.045, 0.06, 1.15, 16]} /><meshStandardMaterial color="#34373a" metalness={0.82} roughness={0.22} /></mesh>
    <mesh position={[0, 1.18, 0]} rotation={[0.25, 0, 0]} castShadow><sphereGeometry args={[0.22, 24, 16]} /><meshStandardMaterial color="#303336" metalness={0.7} roughness={0.25} /></mesh>
    <mesh position={[0, 1.1, 0.14]} rotation={[0.25, 0, 0]}><coneGeometry args={[0.34, 0.42, 32, 1, true]} /><meshStandardMaterial color="#b5a98f" roughness={0.65} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 1.04, 0.2]} rotation={[0.25, 0, 0]}><sphereGeometry args={[0.11, 24, 16]} /><meshStandardMaterial color="#fff0bf" emissive="#ffbd58" emissiveIntensity={2.2} /></mesh>
    <pointLight position={[0, 1, 0.25]} color="#ffc76b" intensity={5} distance={3.8} castShadow />
  </group>;
}

function Phone() {
  return <group position={[-2, DESK_TOP + 0.07, 1.38]} rotation={[0, -0.15, -0.08]}>
    <RoundedBox args={[0.64, 0.08, 1.18]} radius={0.07} smoothness={5} castShadow><meshStandardMaterial color="#141719" metalness={0.78} roughness={0.2} /></RoundedBox>
    <mesh position={[0, 0.047, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.5, 0.96]} /><meshStandardMaterial color="#162a34" emissive="#082d34" emissiveIntensity={0.8} /></mesh>
  </group>;
}

function Desk() {
  return <group>
    <RoundedBox args={[8.2, 0.16, DESK_DEPTH]} radius={0.22} smoothness={5} position={[0, 0.08, 0]} receiveShadow><meshStandardMaterial color="#151719" metalness={0.28} roughness={0.38} /></RoundedBox>
    <RoundedBox args={[8, 0.045, 4.05]} radius={0.18} smoothness={4} position={[0, 0.19, 0]} receiveShadow><meshStandardMaterial color="#202326" metalness={0.08} roughness={0.5} /></RoundedBox>
    <mesh position={[0, 0.215, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[7.8, 3.85]} /><meshStandardMaterial color="#25282a" roughness={0.48} /></mesh>
  </group>;
}

function SceneContent() {
  return <>
    <color attach="background" args={['#06090c']} />
    <ambientLight intensity={0.55} color="#dfe9ff" />
    <directionalLight position={[-4, 7, 4]} intensity={2.1} color="#d9e8ff" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
    <pointLight position={[-3, 2, 2]} intensity={1.5} color={accent} distance={7} />
    <pointLight position={[3, 2, -2]} intensity={1.8} color="#4d86ff" distance={7} />
    <Desk /><Laptop /><Mug /><RubiksCube /><Camera /><Headphones /><Plant /><Lamp /><Phone />
    <Sparkles count={35} scale={[7, 2.4, 4]} size={1.1} speed={0.18} color={accent} />
  </>;
}

export default function InteractiveScene() {
  return <div className="interactive-scene">
    <Canvas shadows camera={{ position: [8.5, 6.4, 9.2], fov: 42 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
      <SceneContent />
      <OrbitControls enablePan={false} minDistance={7} maxDistance={13} minPolarAngle={Math.PI / 4.8} maxPolarAngle={Math.PI / 2.05} target={[0, 0.65, 0]} />
    </Canvas>
    <div className="scene-hint"><span>↔</span> Drag to rotate</div>
  </div>;
}
