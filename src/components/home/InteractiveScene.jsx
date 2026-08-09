import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls, RoundedBox, Sparkles } from '@react-three/drei';

const accent = '#d9ff54';

function Laptop() {
  const rows = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>']
  ];
  return <group position={[0, 0.18, 0]} rotation={[0, -0.08, 0]}>
    <RoundedBox args={[3.55, 0.18, 2.35]} radius={0.08} smoothness={5} castShadow><meshStandardMaterial color="#24272a" metalness={0.82} roughness={0.22} /></RoundedBox>
    <RoundedBox args={[3.2, 1.92, 0.12]} radius={0.08} smoothness={5} position={[0, 1.28, -1.05]} rotation={[-0.08, 0, 0]} castShadow><meshStandardMaterial color="#1a1c1e" metalness={0.8} roughness={0.2} /></RoundedBox>
    <mesh position={[0, 1.28, -0.97]} rotation={[-0.08, 0, 0]}><planeGeometry args={[2.9, 1.62]} /><meshStandardMaterial color="#102033" emissive="#07131c" emissiveIntensity={0.6} roughness={0.3} /></mesh>
    {rows.map((row, rowIndex) => row.map((key, keyIndex) => {
      const width = rowIndex === 1 ? 2.7 : 2.8;
      const spacing = width / row.length;
      return <RoundedBox key={`${rowIndex}-${keyIndex}`} args={[spacing - 0.045, 0.045, 0.23]} radius={0.025} smoothness={2} position={[(keyIndex - (row.length - 1) / 2) * spacing, 0.31, -0.42 + rowIndex * 0.28]}><meshStandardMaterial color={key === 'F' || key === 'J' ? '#455019' : '#34383b'} metalness={0.25} roughness={0.38} /></RoundedBox>;
    }))}
    <RoundedBox args={[0.92, 0.035, 0.52]} radius={0.04} smoothness={3} position={[0, 0.3, 0.67]}><meshStandardMaterial color="#303437" metalness={0.45} roughness={0.28} /></RoundedBox>
    <mesh position={[0, 0.285, -0.86]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.08, 0.12, 32]} /><meshBasicMaterial color="#bfc4c8" /></mesh>
  </group>;
}

function Mug() {
  return <group position={[-2.45, 0.48, 0.25]} rotation={[0, 0.12, -0.04]}>
    <mesh castShadow><cylinderGeometry args={[0.43, 0.36, 0.68, 32]} /><meshStandardMaterial color="#d9d5c9" roughness={0.62} /></mesh>
    <mesh position={[0.43, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.25, 0.07, 12, 24, Math.PI * 1.45]} /><meshStandardMaterial color="#c9c4b9" roughness={0.55} /></mesh>
    <mesh position={[0, 0.32, 0]}><circleGeometry args={[0.34, 32]} /><meshStandardMaterial color="#171311" roughness={0.4} /></mesh>
  </group>;
}

function RubiksCube() {
  const colors = ['#d92828', '#f2f2e8', '#f1d12b', '#168c46', '#1769aa', '#f07b21'];
  const cubies = [];
  for (let x = -1; x <= 1; x += 1) for (let y = -1; y <= 1; y += 1) for (let z = -1; z <= 1; z += 1) cubies.push({ x, y, z, id: `${x}${y}${z}` });
  return <group position={[2.35, 0.5, 0.45]} rotation={[0.2, -0.45, 0.18]}>
    {cubies.map(({ x, y, z, id }) => <group key={id} position={[x * 0.31, y * 0.31, z * 0.31]}>
      <RoundedBox args={[0.285, 0.285, 0.285]} radius={0.035} smoothness={2} castShadow><meshStandardMaterial color="#17191a" metalness={0.2} roughness={0.35} /></RoundedBox>
      {x === 1 && <mesh position={[0.146, 0, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.22, 0.22]} /><meshStandardMaterial color={colors[0]} roughness={0.55} /></mesh>}
      {x === -1 && <mesh position={[-0.146, 0, 0]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[0.22, 0.22]} /><meshStandardMaterial color={colors[3]} roughness={0.55} /></mesh>}
      {y === 1 && <mesh position={[0, 0.146, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.22, 0.22]} /><meshStandardMaterial color={colors[2]} roughness={0.55} /></mesh>}
      {y === -1 && <mesh position={[0, -0.146, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[0.22, 0.22]} /><meshStandardMaterial color={colors[1]} roughness={0.55} /></mesh>}
      {z === 1 && <mesh position={[0, 0, 0.146]}><planeGeometry args={[0.22, 0.22]} /><meshStandardMaterial color={colors[4]} roughness={0.55} /></mesh>}
      {z === -1 && <mesh position={[0, 0, -0.146]} rotation={[0, Math.PI, 0]}><planeGeometry args={[0.22, 0.22]} /><meshStandardMaterial color={colors[5]} roughness={0.55} /></mesh>}
    </group>)}
  </group>;
}

function Camera() {
  return <group position={[2.8, 0.58, -0.72]} rotation={[0.04, -0.28, 0.05]}>
    <RoundedBox args={[1.0, 0.62, 0.58]} radius={0.08} smoothness={4} castShadow><meshStandardMaterial color="#202326" metalness={0.62} roughness={0.28} /></RoundedBox>
    <RoundedBox args={[0.36, 0.17, 0.31]} radius={0.04} smoothness={3} position={[0, 0.39, 0]}><meshStandardMaterial color="#292d30" metalness={0.5} roughness={0.3} /></RoundedBox>
    <mesh position={[0, 0, 0.32]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.27, 0.27, 0.19, 32]} /><meshStandardMaterial color="#0b0d0f" metalness={0.9} roughness={0.12} /></mesh>
    <mesh position={[0, 0, 0.43]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.15, 0.15, 0.035, 32]} /><meshStandardMaterial color="#69a3a9" emissive="#153c3e" emissiveIntensity={0.55} metalness={0.65} roughness={0.16} /></mesh>
  </group>;
}

function Headphones() {
  return <group position={[-1.65, 0.42, -0.9]} rotation={[0.1, 0.2, -0.2]}>
    <mesh rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.5, 0.065, 14, 40, Math.PI * 1.25]} /><meshStandardMaterial color="#151719" metalness={0.7} roughness={0.2} /></mesh>
    <RoundedBox args={[0.26, 0.42, 0.25]} radius={0.08} smoothness={4} position={[-0.42, -0.05, 0]}><meshStandardMaterial color="#202326" metalness={0.65} roughness={0.25} /></RoundedBox>
    <RoundedBox args={[0.26, 0.42, 0.25]} radius={0.08} smoothness={4} position={[0.42, -0.05, 0]}><meshStandardMaterial color="#202326" metalness={0.65} roughness={0.25} /></RoundedBox>
  </group>;
}

function Plant() {
  return <group position={[-3.0, 0.55, -0.55]}>
    <mesh castShadow><cylinderGeometry args={[0.42, 0.32, 0.62, 24]} /><meshStandardMaterial color="#b7a38e" roughness={0.72} /></mesh>
    {[-0.22, -0.08, 0.08, 0.22].map((x, i) => <mesh key={i} position={[x, 0.68 + Math.abs(x) * 0.2, 0]} rotation={[0, x * 0.7, x * 1.4]}><coneGeometry args={[0.13, 0.78, 8]} /><meshStandardMaterial color={i % 2 ? '#557d28' : '#789e31'} roughness={0.75} /></mesh>)}
  </group>;
}

function Lamp() {
  return <group position={[3.55, 0.9, -0.85]}>
    <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.04, 0.04, 0.5, 16]} /><meshStandardMaterial color="#4d4a43" metalness={0.7} /></mesh>
    <mesh position={[0, 0.53, 0]}><sphereGeometry args={[0.17, 20, 20]} /><meshStandardMaterial color="#ffe8ad" emissive="#ffb52e" emissiveIntensity={2.5} /></mesh>
    <mesh position={[0, 0.04, 0]}><boxGeometry args={[0.45, 0.08, 0.45]} /><meshStandardMaterial color="#6a5a45" roughness={0.5} /></mesh>
    <pointLight position={[0, 0.53, 0]} color="#ffbf58" intensity={5} distance={3.5} />
  </group>;
}

function Phone() {
  return <group position={[-2.0, 0.34, 0.75]} rotation={[0.05, 0.2, -0.16]}>
    <RoundedBox args={[0.58, 0.08, 1.1]} radius={0.07} smoothness={4} castShadow><meshStandardMaterial color="#141719" metalness={0.78} roughness={0.2} /></RoundedBox>
    <mesh position={[0, 0.047, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.48, 0.92]} /><meshStandardMaterial color="#162a34" emissive="#082d34" emissiveIntensity={0.6} /></mesh>
  </group>;
}

function Desk() {
  return <group>
    <RoundedBox args={[8.2, 0.16, 5.8]} radius={0.28} smoothness={5} position={[0, 0.05, 0]} receiveShadow><meshStandardMaterial color="#151719" metalness={0.42} roughness={0.3} /></RoundedBox>
    <mesh position={[0, -0.03, 0]}><torusGeometry args={[4.03, 0.045, 12, 80]} /><meshStandardMaterial color={accent} emissive="#9bbb28" emissiveIntensity={1.4} /></mesh>
  </group>;
}

function SceneObjects() {
  return <><Desk /><Laptop /><Mug /><RubiksCube /><Camera /><Headphones /><Plant /><Lamp /><Phone />
    <Float speed={1.5} rotationIntensity={0.35} floatIntensity={0.45}><mesh position={[-2.55, 1.65, -0.2]} castShadow><icosahedronGeometry args={[0.34, 1]} /><meshStandardMaterial color={accent} metalness={0.25} roughness={0.22} emissive="#435f00" emissiveIntensity={0.55} /></mesh></Float>
  </>;
}

export default function InteractiveScene() {
  return <div className="interactive-scene">
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 3.8, 9.2], fov: 36 }} gl={{ antialias: true }}>
      <color attach="background" args={['#07090b']} />
      <ambientLight intensity={1.6} />
      <hemisphereLight args={['#dcecff', '#10130c', 1.3]} />
      <directionalLight position={[4, 8, 6]} intensity={3.5} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <pointLight position={[-4, 3, 2]} color={accent} intensity={15} distance={8} />
      <pointLight position={[3, 2, 1]} color="#71bfff" intensity={7} distance={7} />
      <SceneObjects />
      <Sparkles count={90} scale={[8, 4.5, 7]} size={2} speed={0.35} color={accent} />
      <OrbitControls enablePan={false} minDistance={7.3} maxDistance={11} minPolarAngle={Math.PI / 3.4} maxPolarAngle={Math.PI / 2.05} autoRotate autoRotateSpeed={0.35} />
    </Canvas>
    <div className="scene-hint"><span>↔</span> Drag to rotate</div>
  </div>;
}
