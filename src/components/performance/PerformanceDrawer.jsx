export default function PerformanceDrawer({ isOpen, onClose, children }) {
  return (
    <>
      <div
        className={`performance-panel-overlay${isOpen ? ' is-open' : ''}`}
        aria-hidden={!isOpen}
        onClick={onClose}
      />

      <aside
        id="performance-panel-drawer"
        className={`performance-panel-drawer${isOpen ? ' is-open' : ''}`}
        aria-label="Performance diagnostics"
        aria-hidden={!isOpen}
      >
        {children}
      </aside>
    </>
  );
}
