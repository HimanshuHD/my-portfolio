import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls, Sparkles } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function Laptop() {
  return <group position={[0, 0.65, 0]} rotation={[-0.08, -0.15, 0]}>
    <mesh position={[0, 0, 0]} castShadow>
      <boxGeometry args={[2.9, 0.12, 1.8]} />
      <meshStandardMaterial color="#17191b" metalness={0.8} roughness={0.22} />
    </mesh>
    <mesh position={[0, 0.86, -0.82]} rotation={[-0.22, 0, 0]} castShadow>
      <boxGeometry args={[2.7, 1.65, 0.1]} />
      <meshStandardMaterial color="#101315" metalness={0.7} roughness={0.25} />
    </mesh>
    <mesh position={[0, 0.86, -0.755]} rotation={[-0.22, 0, 0]}>
      <boxGeometry args={[2.42, 1.36, 0.02]} />
      <meshStandardMaterial color="#8fb82d" emissive="#233000" emissiveIntensity={0.28} roughness={0.35} />
    </mesh>
    <mesh position={[0, 0.075, 0.05]}>
      <boxGeometry args={[1.1, 0.015, 0.62]} />
      <meshStandardMaterial color="#242729" metalness={0.45} roughness={0.3} />
    </mesh>
  </group>;
}

function Phone() {
  return <group position={[-2.45, 0.48, 0.25]} rotation={[0.15, 0.25, -0.18]}>
    <mesh castShadow><boxGeometry args={[0.58, 0.1, 1.15]} /><meshStandardMaterial color="#151719" metalness={0.75} roughness={0.2} /></mesh>
    <mesh position={[0, 0.06, 0]}><boxGeometry args={[0.48, 0.015, 0.92]} /><meshStandardMaterial color="#162026" emissive="#073b3b" emissiveIntensity={0.35} /></mesh>
  </group>;
}

function Camera() {
  return <group position={[2.25, 0.55, 0.15]} rotation={[0, -0.25, 0.08]}>
    <mesh castShadow><boxGeometry args={[0.85, 0.55, 0.5]} /><meshStandardMaterial color="#202225" metalness={0.55} roughness={0.28} /></mesh>
    <mesh position={[0, 0.38, 0]}><boxGeometry args={[0.34, 0.18, 0.3]} /><meshStandardMaterial color="#25282b" metalness={0.5} /></mesh>
    <mesh position={[0, 0, 0.29]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.24, 0.24, 0.16, 32]} /><meshStandardMaterial color="#0b0c0d" metalness={0.8} roughness={0.16} /></mesh>
    <mesh position={[0, 0, 0.39]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.13, 0.13, 0.03, 32]} /><meshStandardMaterial color="#d9ff54" emissive="#7f9d22" emissiveIntensity={0.35} /></mesh>
  </group>;
}

function Cube() {
  const ref = useRef();
  return <Float speed={2} rotationIntensity={0.7} floatIntensity={0.8}>
    <mesh ref={ref} position={[2.35, 1.7, 0.25]} rotation={[0.3, 0.4, 0.15]} castShadow>
      <boxGeometry args={[0.62, 0.62, 0.62]} />
      <meshStandardMaterial color="#d9ff54" roughness={0.3} metalness={0.15} wireframe />
    </mesh>
  </Float>;
}

function Headphones() {
  return <group position={[-1.8, 0.35, -0.65]} rotation={[0.15, 0.2, -0.2]}>
    <torusGeometry args={[0.52, 0.07, 12, 32]} />
  </group>;
}

function Desk() {
  return <group>
    <mesh receiveShadow position={[0, 0.05, 0]} rotation={[-0.015, 0, 0]}>
      <cylinderGeometry args={[4.1, 4.1, 0.12, 64]} />
      <meshStandardMaterial color="#101214" metalness={0.5} roughness={0.3} />
    </mesh>
    <mesh position={[0, -0.04, 0]}>
      <torusGeometry args={[4.05, 0.045, 12, 80]} />
      <meshStandardMaterial color="#d9ff54" emissive="#9bbb28" emissiveIntensity={1.6} />
    </mesh>
  </group>;
}

function SceneObjects() {
  return <>
    <Desk />
    <Laptop />
    <Phone />
    <Camera />
    <Cube />
    <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.35}>
      <mesh position={[-2.9, 1.65, -0.1]} castShadow>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshStandardMaterial color="#d9ff54" metalness={0.15} roughness={0.22} emissive="#405d00" emissiveIntensity={0.3} />
      </mesh>
    </Float>
    <Float speed={1.8} rotationIntensity={0.5} floatIntensity={0.65}>
      <mesh position={[3.05, 1.55, -0.25]} castShadow>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial color="#24292d" metalness={0.75} roughness={0.18} wireframe />
      </mesh>
    </Float>
  </>;
}

export default function InteractiveScene() {
  return <div className="interactive-scene">
    <Canvas shadows dpr={[1, 1.6]} camera={{ position: [0, 3.1, 7.8], fov: 38 }} gl={{ antialias: true }}>
      <color attach="background" args={[new THREE.Color('#0a0a0a')]} />
      <ambientLight intensity={1.4} />
      <directionalLight position={[4, 7, 5]} intensity={3} castShadow />
      <pointLight position={[-4, 3, 2]} color="#d9ff54" intensity={20} distance={8} />
      <pointLight position={[4, 2, -2]} color="#6bc6ff" intensity={10} distance={7} />
      <SceneObjects />
      <Sparkles count={80} scale={[8, 4, 6]} size={2} speed={0.35} color="#d9ff54" />
      <OrbitControls enablePan={false} minDistance={6.4} maxDistance={10} minPolarAngle={Math.PI / 3.2} maxPolarAngle={Math.PI / 2.05} autoRotate autoRotateSpeed={0.45} />
    </Canvas>
    <div className="scene-hint"><span>↔</span> Drag to explore</div>
  </div>;
}
