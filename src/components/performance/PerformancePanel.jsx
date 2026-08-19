import './performance.css';

const formatMetric = (value) => (Number.isFinite(value) ? Math.round(value).toLocaleString() : '—');
const formatHeap = (value) => (Number.isFinite(value) ? `${value.toFixed(1)} MB` : '—');

export default function PerformancePanel({ stats, sampleInterval = 500 }) {
  return (
    <section className="performance-panel" aria-label="Performance diagnostics">
      <div className="performance-panel-title">
        <span>PERFORMANCE</span>
        <small>live · {sampleInterval}ms sample</small>
      </div>
      <div className="performance-panel-grid">
        <div><strong>{stats ? Math.round(stats.fps) : '—'}</strong><span>FPS</span></div>
        <div><strong>{formatMetric(stats?.geometries)}</strong><span>Geometries</span></div>
        <div><strong>{formatMetric(stats?.textures)}</strong><span>Textures</span></div>
        <div><strong>{formatMetric(stats?.calls)}</strong><span>Draw calls</span></div>
        <div><strong>{formatMetric(stats?.triangles)}</strong><span>Triangles</span></div>
        <div><strong>{stats?.jsHeap ? formatHeap(stats.jsHeap.usedMB) : '—'}</strong><span>JS heap</span></div>
      </div>
    </section>
  );
}
