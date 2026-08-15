import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client.js";
import { useApi } from "../hooks/useApi.js";
import DataState from "../components/DataState.jsx";

export default function AlternativeSuppliersPage() {
  const { id } = useParams();
  const { data, loading, error } = useApi(
    () =>
      Promise.all([api.getSupplierDependencies(id), api.getSupplierAlternatives(id)]).then(
        ([dependencies, alternatives]) => ({ dependencies, alternatives })
      ),
    [id]
  );

  const uncoveredMaterials = useMemo(() => {
    if (!data) return [];
    const coveredIds = new Set();
    data.alternatives.alternatives.forEach((alt) =>
      alt.sharedMaterials.forEach((m) => coveredIds.add(m.id))
    );
    return data.dependencies.materials.filter((m) => !coveredIds.has(m.id));
  }, [data]);

  return (
    <div>
      <Link to={`/suppliers/${id}`} className="back-link">
        ← Supplier details
      </Link>

      <DataState loading={loading} error={error} isEmpty={false}>
        {data && (
          <>
            <div className="page-header">
              <div>
                <h1>If {data.alternatives.supplier.name} became unavailable</h1>
                <p className="page-subtitle">
                  Backup suppliers for each material this supplier currently provides.
                </p>
              </div>
            </div>

            {uncoveredMaterials.length > 0 && (
              <div className="callout callout--warning">
                <strong>No backup supplier on file for:</strong>{" "}
                {uncoveredMaterials.map((m) => m.name).join(", ")}.
              </div>
            )}

            {data.alternatives.alternatives.length === 0 ? (
              <div className="card">
                <p className="muted">
                  No other supplier in the system currently provides any of this supplier&apos;s materials.
                </p>
              </div>
            ) : (
              <div className="card card--glow">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Alternative supplier</th>
                      <th>Region</th>
                      <th>Covers materials</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.alternatives.alternatives.map((alt) => (
                      <tr key={alt.id}>
                        <td className="table-cell--primary">{alt.name}</td>
                        <td>
                          <span className="badge badge--region">{alt.region}</span>
                        </td>
                        <td>{alt.sharedMaterials.map((m) => m.name).join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </DataState>
    </div>
  );
}
