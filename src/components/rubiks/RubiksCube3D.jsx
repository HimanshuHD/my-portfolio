import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
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
const SCENE_DRAG_THRESHOLD = 4;
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

function resolveDragTarget(face, position, isHorizontal) {
  const basis = FACE_DRAG_BASIS[face];
  if (!basis) return null;

  const right = new THREE.Vector3(...basis.right);
  const up = new THREE.Vector3(...basis.up);
  const point = new THREE.Vector3(...position);
  const column = Math.round(point.dot(right));
  const row = Math.round(point.dot(up));

  if (isHorizontal && (face === 'U' || face === 'D')) return face;

  if (isHorizontal) {
    if (row > 0) return 'U';
    if (row < 0) return 'D';
    return face;
  }

  if (!isHorizontal && (face === 'U' || face === 'D')) {
    if (column > 0) return face === 'U' ? 'F' : 'B';
    if (column < 0) return face === 'U' ? 'B' : 'F';
    return face;
  }

  if (!isHorizontal && (face === 'F' || face === 'B')) {
    if (column > 0) return face === 'F' ? 'R' : 'L';
    if (column < 0) return face === 'F' ? 'L' : 'R';
    return face;
  }

  return face;
}

function FaceDragHandler({ groupRef, onFaceMove, disabled, handlerRef, cancelRef }) {
  const dragRef = useRef(null);

  const cancelDrag = () => {
    dragRef.current = null;
  };

  const handleStickerPointerDown = (event, sticker) => {
    if (disabled) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      normal: sticker.normal.slice(),
      position: sticker.position.slice(),
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
  }, [disabled, handlerRef, cancelRef]);

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
      const isHorizontal = horizontalScore >= verticalScore;
      const dragDirection = isHorizontal
        ? dragScreen.dot(rightScreen)
        : dragScreen.dot(upScreen);

      const targetFace = resolveDragTarget(face, drag.position, isHorizontal);
      if (!targetFace) return;

      const targetBasis = FACE_DRAG_BASIS[targetFace];
      const targetRightWorld = new THREE.Vector3(...targetBasis.right).applyQuaternion(quaternion);
      const targetUpWorld = new THREE.Vector3(...targetBasis.up).applyQuaternion(quaternion);
      const targetRightPoint = origin.clone().add(targetRightWorld).project(drag.camera);
      const targetUpPoint = origin.clone().add(targetUpWorld).project(drag.camera);
      const targetRightScreen = new THREE.Vector2(targetRightPoint.x - originPoint.x, targetRightPoint.y - originPoint.y);
      const targetUpScreen = new THREE.Vector2(targetUpPoint.x - originPoint.x, targetUpPoint.y - originPoint.y);

      if (targetRightScreen.lengthSq() < 1e-8 || targetUpScreen.lengthSq() < 1e-8) return;

      targetRightScreen.normalize();
      targetUpScreen.normalize();
      const targetDirection = isHorizontal
        ? dragScreen.dot(targetRightScreen)
        : dragScreen.dot(targetUpScreen);
      const effectiveDirection = Math.abs(targetDirection) > 0.05 ? targetDirection : dragDirection;

      drag.triggered = true;
      dragRef.current = null;
      onFaceMove?.(`${targetFace}${effectiveDirection > 0 ? '' : "'"}`);
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
  }, [disabled, groupRef, onFaceMove]);

  return null;
}

function arcballPoint(clientX, clientY, rect) {
  const x = ((clientX - rect.left) / rect.width) * 2 - 1;
  const y = 1 - ((clientY - rect.top) / rect.height) * 2;
  const lengthSquared = x * x + y * y;

  if (lengthSquared <= 1) {
    return new THREE.Vector3(x, y, Math.sqrt(1 - lengthSquared));
  }

  const length = Math.sqrt(lengthSquared);
  return new THREE.Vector3(x / length, y / length, 0);
}

function SceneRotationHandler({ groupRef, containerRef, disabled }) {
  const { camera } = useThree();
  const dragRef = useRef(null);
  const previousPointRef = useRef(new THREE.Vector3());

  const cancelDrag = () => {
    dragRef.current = null;
  };

  const handlePointerDown = (event) => {
    if (disabled) return;
    if (event.intersections?.[0]?.object !== event.eventObject) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !groupRef.current) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      dragging: false,
    };
    previousPointRef.current.copy(arcballPoint(event.clientX, event.clientY, rect));
    event.target.setPointerCapture?.(event.pointerId);
  };

  useEffect(() => {
    const handlePointerMove = (event) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId || disabled || !groupRef.current) return;

      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (!drag.dragging && Math.hypot(dx, dy) < SCENE_DRAG_THRESHOLD) return;
      drag.dragging = true;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const currentPoint = arcballPoint(event.clientX, event.clientY, rect);
      const previousPoint = previousPointRef.current;
      const deltaQuaternion = new THREE.Quaternion().setFromUnitVectors(previousPoint, currentPoint);
      const cameraQuaternion = camera.getWorldQuaternion(new THREE.Quaternion());
      const worldDelta = cameraQuaternion.clone()
        .multiply(deltaQuaternion)
        .multiply(cameraQuaternion.clone().invert());

      groupRef.current.quaternion.premultiply(worldDelta).normalize();
      previousPoint.copy(currentPoint);
    };

    const handlePointerUp = (event) => {
      if (dragRef.current?.pointerId !== event.pointerId) return;
      dragRef.current = null;
      event.target.releasePointerCapture?.(event.pointerId);
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
      cancelDrag();
    };
  }, [camera, containerRef, disabled, groupRef]);

  return (
    <mesh position={[0, 0, -20]} onPointerDown={handlePointerDown}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

export default function RubiksCube3D({ cube, activeMove, moveDuration = 450, onAnimationComplete, onFaceMove, onPerformance, interactionDisabled = false }) {
  const cubeGroupRef = useRef();
  const faceDragHandlerRef = useRef(null);
  const faceDragCancelRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const faceDragDisabled = interactionDisabled || Boolean(activeMove);

  return (
    <div ref={canvasContainerRef} className="rubiks-game-canvas">
      <Canvas camera={{ position: [3.5, 3.1, 4.4], fov: 42 }} shadows>
        <ambientLight intensity={1.5} />
        <PerformanceSampler onPerformance={onPerformance} />
        <SceneRotationHandler
          groupRef={cubeGroupRef}
          containerRef={canvasContainerRef}
          disabled={interactionDisabled || Boolean(activeMove)}
        />
        <FaceDragHandler
          groupRef={cubeGroupRef}
          handlerRef={faceDragHandlerRef}
          cancelRef={faceDragCancelRef}
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
          enablePan={false}
          enableRotate={false}
          enableDamping
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
