import { useEffect, useMemo, useState } from 'react';
import './performance.css';
import MetricCard from './MetricCard';
import PerformanceCharts from './PerformanceCharts';
import PerformanceDrawer from './PerformanceDrawer';
import PerformanceTrigger from './PerformanceTrigger';

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

const formatCustomMetric = (value, unit = '') => {
  if (!Number.isFinite(value)) return '—';

  if (unit === 'ms') return formatDecimal(value, ' ms');
  if (unit === 'count') return formatMetric(value);

  return `${formatDecimal(value)}${unit ? ` ${unit}` : ''}`;
};

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

export default function PerformancePanel({
  stats,
  sampleInterval = 500,
  historySize = MAX_HISTORY,
  customMetrics = [],
  measures = [],
}) {
  const [history, setHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!stats) return;

    setHistory((currentHistory) => [
      ...currentHistory,
      stats,
    ].slice(-historySize));
  }, [historySize, stats]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const summary = useMemo(() => getSummary(history), [history]);

  return (
    <>
      <PerformanceTrigger
        isOpen={isOpen}
        onToggle={() => setIsOpen((open) => !open)}
      />

      <PerformanceDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="performance-panel">
          <div className="performance-panel-title">
            <span>PERFORMANCE</span>
            <div className="performance-panel-actions">
              <small>live · {sampleInterval}ms sample</small>
              <button
                type="button"
                className="performance-panel-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close performance panel"
              >
                ×
              </button>
            </div>
          </div>

          <div className="performance-panel-grid">
            <MetricCard
              value={stats ? Math.round(stats.fps) : '—'}
              label="FPS"
              accent
            />
            <MetricCard
              value={formatDecimal(stats?.frameTime, ' ms')}
              label="Frame time"
            />
            <MetricCard
              value={formatMetric(stats?.geometries)}
              label="Geometries"
            />
            <MetricCard
              value={formatMetric(stats?.textures)}
              label="Textures"
            />
            <MetricCard
              value={formatMetric(stats?.calls)}
              label="Draw calls"
            />
            <MetricCard
              value={stats?.jsHeap ? formatHeap(stats.jsHeap.usedMB) : '—'}
              label="JS heap"
            />
          </div>

          <div className="performance-summary">
            <MetricCard value={formatDecimal(summary.averageFps)} label="AVG FPS" />
            <MetricCard value={formatDecimal(summary.minFps)} label="MIN FPS" />
            <MetricCard value={formatDecimal(summary.maxFps)} label="MAX FPS" />
            <MetricCard
              value={formatDecimal(summary.averageFrameTime, ' ms')}
              label="AVG FRAME"
            />
            <MetricCard
              value={formatDecimal(summary.peakFrameTime, ' ms')}
              label="PEAK FRAME"
            />
          </div>

          {customMetrics.length > 0 && (
            <section className="performance-section" aria-labelledby="performance-custom-metrics">
              <h3 id="performance-custom-metrics">APPLICATION</h3>
              <div className="performance-custom-metrics">
                {customMetrics.map((metric) => (
                  <MetricCard
                    key={metric.id}
                    value={formatCustomMetric(stats?.[metric.id], metric.unit)}
                    label={metric.label}
                  />
                ))}
              </div>
            </section>
          )}

          {measures.length > 0 && (
            <section className="performance-section" aria-labelledby="performance-events">
              <h3 id="performance-events">EVENTS</h3>
              <div className="performance-events">
                {measures.slice(-6).reverse().map((measure) => (
                  <div className="performance-event" key={`${measure.name}-${measure.timestamp}`}>
                    <span>{measure.name}</span>
                    <strong>{formatDecimal(measure.duration, ' ms')}</strong>
                  </div>
                ))}
              </div>
            </section>
          )}

          <PerformanceCharts history={history} />
        </div>
      </PerformanceDrawer>
    </>
  );
}
