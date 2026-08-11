import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, OrbitControls, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import bookCoverSvg from '../../assets/frontend-architecture-book-cover.svg?raw';

const accent = '#d9ff54';
const DESK_HEIGHT = 0.008;
const DESK_Y = 0;
const DESK_TOP = DESK_Y + DESK_HEIGHT;

function useSvgCanvasTexture(svgMarkup) {
  const [texture, setTexture] = useState(null);
  useEffect(() => {
    let disposed = false;
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 800;
    const context = canvas.getContext('2d');
    if (!context) return undefined;
    context.clearRect(0, 0, canvas.width, canvas.height);
    const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    const objectUrl = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      if (disposed) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const nextTexture = new THREE.CanvasTexture(canvas);
      nextTexture.colorSpace = THREE.SRGBColorSpace;
      nextTexture.anisotropy = 8;
      nextTexture.needsUpdate = true;
      setTexture(nextTexture);
      URL.revokeObjectURL(objectUrl);
    };
    image.onerror = (error) => {
      console.error('Failed to render book cover SVG into canvas texture.', error);
      URL.revokeObjectURL(objectUrl);
    };
    image.src = objectUrl;
    return () => {
      disposed = true;
      URL.revokeObjectURL(objectUrl);
    };
  }, [svgMarkup]);
  return texture;
}

function Laptop() {
  const rows = ['1234567890', 'QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
  return <group position={[0, DESK_TOP + 0.09, -0.55]} rotation={[0, 0, 0]}>
    <RoundedBox args={[3.55, 0.16, 2.05]} radius={0.08} smoothness={5} castShadow><meshStandardMaterial color="#4b5054" metalness={0.78} roughness={0.24} /></RoundedBox>
    <group position={[0, 0.92, -0.94]} rotation={[-0.08, 0, 0]}><RoundedBox args={[3.12, 1.86, 0.12]} radius={0.08} smoothness={5} castShadow><meshStandardMaterial color="#202428" metalness={0.82} roughness={0.2} /></RoundedBox><mesh position={[0, 0, 0.066]}><planeGeometry args={[2.8, 1.55]} /><meshStandardMaterial color="#101c29" emissive="#071a28" emissiveIntensity={0.8} roughness={0.3} /></mesh></group>
    {rows.map((row, ri) => [...row].map((key, ki) => { const spacing = (ri === 1 ? 2.75 : 2.85) / row.length; return <RoundedBox key={`${ri}-${ki}`} args={[spacing - 0.045, 0.045, 0.2]} radius={0.02} smoothness={2} position={[(ki - (row.length - 1) / 2) * spacing, 0.13, -0.34 + ri * 0.25]}><meshStandardMaterial color={key === 'F' || key === 'J' ? '#617221' : '#25292c'} roughness={0.42} /></RoundedBox>; }))}
    <RoundedBox args={[0.9, 0.035, 0.5]} radius={0.04} smoothness={3} position={[0, 0.12, 0.62]}><meshStandardMaterial color="#34383b" metalness={0.45} roughness={0.28} /></RoundedBox>
  </group>;
}

function Mug() {
  return <group position={[-2.746, DESK_TOP + 0.34, 1.138]} rotation={[0, -0.9, 0]}><mesh castShadow><cylinderGeometry args={[0.42, 0.37, 0.64, 48]} /><meshStandardMaterial color="#f0eee8" roughness={0.58} /></mesh><mesh position={[0, 0.325, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.385, 0.028, 16, 48]} /><meshStandardMaterial color="#d6d2c9" roughness={0.5} /></mesh><mesh position={[0, 0.322, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.335, 48]} /><meshStandardMaterial color="#17120f" roughness={0.36} /></mesh><mesh position={[0.43, 0, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.21, 0.065, 18, 40]} /><meshStandardMaterial color="#ebe8df" roughness={0.55} /></mesh></group>;
}

function RubiksCube({ onClick }) {
  const colors = ['#e12d2d', '#f4f0d7', '#f0d329', '#198b49', '#1769aa', '#ef7822'];
  const cubies = [];
  const cubeScale = 0.1725;
  const cubieSize = 0.214;
  const faceSize = 0.124;
  const faceOffset = 0.109;
  const noRaycast = () => null;
  for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) cubies.push({ x, y, z, id: `${x}${y}${z}` });
  return <group position={[2.6, DESK_TOP + cubieSize / 2 + 0.185, -0.22]} rotation={[0, -0.42, 0]}>
    <mesh position={[0, 0, 0]} onClick={(event) => { event.stopPropagation(); onClick?.(event); }} onPointerDown={(event) => event.stopPropagation()} visible={false}><boxGeometry args={[cubieSize * 3.2, cubieSize * 3.2, cubieSize * 3.2]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} /></mesh>
    {cubies.map(({ x, y, z, id }) => <group key={id} position={[x * cubeScale, y * cubeScale, z * cubeScale]} raycast={noRaycast}><RoundedBox args={[cubieSize, cubieSize, cubieSize]} radius={0.027} smoothness={2} castShadow raycast={noRaycast}><meshStandardMaterial color="#111315" roughness={0.34} /></RoundedBox>{x === 1 && <mesh raycast={noRaycast} position={[faceOffset, 0, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[faceSize, faceSize]} /><meshStandardMaterial color={colors[0]} /></mesh>}{x === -1 && <mesh raycast={noRaycast} position={[-faceOffset, 0, 0]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[faceSize, faceSize]} /><meshStandardMaterial color={colors[3]} /></mesh>}{y === 1 && <mesh raycast={noRaycast} position={[0, faceOffset, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[faceSize, faceSize]} /><meshStandardMaterial color={colors[2]} /></mesh>}{y === -1 && <mesh raycast={noRaycast} position={[0, -faceOffset, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[faceSize, faceSize]} /><meshStandardMaterial color={colors[1]} /></mesh>}{z === 1 && <mesh raycast={noRaycast} position={[0, 0, faceOffset]}><planeGeometry args={[faceSize, faceSize]} /><meshStandardMaterial color={colors[4]} /></mesh>}{z === -1 && <mesh raycast={noRaycast} position={[0, 0, -faceOffset]} rotation={[0, Math.PI, 0]}><planeGeometry args={[faceSize, faceSize]} /><meshStandardMaterial color={colors[5]} /></mesh>}</group>)}</group>;
}

function Book() {
  const coverTexture = useSvgCanvasTexture(bookCoverSvg);
  return <group position={[2.998, DESK_TOP + 0.08, 1.05]} rotation={[0, -Math.PI / 3, 0]}><RoundedBox args={[1.1, 0.16, 1.45]} radius={0.035} smoothness={4} castShadow><meshStandardMaterial color="#e9e8e3" roughness={0.78} /></RoundedBox><mesh position={[0, 0.096, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={10}><planeGeometry args={[1.02, 1.36]} /><meshBasicMaterial map={coverTexture || undefined} color={coverTexture ? '#ffffff' : '#08a6a8'} toneMapped={false} side={THREE.DoubleSide} transparent opacity={1} depthWrite={false} polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-2} /></mesh><mesh position={[0, -0.084, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[1.02, 1.36]} /><meshStandardMaterial color="#e2e1db" roughness={0.86} /></mesh><mesh position={[-0.52, 0, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[1.36, 0.12]} /><meshStandardMaterial color="#deddd7" roughness={0.85} /></mesh></group>;
}

function Plant() { const leaves = [[-0.2, 0.64, 0, -0.2, 0.15], [-0.08, 0.86, 0, -0.1, -0.05], [0.1, 0.74, 0, 0.18, 0.08], [0.23, 0.91, 0, 0.28, -0.15], [0, 1.05, 0, 0, 0.2], [-0.27, 0.82, 0, -0.3, -0.12]]; return <group position={[-3.0, DESK_TOP, -0.7]}><mesh position={[0, 0.28, 0]} castShadow><cylinderGeometry args={[0.43, 0.34, 0.56, 32]} /><meshStandardMaterial color="#b5a28f" roughness={0.78} /></mesh><mesh position={[0, 0.57, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.39, 32]} /><meshStandardMaterial color="#302319" roughness={0.95} /></mesh>{leaves.map(([x, y, z, rx, rz], i) => <group key={i} position={[x, y, z]} rotation={[rx, 0, rz]}><mesh scale={[0.75, 1.35, 0.14]} castShadow><sphereGeometry args={[0.24, 16, 12]} /><meshStandardMaterial color={i % 2 ? '#4f812e' : '#6c963c'} roughness={0.82} /></mesh></group>)}</group>; }

function Lamp() { return <group position={[3.5, DESK_TOP, -0.92]}><mesh position={[0, 0.06, 0]} castShadow><cylinderGeometry args={[0.38, 0.46, 0.12, 32]} /><meshStandardMaterial color="#303438" metalness={0.72} roughness={0.24} /></mesh><mesh position={[0, 0.64, 0]} castShadow><cylinderGeometry args={[0.045, 0.06, 1.15, 16]} /><meshStandardMaterial color="#3d4145" metalness={0.82} roughness={0.22} /></mesh><mesh position={[0, 1.18, 0]} rotation={[0.25, 0, 0]} castShadow><sphereGeometry args={[0.22, 24, 16]} /><meshStandardMaterial color="#303438" metalness={0.7} roughness={0.25} /></mesh><mesh position={[0, 1.1, 0.14]} rotation={[0.25, 0, 0]}><coneGeometry args={[0.34, 0.42, 32, 1, true]} /><meshStandardMaterial color="#c7b99f" roughness={0.65} side={THREE.DoubleSide} /></mesh><mesh position={[0, 1.04, 0.2]} rotation={[0.25, 0, 0]}><sphereGeometry args={[0.11, 24, 16]} /><meshStandardMaterial color="#fff0bf" emissive="#ffbd58" emissiveIntensity={2.2} /></mesh><pointLight position={[0, 1, 0.25]} color="#ffc76b" intensity={5} distance={4} castShadow /></group>; }

function Phone() { return <group position={[-1.48, DESK_TOP + 0.0545, 1.45]} rotation={[-0.0039, -0.15, -0.00153]}><RoundedBox args={[0.64, 0.06, 1.18]} radius={0.03} smoothness={7} castShadow><meshStandardMaterial color="#171a1c" metalness={0.78} roughness={0.2} /></RoundedBox><mesh position={[0, 0.032, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.54, 1]} /><meshStandardMaterial color="#172c3a" emissive="#0a3842" emissiveIntensity={1.0} /></mesh></group>; }

function Desk() { return <RoundedBox args={[8.2, DESK_HEIGHT, 4.25]} radius={0.02} smoothness={5} position={[0, DESK_Y, 0]} receiveShadow><meshStandardMaterial color="#f3f0e9" metalness={0.05} roughness={0.45} /></RoundedBox>; }

function SceneContent({ onCubeClick }) { return <><ambientLight intensity={1.15} color="#ffffff" /><directionalLight position={[-4, 7, 4]} intensity={2.6} color="#ffffff" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} /><directionalLight position={[4, 4, -2]} intensity={1.5} color="#d9ffed" /><pointLight position={[-3, 3, 2]} intensity={1.0} color={accent} distance={8} /><Desk /><Plant /><Mug /><Laptop /><Phone /><RubiksCube onClick={onCubeClick} /><Book /><Lamp /><ContactShadows position={[0, 0.23, 0]} opacity={0.28} scale={8} blur={2.8} far={4.5} /></>; }

export default function InteractiveScene({ onCubeClick }) { return <div className="interactive-scene"><Canvas shadows dpr={[1, 1.5]} camera={{ position: [5.3, 5.01, 7.52], fov: 38 }}><SceneContent onCubeClick={onCubeClick} /><OrbitControls enablePan={false} enableZoom={true} zoomSpeed={0.7} minDistance={7} maxDistance={14} autoRotate={false} minPolarAngle={Math.PI / 3.4} maxPolarAngle={Math.PI / 2.05} target={[0.65, 0.25, 0]} /></Canvas><div className="scene-hint"><span>↔</span> Drag to rotate · Scroll to zoom</div></div>; }
