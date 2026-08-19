export default function PerformanceTrigger({ isOpen, onToggle }) {
  return (
    <button
      type="button"
      className="performance-panel-trigger"
      aria-controls="performance-panel-drawer"
      aria-expanded={isOpen}
      onClick={onToggle}
    >
      <span>PERFORMANCE</span>
    </button>
  );
}
