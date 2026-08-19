import { useEffect, useMemo, useState } from 'react';
import './performance.css';

const MAX_HISTORY = 40;

const formatMetric = (value) => (
  Number.isFinite(value) ? Math.round(value).toLocaleString() : '—'
);

const formatDecimal = (value, suffix = '') => (
  Number.isFinite(value) ? `${value.toFixed(1)}${suffix}` : '—'
);

const formatHeap = (value) => (
  Number.isFinite(value) ? `${value.toFixed(1)} MB` : '—'
);

const getSummary = (history) => {
  if (!history.length) {
    return {
      averageFps: null,
      minFps: null,
      maxFps: null,
      averageFrameTime: null,
      peakFrameTime: null,
    };
  }

  const fpsValues = history.map((sample) => sample.fps).filter(Number.isFinite);
  const frameTimeValues = history
    .map((sample) => sample.frameTime)
    .filter(Number.isFinite);

  return {
    averageFps: fpsValues.length
      ? fpsValues.reduce((total, value) => total + value, 0) / fpsValues.length
      : null,
    minFps: fpsValues.length ? Math.min(...fpsValues) : null,
    maxFps: fpsValues.length ? Math.max(...fpsValues) : null,
    averageFrameTime: frameTimeValues.length
      ? frameTimeValues.reduce((total, value) => total + value, 0) / frameTimeValues.length
      : null,
    peakFrameTime: frameTimeValues.length ? Math.max(...frameTimeValues) : null,
  };
};

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

export default function PerformancePanel({
  stats,
  sampleInterval = 500,
  historySize = MAX_HISTORY,
}) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!stats) return;

    setHistory((currentHistory) => [
      ...currentHistory,
      stats,
    ].slice(-historySize));
  }, [historySize, stats]);

  const summary = useMemo(() => getSummary(history), [history]);

  return (
    <section
      className="performance-panel"
      aria-label="Performance diagnostics"
    >
      <div className="performance-panel-title">
        <span>PERFORMANCE</span>
        <small>live · {sampleInterval}ms sample</small>
      </div>

      <div className="performance-panel-grid">
        <div>
          <strong>{stats ? Math.round(stats.fps) : '—'}</strong>
          <span>FPS</span>
        </div>
        <div>
          <strong>{formatDecimal(stats?.frameTime, ' ms')}</strong>
          <span>Frame time</span>
        </div>
        <div>
          <strong>{formatMetric(stats?.geometries)}</strong>
          <span>Geometries</span>
        </div>
        <div>
          <strong>{formatMetric(stats?.textures)}</strong>
          <span>Textures</span>
        </div>
        <div>
          <strong>{formatMetric(stats?.calls)}</strong>
          <span>Draw calls</span>
        </div>
        <div>
          <strong>
            {stats?.jsHeap ? formatHeap(stats.jsHeap.usedMB) : '—'}
          </strong>
          <span>JS heap</span>
        </div>
      </div>

      <div className="performance-summary">
        <div>
          <span>AVG FPS</span>
          <strong>{formatDecimal(summary.averageFps)}</strong>
        </div>
        <div>
          <span>MIN FPS</span>
          <strong>{formatDecimal(summary.minFps)}</strong>
        </div>
        <div>
          <span>MAX FPS</span>
          <strong>{formatDecimal(summary.maxFps)}</strong>
        </div>
        <div>
          <span>AVG FRAME</span>
          <strong>{formatDecimal(summary.averageFrameTime, ' ms')}</strong>
        </div>
        <div>
          <span>PEAK FRAME</span>
          <strong>{formatDecimal(summary.peakFrameTime, ' ms')}</strong>
        </div>
      </div>

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
    </section>
  );
}
