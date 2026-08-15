import { Link, useParams } from "react-router-dom";
import { api } from "../api/client.js";
import { useApi } from "../hooks/useApi.js";
import DataState from "../components/DataState.jsx";
import CopyableEmail from "../components/CopyableEmail.jsx";

export default function SupplierDetailPage() {
  const { id } = useParams();
  const { data: supplier, loading, error } = useApi(() => api.getSupplier(id), [id]);

  return (
    <div>
      <Link to="/" className="back-link">
        ← All suppliers
      </Link>

      <DataState loading={loading} error={error} isEmpty={false}>
        {supplier && (
          <>
            <div className="page-header">
              <div>
                <h1>{supplier.name}</h1>
                <p className="page-subtitle">
                  <span className="badge badge--region">{supplier.region}</span>{" "}
                  <CopyableEmail email={supplier.contactEmail} />
                </p>
              </div>
              <div className="action-group">
                <Link className="button button--primary" to={`/suppliers/${id}/dependencies`}>
                  View dependency map
                </Link>
                <Link className="button button--secondary" to={`/suppliers/${id}/alternatives`}>
                  Simulate unavailability
                </Link>
              </div>
            </div>

            <section className="card card--glow">
              <h2 className="card-title">Materials supplied</h2>
              {supplier.materials.length === 0 ? (
                <p className="muted">This supplier has no materials on record.</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplier.materials.map((material) => (
                      <tr key={material.id}>
                        <td className="table-cell--primary">{material.name}</td>
                        <td>{material.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          </>
        )}
      </DataState>
    </div>
  );
}
