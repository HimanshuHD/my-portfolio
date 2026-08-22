export const DEFAULT_PERFORMANCE_THRESHOLDS = {
  fps: {
    warningBelow: 50,
    criticalBelow: 30,
  },
  frameTime: {
    warningAbove: 20,
    criticalAbove: 33.3,
  },
};

export const getMetricThresholdStatus = (value, threshold) => {
  if (!Number.isFinite(value) || !threshold) {
    return 'neutral';
  }

  if (
    Number.isFinite(threshold.criticalBelow)
    && value <= threshold.criticalBelow
  ) {
    return 'critical';
  }

  if (
    Number.isFinite(threshold.criticalAbove)
    && value >= threshold.criticalAbove
  ) {
    return 'critical';
  }

  if (
    Number.isFinite(threshold.warningBelow)
    && value <= threshold.warningBelow
  ) {
    return 'warning';
  }

  if (
    Number.isFinite(threshold.warningAbove)
    && value >= threshold.warningAbove
  ) {
    return 'warning';
  }

  return 'healthy';
};

export const getThresholdsForMetric = (metric, thresholds) => (
  thresholds?.[metric] || null
);

export const getResourceMetricIds = () => [
  'geometries',
  'textures',
  'calls',
  'triangles',
  'points',
  'lines',
  'programs',
];
