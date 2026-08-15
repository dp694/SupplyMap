const ACCENTS = {
  saffron: { "--metric-accent": "#f97316", "--metric-accent-soft": "#fff2e6" },
  green: { "--metric-accent": "#16a34a", "--metric-accent-soft": "#eafbf1" },
  navy: { "--metric-accent": "#1e293b", "--metric-accent-soft": "#e2e8f0" },
};

export default function MetricCard({ icon, label, value, accent = "saffron" }) {
  return (
    <div className="metric-card" style={ACCENTS[accent]}>
      <span className="metric-card__icon">{icon}</span>
      <div>
        <p className="metric-card__label">{label}</p>
        <p className="metric-card__value">{value}</p>
      </div>
    </div>
  );
}
