import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { collectMetrics, PERFORMANCE_METRICS } from './performanceMetrics';

const SAMPLE_INTERVAL = 0.5;

export default function PerformanceMonitor({
  onSample,
  onMeasure,
  sampleInterval = SAMPLE_INTERVAL,
  metrics = PERFORMANCE_METRICS,
  instrumentation,
  metricContext = {},
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
      ...metricContext,
      renderer: state.gl,
      elapsed: sample.elapsed,
      frames: sample.frames,
    };

    const registeredMetrics = instrumentation?.getMetrics() || [];
    const allMetrics = [...metrics, ...registeredMetrics];

    onSample?.({
      timestamp: performance.now(),
      ...collectMetrics(allMetrics, context),
    });

    const measures = instrumentation?.drainMeasures?.() || [];
    if (measures.length) {
      onMeasure?.(measures);
    }

    sample.elapsed = 0;
    sample.frames = 0;
  });

  return null;
}

export { SAMPLE_INTERVAL };
