import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const SAMPLE_INTERVAL = 0.5;

function readJsHeap() {
  if (typeof performance === 'undefined' || !performance.memory) {
    return null;
  }

  return {
    usedMB: performance.memory.usedJSHeapSize / 1024 / 1024,
    totalMB: performance.memory.totalJSHeapSize / 1024 / 1024,
  };
}

export default function PerformanceMonitor({
  onSample,
  sampleInterval = SAMPLE_INTERVAL,
}) {
  const sampleRef = useRef({
    elapsed: 0,
    frames: 0,
  });

  useFrame((state, delta) => {
    const sample = sampleRef.current;
    sample.elapsed += delta;
    sample.frames += 1;

    if (sample.elapsed < sampleInterval) {
      return;
    }

    const renderer = state.gl;
    const info = renderer.info;
    const fps = sample.frames / sample.elapsed;

    onSample?.({
      fps,
      geometries: info.memory.geometries,
      textures: info.memory.textures,
      calls: info.render.calls,
      triangles: info.render.triangles,
      points: info.render.points,
      lines: info.render.lines,
      jsHeap: readJsHeap(),
    });

    sample.elapsed = 0;
    sample.frames = 0;
  });

  return null;
}

export { SAMPLE_INTERVAL };
