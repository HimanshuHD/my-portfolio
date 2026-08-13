import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
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

const FACE_DRAG_BASIS = {
  U: { right: [1, 0, 0], up: [0, 0, 1] },
  R: { right: [0, 0, -1], up: [0, 1, 0] },
  F: { right: [1, 0, 0], up: [0, 1, 0] },
  D: { right: [1, 0, 0], up: [0, 0, -1] },
  L: { right: [0, 0, 1], up: [0, 1, 0] },
  B: { right: [-1, 0, 0], up: [0, 1, 0] },
};

const FACE_DRAG_THRESHOLD = 18;
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

function AnimatedLayer({ cubies, definition, amount, duration, onComplete, onStickerPointerDown }) {
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
          onStickerPointerDown={onStickerPointerDown}
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

function GameCube({ cube, activeMove, moveDuration, onAnimationComplete, onStickerPointerDown, groupRef }) {
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
      onStickerPointerDown={onStickerPointerDown}
    />
  );

  return (
    <group ref={groupRef} rotation={INITIAL_CUBE_ROTATION}>
      {staticCubies.map(renderCubie)}
      {activeMove && parsedMove && definition && (
        <AnimatedLayer
          key={activeMove.id}
          cubies={animatedCubies}
          definition={definition}
          amount={parsedMove.amount}
          duration={moveDuration}
          onComplete={() => onAnimationComplete?.(activeMove.id)}
          onStickerPointerDown={onStickerPointerDown}
        />
      )}
    </group>
  );
}

function FaceDragHandler({ groupRef, onFaceMove, disabled, handlerRef, cancelRef, controlsRef }) {
  const dragRef = useRef(null);

  const releaseControls = () => {
    if (controlsRef.current) controlsRef.current.enabled = true;
  };

  const cancelDrag = () => {
    dragRef.current = null;
    releaseControls();
  };

  const handleStickerPointerDown = (event, sticker) => {
    if (disabled) return;

    if (controlsRef.current) controlsRef.current.enabled = false;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      normal: sticker.normal.slice(),
      camera: event.camera,
      triggered: false,
    };
  };

  useEffect(() => {
    handlerRef.current = handleStickerPointerDown;
    cancelRef.current = cancelDrag;

    return () => {
      if (handlerRef.current === handleStickerPointerDown) handlerRef.current = null;
      if (cancelRef.current === cancelDrag) cancelRef.current = null;
      cancelDrag();
    };
  }, [disabled, handlerRef, cancelRef, controlsRef]);

  useEffect(() => {
    const handlePointerMove = (event) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId || drag.triggered || disabled) return;

      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (Math.hypot(dx, dy) < FACE_DRAG_THRESHOLD) return;

      const face = NORMAL_FACE[drag.normal.join(',')];
      const basis = FACE_DRAG_BASIS[face];
      if (!basis || !groupRef.current) return;

      const quaternion = groupRef.current.getWorldQuaternion(new THREE.Quaternion());
      const rightWorld = new THREE.Vector3(...basis.right).applyQuaternion(quaternion);
      const upWorld = new THREE.Vector3(...basis.up).applyQuaternion(quaternion);
      const origin = groupRef.current.getWorldPosition(new THREE.Vector3());

      const originPoint = origin.clone().project(drag.camera);
      const rightPoint = origin.clone().add(rightWorld).project(drag.camera);
      const upPoint = origin.clone().add(upWorld).project(drag.camera);
      const rightScreen = new THREE.Vector2(rightPoint.x - originPoint.x, rightPoint.y - originPoint.y);
      const upScreen = new THREE.Vector2(upPoint.x - originPoint.x, upPoint.y - originPoint.y);
      const dragScreen = new THREE.Vector2(dx, -dy);

      if (rightScreen.lengthSq() < 1e-8 || upScreen.lengthSq() < 1e-8) return;

      rightScreen.normalize();
      upScreen.normalize();

      const horizontalScore = Math.abs(dragScreen.dot(rightScreen));
      const verticalScore = Math.abs(dragScreen.dot(upScreen));
      const clockwise = horizontalScore >= verticalScore
        ? dragScreen.dot(rightScreen) > 0
        : dragScreen.dot(upScreen) > 0;

      drag.triggered = true;
      dragRef.current = null;
      releaseControls();
      onFaceMove?.(`${face}${clockwise ? '' : "'"}`);
    };

    const handlePointerUp = (event) => {
      if (dragRef.current?.pointerId === event.pointerId) cancelDrag();
    };

    const handleWindowBlur = () => cancelDrag();
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') cancelDrag();
    };
    const handleLostPointerCapture = (event) => {
      if (dragRef.current?.pointerId === event.pointerId) cancelDrag();
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('lostpointercapture', handleLostPointerCapture);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('lostpointercapture', handleLostPointerCapture);
    };
  }, [disabled, groupRef, onFaceMove, controlsRef]);

  return null;
}

export default function RubiksCube3D({ cube, activeMove, moveDuration = 450, onAnimationComplete, onFaceMove, onPerformance, interactionDisabled = false }) {
  const cubeGroupRef = useRef();
  const faceDragHandlerRef = useRef(null);
  const faceDragCancelRef = useRef(null);
  const controlsRef = useRef();
  const canvasContainerRef = useRef(null);
  const faceDragDisabled = interactionDisabled || Boolean(activeMove);

  useEffect(() => {
    const element = canvasContainerRef.current;
    if (!element) return undefined;

    const cancelSceneInteraction = () => {
      faceDragCancelRef.current?.();
      if (controlsRef.current) {
        controlsRef.current.enabled = !interactionDisabled && !activeMove;
      }
    };

    element.addEventListener('pointerleave', cancelSceneInteraction);
    element.addEventListener('lostpointercapture', cancelSceneInteraction);

    return () => {
      element.removeEventListener('pointerleave', cancelSceneInteraction);
      element.removeEventListener('lostpointercapture', cancelSceneInteraction);
      cancelSceneInteraction();
    };
  }, [interactionDisabled, activeMove]);

  return (
    <div ref={canvasContainerRef} className="rubiks-game-canvas">
      <Canvas camera={{ position: [3.5, 3.1, 4.4], fov: 42 }} shadows>
        <ambientLight intensity={1.5} />
        <PerformanceSampler onPerformance={onPerformance} />
        <FaceDragHandler
          groupRef={cubeGroupRef}
          handlerRef={faceDragHandlerRef}
          cancelRef={faceDragCancelRef}
          controlsRef={controlsRef}
          onFaceMove={onFaceMove}
          disabled={faceDragDisabled}
        />
        <GameCube
          cube={cube}
          activeMove={activeMove}
          moveDuration={moveDuration}
          onAnimationComplete={onAnimationComplete}
          onStickerPointerDown={(event, sticker) => faceDragHandlerRef.current?.(event, sticker)}
          groupRef={cubeGroupRef}
        />
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.7}
          zoomSpeed={0.8}
          minDistance={3.5}
          maxDistance={7}
          enabled={!interactionDisabled && !activeMove}
        />
      </Canvas>
    </div>
  );
}

export { NORMAL_FACE };
