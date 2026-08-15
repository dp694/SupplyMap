import { useEffect, useRef, useState } from "react";

const ACCENTS = {
  saffron: { "--metric-accent": "#f97316", "--metric-accent-soft": "#fff2e6" },
  green: { "--metric-accent": "#16a34a", "--metric-accent-soft": "#eafbf1" },
  navy: { "--metric-accent": "#1e293b", "--metric-accent-soft": "#e2e8f0" },
};

// Counts up from 0 to `value` once, the first time a numeric value arrives.
function useCountUp(value, duration = 600) {
  const [display, setDisplay] = useState(0);
  const animated = useRef(false);

  useEffect(() => {
    if (typeof value !== "number" || animated.current) {
      if (typeof value === "number") setDisplay(value);
      return;
    }
    animated.current = true;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [value, duration]);

  return typeof value === "number" ? display : value;
}

export default function MetricCard({ icon, label, value, accent = "saffron" }) {
  const display = useCountUp(value);

  return (
    <div className="metric-card" style={ACCENTS[accent]}>
      <span className="metric-card__icon">{icon}</span>
      <div>
        <p className="metric-card__label">{label}</p>
        <p className="metric-card__value">{display}</p>
      </div>
    </div>
  );
}
