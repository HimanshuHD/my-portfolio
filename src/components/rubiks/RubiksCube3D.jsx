import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { MOVE_DEFINITIONS, parseMove } from './CubeMoves';

const FACE_COLORS = { U: '#f4f0d7', R: '#e12d2d', F: '#198b49', D: '#f0d329', L: '#ef7822', B: '#1769aa' };
const NORMAL_FACE = { '0,1,0': 'U', '1,0,0': 'R', '0,0,1': 'F', '0,-1,0': 'D', '-1,0,0': 'L', '0,0,-1': 'B' };
const CUBE_SIZE = 1.65;
const CUBE_HALF = CUBE_SIZE / 2;
const STICKER_OFFSET = CUBE_HALF + 0.012;

function Sticker({ sticker }) {
  const [x, y, z] = sticker.position;
  const [nx, ny, nz] = sticker.normal;
  let rotation = [0, 0, 0];
  if (ny) rotation = [-Math.PI / 2, 0, 0];
  else if (nx) rotation = [0, Math.PI / 2, 0];
  else if (nz < 0) rotation = [0, Math.PI, 0];
  const color = FACE_COLORS[sticker.color] || '#ffffff';

  return <mesh position={[x * 0.52 + nx * (STICKER_OFFSET - 0.52), y * 0.52 + ny * (STICKER_OFFSET - 0.52), z * 0.52 + nz * (STICKER_OFFSET - 0.52)]} rotation={rotation}>
    <planeGeometry args={[0.43, 0.43]} />
    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.08} roughness={0.38} metalness={0.02} side={THREE.DoubleSide} toneMapped={false} />
  </mesh>;
}

function isStickerInLayer(sticker, definition) {
  const axisIndex = definition.axis === 'x' ? 0 : definition.axis === 'y' ? 1 : 2;
  return sticker.position[axisIndex] === definition.layer;
}

function AnimatedLayer({ stickers, definition, amount, duration, onComplete }) {
  const layerRef = useRef();
  const elapsedRef = useRef(0);
  const completedRef = useRef(false);
  const angle = definition.quarterTurns * amount * (Math.PI / 2);

  useEffect(() => {
    elapsedRef.current = 0;
    completedRef.current = false;
    if (layerRef.current) layerRef.current.rotation.set(0, 0, 0);
  }, [angle, duration]);

  useFrame((_, delta) => {
    if (!layerRef.current || completedRef.current) return;
    elapsedRef.current += delta;
    const progress = Math.min(elapsedRef.current / (duration / 1000), 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    layerRef.current.rotation[definition.axis] = angle * eased;

    if (progress >= 1) {
      completedRef.current = true;
      onComplete?.();
    }
  });

  return <group ref={layerRef}>
    {stickers.map((sticker, index) => <Sticker key={`${sticker.color}-${index}`} sticker={sticker} />)}
  </group>;
}

function GameCube({ cube, activeMove, moveDuration, onAnimationComplete }) {
  let animatedStickers = [];
  let staticStickers = cube.stickers;
  let parsedMove = null;

  if (activeMove) {
    parsedMove = parseMove(activeMove.move);
    const definition = MOVE_DEFINITIONS[parsedMove.face];
    animatedStickers = cube.stickers.filter((sticker) => isStickerInLayer(sticker, definition));
    staticStickers = cube.stickers.filter((sticker) => !isStickerInLayer(sticker, definition));
  }

  return <group rotation={[0.48, -0.68, 0]}>
    <RoundedBox args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} radius={0.08} smoothness={4} castShadow><meshStandardMaterial color="#111315" roughness={0.34} /></RoundedBox>
    {staticStickers.map((sticker, index) => <Sticker key={`static-${index}`} sticker={sticker} />)}
    {activeMove && parsedMove && <AnimatedLayer key={activeMove.id} stickers={animatedStickers} definition={MOVE_DEFINITIONS[parsedMove.face]} amount={parsedMove.amount} duration={moveDuration} onComplete={() => onAnimationComplete?.(activeMove.id)} />}
  </group>;
}

export default function RubiksCube3D({ cube, activeMove, moveDuration = 450, onAnimationComplete }) {
  return <div className="rubiks-game-canvas"><Canvas camera={{ position: [3.5, 3.1, 4.4], fov: 42 }} shadows><ambientLight intensity={1.5} /><directionalLight position={[4, 6, 5]} intensity={2.4} castShadow /><GameCube cube={cube} activeMove={activeMove} moveDuration={moveDuration} onAnimationComplete={onAnimationComplete} /><OrbitControls enablePan={false} minDistance={3.5} maxDistance={7} /></Canvas></div>;
}

export { NORMAL_FACE };
