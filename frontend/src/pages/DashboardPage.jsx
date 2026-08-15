import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import { useApi } from "../hooks/useApi.js";
import DataState from "../components/DataState.jsx";
import MetricCard from "../components/MetricCard.jsx";
import CopyableEmail from "../components/CopyableEmail.jsx";
import { SearchIcon, BuildingIcon, MapPinIcon, PackageIcon } from "../components/icons.jsx";

export default function DashboardPage() {
  const { data: suppliers, loading, error } = useApi(() => api.getSuppliers(), []);
  const { data: materials } = useApi(() => api.getMaterials(), []);
  const [query, setQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const navigate = useNavigate();

  const regions = useMemo(() => {
    if (!suppliers) return [];
    return [...new Set(suppliers.map((s) => s.region))].sort();
  }, [suppliers]);

  const filtered = useMemo(() => {
    if (!suppliers) return [];
    return suppliers.filter((s) => {
      const matchesQuery = s.name.toLowerCase().includes(query.toLowerCase());
      const matchesRegion = regionFilter === "all" || s.region === regionFilter;
      return matchesQuery && matchesRegion;
    });
  }, [suppliers, query, regionFilter]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Suppliers</h1>
          <p className="page-subtitle">
            Select a supplier to inspect the materials, products and backup suppliers behind it.
          </p>
        </div>
      </div>

      {suppliers && suppliers.length > 0 && (
        <div className="metrics-row">
          <MetricCard
            icon={<BuildingIcon />}
            label="Total suppliers"
            value={suppliers.length}
            accent="saffron"
          />
          <MetricCard
            icon={<MapPinIcon />}
            label="Active regions"
            value={regions.length}
            accent="green"
          />
          <MetricCard
            icon={<PackageIcon />}
            label="Total materials"
            value={materials ? materials.length : "…"}
            accent="navy"
          />
        </div>
      )}

      <div className="toolbar">
        <div className="search-field">
          <span className="search-field__icon">
            <SearchIcon />
          </span>
          <input
            type="search"
            className="input"
            placeholder="Search suppliers by name…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search suppliers"
          />
        </div>
        <select
          className="input select"
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          aria-label="Filter by region"
        >
          <option value="all">All regions</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      <DataState
        loading={loading}
        error={error}
        isEmpty={!loading && !error && filtered.length === 0}
        emptyText={
          suppliers && suppliers.length > 0
            ? "No suppliers match your search."
            : "No suppliers found. Run the seed script to load sample data."
        }
      >
        <div className="card card--glow">
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th>Region</th>
                  <th>Contact</th>
                  <th>Materials supplied</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className="table-row--clickable"
                    onClick={() => navigate(`/suppliers/${supplier.id}`)}
                  >
                    <td className="table-cell--primary">{supplier.name}</td>
                    <td>
                      <span className="badge badge--region">{supplier.region}</span>
                    </td>
                    <td>
                      <CopyableEmail email={supplier.contactEmail} />
                    </td>
                    <td>
                      <span className="badge badge--count">{supplier.materialCount}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DataState>
    </div>
  );
}
