import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { MOVE_DEFINITIONS, parseMove } from './CubeMoves';
import Cubie, { CUBIE_SPACING } from './Cubie';

const NORMAL_FACE = {
  '0,1,0': 'U',
  '1,0,0': 'R',
  '0,0,1': 'F',
  '0,-1,0': 'D',
  '-1,0,0': 'L',
  '0,0,-1': 'B',
};

const INITIAL_CUBE_ROTATION = [-0.6, 1.4, 2.1];

function cubieKey(position) {
  return position.join(',');
}

function createCubies(stickers) {
  const stickerMap = new Map();

  for (const sticker of stickers) {
    const key = cubieKey(sticker.position);
    const current = stickerMap.get(key) || [];
    current.push(sticker);
    stickerMap.set(key, current);
  }

  const cubies = [];
  for (let x = -1; x <= 1; x += 1) {
    for (let y = -1; y <= 1; y += 1) {
      for (let z = -1; z <= 1; z += 1) {
        const position = [x, y, z];
        cubies.push({
          id: cubieKey(position),
          position,
          stickers: stickerMap.get(cubieKey(position)) || [],
        });
      }
    }
  }

  return cubies;
}

function isCubieInLayer(cubie, definition) {
  const axisIndex = definition.axis === 'x' ? 0 : definition.axis === 'y' ? 1 : 2;
  return cubie.position[axisIndex] === definition.layer;
}

function AnimatedLayer({ cubies, definition, amount, duration, onComplete }) {
  const layerRef = useRef();
  const elapsedRef = useRef(0);
  const completedRef = useRef(false);
  const angle = definition.quarterTurns * amount * (Math.PI / 2);
  const totalDuration = duration * Math.max(1, Math.abs(amount));

  useEffect(() => {
    elapsedRef.current = 0;
    completedRef.current = false;
    if (layerRef.current) layerRef.current.rotation.set(0, 0, 0);
  }, [angle, totalDuration]);

  useFrame((_, delta) => {
    if (!layerRef.current || completedRef.current) return;

    elapsedRef.current += delta;
    const progress = Math.min(elapsedRef.current / (totalDuration / 1000), 1);
    const eased = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    layerRef.current.rotation[definition.axis] = angle * eased;

    if (progress >= 1) {
      completedRef.current = true;
      onComplete?.();
    }
  });

  return (
    <group ref={layerRef}>
      {cubies.map((cubie) => (
        <Cubie
          key={cubie.id}
          position={cubie.position.map((value) => value * CUBIE_SPACING)}
          stickers={cubie.stickers}
        />
      ))}
    </group>
  );
}

function PerformanceSampler({ onPerformance }) {
  const sampleRef = useRef({ elapsed: 0, frames: 0 });

  useFrame((state, delta) => {
    sampleRef.current.elapsed += delta;
    sampleRef.current.frames += 1;

    if (sampleRef.current.elapsed < 0.5) return;

    const renderer = state.gl;
    const info = renderer.info;
    const fps = sampleRef.current.frames / sampleRef.current.elapsed;
    const memory = typeof performance !== 'undefined' && performance.memory
      ? {
          usedMB: performance.memory.usedJSHeapSize / 1024 / 1024,
          totalMB: performance.memory.totalJSHeapSize / 1024 / 1024,
        }
      : null;

    onPerformance?.({
      fps,
      geometries: info.memory.geometries,
      textures: info.memory.textures,
      calls: info.render.calls,
      triangles: info.render.triangles,
      points: info.render.points,
      lines: info.render.lines,
      jsHeap: memory,
    });

    sampleRef.current.elapsed = 0;
    sampleRef.current.frames = 0;
  });

  return null;
}

function GameCube({ cube, activeMove, moveDuration, onAnimationComplete }) {
  const cubies = useMemo(() => createCubies(cube.stickers), [cube]);

  let parsedMove = null;
  let definition = null;
  let animatedCubies = [];
  let staticCubies = cubies;

  if (activeMove) {
    parsedMove = parseMove(activeMove.move);
    definition = MOVE_DEFINITIONS[parsedMove.face];
    animatedCubies = cubies.filter((cubie) => isCubieInLayer(cubie, definition));
    staticCubies = cubies.filter((cubie) => !isCubieInLayer(cubie, definition));
  }

  const renderCubie = (cubie) => (
    <Cubie
      key={cubie.id}
      position={cubie.position.map((value) => value * CUBIE_SPACING)}
      stickers={cubie.stickers}
    />
  );

  return (
    <group rotation={INITIAL_CUBE_ROTATION}>
      {staticCubies.map(renderCubie)}
      {activeMove && parsedMove && definition && (
        <AnimatedLayer
          key={activeMove.id}
          cubies={animatedCubies}
          definition={definition}
          amount={parsedMove.amount}
          duration={moveDuration}
          onComplete={() => onAnimationComplete?.(activeMove.id)}
        />
      )}
    </group>
  );
}

export default function RubiksCube3D({ cube, activeMove, moveDuration = 450, onAnimationComplete, onPerformance }) {
  return (
    <div className="rubiks-game-canvas">
      <Canvas camera={{ position: [3.5, 3.1, 4.4], fov: 42 }} shadows>
        <ambientLight intensity={1.5} />
        <directionalLight position={[4, 6, 5]} intensity={2.4} castShadow />
        <PerformanceSampler onPerformance={onPerformance} />
        <GameCube
          cube={cube}
          activeMove={activeMove}
          moveDuration={moveDuration}
          onAnimationComplete={onAnimationComplete}
        />
        <OrbitControls enablePan={false} minDistance={3.5} maxDistance={7} />
      </Canvas>
    </div>
  );
}

export { NORMAL_FACE };
