export default function MetricCard({ value, label, accent = false }) {
  return (
    <div>
      <strong className={accent ? 'is-accent' : ''}>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
