import { Canvas } from '@react-three/fiber';
import { ContactShadows, OrbitControls, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const accent = '#d9ff54';
const DESK_HEIGHT = 0.008;
const DESK_Y = DESK_HEIGHT / 2;
const DESK_TOP = DESK_Y + DESK_HEIGHT / 2;

function Laptop() {
  const rows = ['1234567890', 'QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
  return <group position={[0, DESK_TOP + 0.09, -0.25]} rotation={[0, -0.08, 0]}>
    <RoundedBox args={[3.55, 0.16, 2.05]} radius={0.08} smoothness={5} castShadow><meshStandardMaterial color="#4b5054" metalness={0.78} roughness={0.24} /></RoundedBox>
    <group position={[0, 0.92, -0.94]} rotation={[-0.08, 0, 0]}>
      <RoundedBox args={[3.12, 1.86, 0.12]} radius={0.08} smoothness={5} castShadow><meshStandardMaterial color="#202428" metalness={0.82} roughness={0.2} /></RoundedBox>
      <mesh position={[0, 0, 0.066]}><planeGeometry args={[2.8, 1.55]} /><meshStandardMaterial color="#101c29" emissive="#071a28" emissiveIntensity={0.8} roughness={0.3} /></mesh>
    </group>
    {rows.map((row, ri) => [...row].map((key, ki) => {
      const spacing = (ri === 1 ? 2.75 : 2.85) / row.length;
      return <RoundedBox key={`${ri}-${ki}`} args={[spacing - 0.045, 0.045, 0.2]} radius={0.02} smoothness={2} position={[(ki - (row.length - 1) / 2) * spacing, 0.13, -0.34 + ri * 0.25]}><meshStandardMaterial color={key === 'F' || key === 'J' ? '#617221' : '#25292c'} roughness={0.42} /></RoundedBox>;
    }))}
    <RoundedBox args={[0.9, 0.035, 0.5]} radius={0.04} smoothness={3} position={[0, 0.12, 0.62]}><meshStandardMaterial color="#34383b" metalness={0.45} roughness={0.28} /></RoundedBox>
  </group>;
}

function Mug() {
  return <group position={[-2.45, DESK_TOP + 0.34, 0.62]}>
    <mesh castShadow><cylinderGeometry args={[0.42, 0.37, 0.64, 48]} /><meshStandardMaterial color="#f0eee8" roughness={0.58} /></mesh>
    <mesh position={[0, 0.325, 0]}><torusGeometry args={[0.385, 0.035, 16, 48]} /><meshStandardMaterial color="#d6d2c9" roughness={0.5} /></mesh>
    <mesh position={[0, 0.322, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.335, 48]} /><meshStandardMaterial color="#17120f" roughness={0.36} /></mesh>
    <mesh position={[0.43, 0, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.21, 0.065, 18, 40]} /><meshStandardMaterial color="#ebe8df" roughness={0.55} /></mesh>
  </group>;
}

function RubiksCube() {
  const colors = ['#e12d2d', '#f4f0d7', '#f0d329', '#198b49', '#1769aa', '#ef7822'];
  const cubies = [];
  const cubeScale = 0.23;
  const cubieSize = 0.215;
  const faceSize = 0.165;
  const faceOffset = 0.15;
  
  for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) cubies.push({ x, y, z, id: `${x}${y}${z}` });
  return <group position={[2.35, DESK_TOP, 0.5]} rotation={[0, -0.42, 0]}>{cubies.map(({ x, y, z, id }) => <group key={id} position={[x * cubeScale, y * cubeScale, z * cubeScale]}>
    <RoundedBox args={[0.285, 0.285, 0.285]} radius={0.035} smoothness={2} castShadow><meshStandardMaterial color="#111315" roughness={0.34} /></RoundedBox>
    {x === 1 && <mesh position={[faceOffset, 0, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[faceSize, faceSize]} /><meshStandardMaterial color={colors[0]} /></mesh>}
    {x === -1 && <mesh position={[-faceOffset, 0, 0]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[faceSize, faceSize]} /><meshStandardMaterial color={colors[3]} /></mesh>}
    {y === 1 && <mesh position={[0, faceOffset, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[faceSize, faceSize]} /><meshStandardMaterial color={colors[2]} /></mesh>}
    {y === -1 && <mesh position={[0, -faceOffset, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[faceSize, faceSize]} /><meshStandardMaterial color={colors[1]} /></mesh>}
    {z === 1 && <mesh position={[0, 0, faceOffset]}><planeGeometry args={[faceSize, faceSize]} /><meshStandardMaterial color={colors[4]} /></mesh>}
    {z === -1 && <mesh position={[0, 0, -faceOffset]} rotation={[0, Math.PI, 0]}><planeGeometry args={[faceSize, faceSize]} /><meshStandardMaterial color={colors[5]} /></mesh>}
  </group>)}</group>;
}

function Camera() {
  return <group position={[3.0, DESK_TOP + 0.32, -0.72]} rotation={[0.04, -0.28, 0.05]}>
    <RoundedBox args={[1, 0.62, 0.58]} radius={0.08} smoothness={4} castShadow><meshStandardMaterial color="#24282b" metalness={0.65} roughness={0.28} /></RoundedBox>
    <RoundedBox args={[0.36, 0.17, 0.31]} radius={0.04} smoothness={3} position={[0, 0.39, 0]}><meshStandardMaterial color="#303438" metalness={0.5} roughness={0.3} /></RoundedBox>
    <mesh position={[0, 0, 0.32]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.27, 0.27, 0.19, 32]} /><meshStandardMaterial color="#090b0d" metalness={0.9} roughness={0.12} /></mesh>
    <mesh position={[0, 0, 0.43]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.15, 0.15, 0.035, 32]} /><meshStandardMaterial color="#6ba8b1" emissive="#173d42" emissiveIntensity={0.55} /></mesh>
  </group>;
}

function Headphones() {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.58, 0, 0), new THREE.Vector3(-0.55, 0.42, 0), new THREE.Vector3(-0.3, 0.7, 0),
    new THREE.Vector3(0, 0.8, 0), new THREE.Vector3(0.3, 0.7, 0), new THREE.Vector3(0.55, 0.42, 0), new THREE.Vector3(0.58, 0, 0)
  ]);
  return <group position={[-0.15, DESK_TOP + 0.26, 1.3]} rotation={[0, -0.08, 0]}>
    <mesh castShadow><tubeGeometry args={[curve, 48, 0.075, 14, false]} /><meshStandardMaterial color="#111416" metalness={0.8} roughness={0.2} /></mesh>
    {[-0.58, 0.58].map((x) => <group key={x} position={[x, 0, 0]}>
      <RoundedBox args={[0.36, 0.5, 0.34]} radius={0.1} smoothness={5} castShadow><meshStandardMaterial color="#25292c" metalness={0.68} roughness={0.24} /></RoundedBox>
      <mesh position={[0, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.13, 0.13, 0.05, 32]} /><meshStandardMaterial color="#5c646a" roughness={0.42} /></mesh>
    </group>)}
  </group>;
}

function Plant() {
  const leaves = [[-0.2, 0.64, 0, -0.2, 0.15], [-0.08, 0.86, 0, -0.1, -0.05], [0.1, 0.74, 0, 0.18, 0.08], [0.23, 0.91, 0, 0.28, -0.15], [0, 1.05, 0, 0, 0.2], [-0.27, 0.82, 0, -0.3, -0.12]];
  return <group position={[-3.0, DESK_TOP, -0.7]}>
    <mesh position={[0, 0.28, 0]} castShadow><cylinderGeometry args={[0.43, 0.34, 0.56, 32]} /><meshStandardMaterial color="#b5a28f" roughness={0.78} /></mesh>
    <mesh position={[0, 0.57, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.39, 32]} /><meshStandardMaterial color="#302319" roughness={0.95} /></mesh>
    {leaves.map(([x, y, z, rx, rz], i) => <group key={i} position={[x, y, z]} rotation={[rx, 0, rz]}><mesh scale={[0.75, 1.35, 0.14]} castShadow><sphereGeometry args={[0.24, 16, 12]} /><meshStandardMaterial color={i % 2 ? '#4f812e' : '#6c963c'} roughness={0.82} /></mesh></group>)}
  </group>;
}

function Lamp() {
  return <group position={[3.5, DESK_TOP, -0.92]}>
    <mesh position={[0, 0.06, 0]} castShadow><cylinderGeometry args={[0.38, 0.46, 0.12, 32]} /><meshStandardMaterial color="#303438" metalness={0.72} roughness={0.24} /></mesh>
    <mesh position={[0, 0.64, 0]} castShadow><cylinderGeometry args={[0.045, 0.06, 1.15, 16]} /><meshStandardMaterial color="#3d4145" metalness={0.82} roughness={0.22} /></mesh>
    <mesh position={[0, 1.18, 0]} rotation={[0.25, 0, 0]} castShadow><sphereGeometry args={[0.22, 24, 16]} /><meshStandardMaterial color="#303438" metalness={0.7} roughness={0.25} /></mesh>
    <mesh position={[0, 1.1, 0.14]} rotation={[0.25, 0, 0]}><coneGeometry args={[0.34, 0.42, 32, 1, true]} /><meshStandardMaterial color="#c7b99f" roughness={0.65} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 1.04, 0.2]} rotation={[0.25, 0, 0]}><sphereGeometry args={[0.11, 24, 16]} /><meshStandardMaterial color="#fff0bf" emissive="#ffbd58" emissiveIntensity={2.2} /></mesh>
    <pointLight position={[0, 1, 0.25]} color="#ffc76b" intensity={5} distance={4} castShadow />
  </group>;
}

function Phone() {
  return <group position={[-2.0, DESK_TOP + 0.07, 1.45]} rotation={[0, -0.15, -0.08]}>
    <RoundedBox args={[0.64, 0.08, 1.18]} radius={0.07} smoothness={5} castShadow><meshStandardMaterial color="#171a1c" metalness={0.78} roughness={0.2} /></RoundedBox>
    <mesh position={[0, 0.047, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.5, 0.96]} /><meshStandardMaterial color="#172c3a" emissive="#0a3842" emissiveIntensity={1.0} /></mesh>
  </group>;
}

// function Desk() {
//   return <group>
//     <RoundedBox args={[8.2, 0.18, 4.25]} radius={0.24} smoothness={5} position={[0, 0.09, 0]} receiveShadow><meshStandardMaterial color="#e9e6df" metalness={0.08} roughness={0.42} /></RoundedBox>
//     <RoundedBox args={[8.05, 0.035, 4.1]} radius={0.2} smoothness={4} position={[0, 0.205, 0]} receiveShadow><meshStandardMaterial color="#f8f6f1" roughness={0.48} /></RoundedBox>
//     <mesh position={[0, 0.225, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[7.8, 3.85]} /><meshStandardMaterial color="#f3f0e9" roughness={0.5} /></mesh>
//   </group>;
// }

function Desk() {
  return (
    <RoundedBox
      args={[8.2, DESK_HEIGHT, 4.25]}
      radius={0.24}
      smoothness={5}
      position={[0, DESK_Y, 0]}
      receiveShadow
    >
      <meshStandardMaterial
        color="#f3f0e9"
        metalness={0.05}
        roughness={0.45}
      />
    </RoundedBox>
  );
}

function SceneContent() {
  return <>
    <ambientLight intensity={1.15} color="#ffffff" />
    <directionalLight position={[-4, 7, 4]} intensity={2.6} color="#ffffff" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
    <directionalLight position={[4, 4, -2]} intensity={1.5} color="#d9ffed" />
    <pointLight position={[-3, 3, 2]} intensity={1.0} color={accent} distance={8} />
    <Desk /><Plant /><Mug /><Laptop /><Headphones /><Phone /><RubiksCube /><Camera /><Lamp />
    <ContactShadows position={[0, 0.23, 0]} opacity={0.28} scale={8} blur={2.8} far={4.5} />
  </>;
}

export default function InteractiveScene() {
  return <div className="interactive-scene">
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [7.5, 5.8, 9.5], fov: 38 }}>
      <SceneContent />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        zoomSpeed={0.7}
        minDistance={7}
        maxDistance={14}
        autoRotate={false}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 0.25, 0]}
      />
    </Canvas>
    <div className="scene-hint"><span>↔</span> Drag to rotate · Scroll to zoom</div>
  </div>;
}
