import { Link, Outlet } from "react-router-dom";

function BrandIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <circle cx="5" cy="13" r="3.4" fill="#1e293b" />
      <circle cx="13" cy="5" r="3.4" fill="#16a34a" />
      <circle cx="21" cy="13" r="3.4" fill="#f97316" />
      <path
        d="M8 11.5L10.5 7.5M15.5 7.5L18 11.5"
        stroke="#cbd5e1"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Layout() {
  return (
    <div className="app-shell">
      <div className="tricolour-strip" aria-hidden="true" />
      <header className="topbar">
        <Link to="/" className="brand-mark">
          <span className="brand-icon">
            <BrandIcon />
          </span>
          <span className="brand-text">
            <span className="brand-wordmark">SupplyMap</span>
            <span className="brand-accent-line" aria-hidden="true" />
          </span>
        </Link>
        <span className="brand-subtitle">Supplier dependency tracker</span>
      </header>
      <main className="page">
        <Outlet />
      </main>
    </div>
  );
}
