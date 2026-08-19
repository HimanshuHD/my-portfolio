import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { collectMetrics, PERFORMANCE_METRICS } from './performanceMetrics';

const SAMPLE_INTERVAL = 0.5;

export default function PerformanceMonitor({
  onSample,
  sampleInterval = SAMPLE_INTERVAL,
  metrics = PERFORMANCE_METRICS,
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

    const context = {
      renderer: state.gl,
      elapsed: sample.elapsed,
      frames: sample.frames,
    };

    onSample?.({
      timestamp: performance.now(),
      ...collectMetrics(metrics, context),
    });

    sample.elapsed = 0;
    sample.frames = 0;
  });

  return null;
}

export { SAMPLE_INTERVAL };
