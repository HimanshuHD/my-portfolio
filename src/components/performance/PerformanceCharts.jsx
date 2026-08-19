const formatDecimal = (value, suffix = '') => (
  Number.isFinite(value) ? `${value.toFixed(1)}${suffix}` : '—'
);

const buildPath = (history, metric, width, height, min, max) => {
  if (!history.length) return '';

  const range = Math.max(max - min, 1);
  const step = history.length === 1 ? width : width / (history.length - 1);

  return history
    .map((sample, index) => {
      const value = Number.isFinite(sample[metric]) ? sample[metric] : min;
      const x = index * step;
      const y = height - ((value - min) / range) * height;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
};

function MetricChart({ history, metric, label, unit }) {
  const values = history
    .map((sample) => sample[metric])
    .filter(Number.isFinite);

  if (!values.length) return null;

  const width = 260;
  const height = 46;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const path = buildPath(history, metric, width, height, min, max);

  return (
    <div className="performance-chart">
      <div className="performance-chart-header">
        <span>{label}</span>
        <span>{formatDecimal(values[values.length - 1], unit)}</span>
      </div>
      <svg
        className="performance-chart-svg"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        aria-label={`${label} history`}
        role="img"
      >
        <path d={path} vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

export default function PerformanceCharts({ history }) {
  return (
    <div className="performance-charts">
      <MetricChart
        history={history}
        metric="fps"
        label="FPS history"
        unit=" fps"
      />
      <MetricChart
        history={history}
        metric="geometries"
        label="Geometry history"
        unit=""
      />
    </div>
  );
}
