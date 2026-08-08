import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Sparkles } from '@react-three/drei';
import { useRef } from 'react';

function Gadget() {
  const group = useRef();
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.22;
  });

  return <group ref={group} rotation={[0.18, 0.2, -0.08]}>
    <Float speed={1.4} rotationIntensity={0.45} floatIntensity={0.7}>
      <mesh>
        <boxGeometry args={[2.9, 1.8, 0.18]} />
        <meshStandardMaterial color="#151515" metalness={0.8} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0, 0.11]}>
        <boxGeometry args={[2.55, 1.45, 0.035]} />
        <meshStandardMaterial color="#202620" emissive="#9ebf32" emissiveIntensity={0.18} roughness={0.3} />
      </mesh>
      <mesh position={[0, -1.02, 0]}>
        <boxGeometry args={[3.25, 0.16, 0.42]} />
        <meshStandardMaterial color="#2b2b29" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.98, -0.92, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.16, 0.045, 12, 32]} />
        <meshStandardMaterial color="#d9ff54" emissive="#d9ff54" emissiveIntensity={0.7} />
      </mesh>
    </Float>
  </group>;
}

export default function HeroScene() {
  return <div className="hero-scene" aria-hidden="true">
    <Canvas camera={{ position: [0, 0, 6.5], fov: 42 }} dpr={[1, 1.6]}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 4, 5]} intensity={2.4} />
      <pointLight position={[-3, -1, 3]} color="#d9ff54" intensity={5} distance={8} />
      <Gadget />
      <Sparkles count={45} scale={7} size={1.5} speed={0.35} color="#d9ff54" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
    <div className="scene-glow" />
  </div>;
}
