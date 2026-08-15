import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import ReactFlow, { Background, Controls, MarkerType } from "reactflow";
import "reactflow/dist/style.css";
import { api } from "../api/client.js";
import { useApi } from "../hooks/useApi.js";
import DataState from "../components/DataState.jsx";

const COLUMN_X = { supplier: 40, material: 340, product: 640 };
const ROW_HEIGHT = 70;

function buildGraph(dependencies) {
  const nodes = [];
  const edges = [];

  nodes.push({
    id: `supplier:${dependencies.supplier.id}`,
    position: { x: COLUMN_X.supplier, y: (dependencies.materials.length * ROW_HEIGHT) / 2 },
    data: { label: dependencies.supplier.name },
    className: "flow-node flow-node--supplier",
  });

  const productIndex = new Map();
  let productRow = 0;

  dependencies.materials.forEach((material, materialRow) => {
    const materialNodeId = `material:${material.id}`;
    nodes.push({
      id: materialNodeId,
      position: { x: COLUMN_X.material, y: materialRow * ROW_HEIGHT },
      data: { label: material.name },
      className: "flow-node flow-node--material",
    });
    edges.push({
      id: `${dependencies.supplier.id}->${material.id}`,
      source: `supplier:${dependencies.supplier.id}`,
      target: materialNodeId,
      markerEnd: { type: MarkerType.ArrowClosed },
    });

    material.products.forEach((product) => {
      const productNodeId = `product:${product.id}`;
      if (!productIndex.has(productNodeId)) {
        productIndex.set(productNodeId, productRow);
        nodes.push({
          id: productNodeId,
          position: { x: COLUMN_X.product, y: productRow * ROW_HEIGHT },
          data: { label: product.name },
          className: "flow-node flow-node--product",
        });
        productRow += 1;
      }
      edges.push({
        id: `${material.id}->${product.id}`,
        source: materialNodeId,
        target: productNodeId,
        markerEnd: { type: MarkerType.ArrowClosed },
      });
    });
  });

  return { nodes, edges };
}

export default function DependencyMapPage() {
  const { id } = useParams();
  const { data: dependencies, loading, error } = useApi(
    () => api.getSupplierDependencies(id),
    [id]
  );

  const graph = useMemo(() => (dependencies ? buildGraph(dependencies) : null), [dependencies]);

  return (
    <div>
      <Link to={`/suppliers/${id}`} className="back-link">
        ← Supplier details
      </Link>

      <DataState loading={loading} error={error} isEmpty={false}>
        {dependencies && (
          <>
            <div className="page-header">
              <div>
                <h1>Dependency map: {dependencies.supplier.name}</h1>
                <p className="page-subtitle">
                  {dependencies.materials.length} material(s) supplied, affecting{" "}
                  {dependencies.affectedProductCount} product(s).
                </p>
              </div>
              <Link className="button button--secondary" to={`/suppliers/${id}/alternatives`}>
                Simulate unavailability
              </Link>
            </div>

            {dependencies.materials.length === 0 ? (
              <div className="card">
                <p className="muted">This supplier has no recorded materials, so nothing downstream to map.</p>
              </div>
            ) : (
              <div className="card card--glow flow-card">
                <div className="flow-legend">
                  <span className="legend-item legend-item--supplier">Supplier</span>
                  <span className="legend-item legend-item--material">Material</span>
                  <span className="legend-item legend-item--product">Product</span>
                </div>
                <div className="flow-container">
                  <ReactFlow
                    nodes={graph.nodes}
                    edges={graph.edges}
                    fitView
                    nodesDraggable={false}
                    nodesConnectable={false}
                    proOptions={{ hideAttribution: true }}
                  >
                    <Background gap={16} />
                    <Controls showInteractive={false} />
                  </ReactFlow>
                </div>
              </div>
            )}
          </>
        )}
      </DataState>
    </div>
  );
}
