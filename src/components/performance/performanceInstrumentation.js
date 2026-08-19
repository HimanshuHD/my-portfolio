const now = () => (
  typeof performance !== 'undefined' ? performance.now() : Date.now()
);

const normalizeMetric = (metric) => {
  if (!metric?.id || typeof metric.collect !== 'function') {
    throw new Error('Performance metric requires an id and collect function.');
  }

  return {
    category: 'custom',
    unit: 'value',
    ...metric,
  };
};

export const createPerformanceInstrumentation = () => {
  const metrics = new Map();
  const marks = new Map();
  const measures = [];

  return {
    registerMetric(metric) {
      const normalizedMetric = normalizeMetric(metric);
      metrics.set(normalizedMetric.id, normalizedMetric);

      return () => {
        metrics.delete(normalizedMetric.id);
      };
    },

    unregisterMetric(id) {
      metrics.delete(id);
    },

    getMetrics() {
      return Array.from(metrics.values());
    },

    mark(name) {
      if (!name) return null;

      const timestamp = now();
      marks.set(name, timestamp);

      return timestamp;
    },

    measure(name, startMark, endMark) {
      const start = marks.get(startMark);
      const end = endMark ? marks.get(endMark) : now();

      if (!Number.isFinite(start) || !Number.isFinite(end)) {
        return null;
      }

      const event = {
        name,
        startMark,
        endMark: endMark || null,
        duration: end - start,
        timestamp: end,
      };

      measures.push(event);
      return event;
    },

    getMeasures() {
      return [...measures];
    },

    clearMeasures() {
      measures.length = 0;
    },

    clearMarks() {
      marks.clear();
    },
  };
};
