import { RoundedBox } from '@react-three/drei';

const colors = ['#e12d2d', '#f4f0d7', '#f0d329', '#198b49', '#1769aa', '#ef7822'];
const cubeScale = 0.1725;
const cubieSize = 0.214;
const faceSize = 0.124;
const faceOffset = 0.109;
const noRaycast = () => null;

export default function RubiksCube({ onClick }) {
  const cubies = [];
  for (let x = -1; x <= 1; x += 1) {
    for (let y = -1; y <= 1; y += 1) {
      for (let z = -1; z <= 1; z += 1) cubies.push({ x, y, z, id: `${x}${y}${z}` });
    }
  }

  return <group position={[2.6, 0.008 + cubieSize / 2 + 0.185, -0.22]} rotation={[0, -0.42, 0]} onClick={(event) => { event.stopPropagation(); onClick?.(); }}>
    <mesh visible={false} position={[0, 0, 0]} onPointerDown={(event) => event.stopPropagation()} onPointerUp={(event) => event.stopPropagation()}>
      <boxGeometry args={[0.78, 0.78, 0.78]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
    {cubies.map(({ x, y, z, id }) => <group key={id} position={[x * cubeScale, y * cubeScale, z * cubeScale]} raycast={noRaycast}>
      <RoundedBox args={[cubieSize, cubieSize, cubieSize]} radius={0.027} smoothness={2} castShadow raycast={noRaycast}><meshStandardMaterial color="#111315" roughness={0.34} /></RoundedBox>
      {x === 1 && <mesh raycast={noRaycast} position={[faceOffset, 0, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[faceSize, faceSize]} /><meshStandardMaterial color={colors[0]} /></mesh>}
      {x === -1 && <mesh raycast={noRaycast} position={[-faceOffset, 0, 0]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[faceSize, faceSize]} /><meshStandardMaterial color={colors[3]} /></mesh>}
      {y === 1 && <mesh raycast={noRaycast} position={[0, faceOffset, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[faceSize, faceSize]} /><meshStandardMaterial color={colors[2]} /></mesh>}
      {y === -1 && <mesh raycast={noRaycast} position={[0, -faceOffset, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[faceSize, faceSize]} /><meshStandardMaterial color={colors[1]} /></mesh>}
      {z === 1 && <mesh raycast={noRaycast} position={[0, 0, faceOffset]}><planeGeometry args={[faceSize, faceSize]} /><meshStandardMaterial color={colors[4]} /></mesh>}
      {z === -1 && <mesh raycast={noRaycast} position={[0, 0, -faceOffset]} rotation={[0, Math.PI, 0]}><planeGeometry args={[faceSize, faceSize]} /><meshStandardMaterial color={colors[5]} /></mesh>}
    </group>)}
  </group>;
}
