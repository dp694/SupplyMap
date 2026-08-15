import { getSession } from "../config/db.js";
import { nodeToObject } from "../utils/serialize.js";
import { AppError } from "../middleware/errorHandler.js";

export async function listSuppliers() {
  const session = getSession();
  try {
    const result = await session.executeRead((tx) =>
      tx.run(
        `MATCH (s:Supplier)
         OPTIONAL MATCH (s)-[:SUPPLIES]->(m:Material)
         RETURN s, count(DISTINCT m) AS materialCount
         ORDER BY s.name`
      )
    );
    return result.records.map((r) => ({
      ...nodeToObject(r.get("s")),
      materialCount: r.get("materialCount"),
    }));
  } finally {
    await session.close();
  }
}

export async function getSupplierById(id) {
  const session = getSession();
  try {
    const result = await session.executeRead((tx) =>
      tx.run(
        `MATCH (s:Supplier {id: $id})
         OPTIONAL MATCH (s)-[:SUPPLIES]->(m:Material)
         RETURN s, collect(m) AS materials`
      , { id })
    );
    if (result.records.length === 0) {
      throw new AppError(`Supplier ${id} not found`, 404);
    }
    const record = result.records[0];
    return {
      ...nodeToObject(record.get("s")),
      materials: record.get("materials").map(nodeToObject),
    };
  } finally {
    await session.close();
  }
}

// Supplier -> Material -> Product: everything that goes offline if this supplier stops shipping.
export async function getSupplierDependencies(id) {
  const session = getSession();
  try {
    const supplierResult = await session.executeRead((tx) =>
      tx.run(`MATCH (s:Supplier {id: $id}) RETURN s`, { id })
    );
    if (supplierResult.records.length === 0) {
      throw new AppError(`Supplier ${id} not found`, 404);
    }

    const result = await session.executeRead((tx) =>
      tx.run(
        `MATCH (s:Supplier {id: $id})-[:SUPPLIES]->(m:Material)
         OPTIONAL MATCH (m)-[:USED_IN]->(p:Product)
         RETURN m, collect(DISTINCT p) AS products
         ORDER BY m.name`,
        { id }
      )
    );

    const materials = result.records.map((r) => ({
      ...nodeToObject(r.get("m")),
      products: r.get("products").filter(Boolean).map(nodeToObject),
    }));

    const affectedProductIds = new Set();
    materials.forEach((m) => m.products.forEach((p) => affectedProductIds.add(p.id)));

    return {
      supplier: nodeToObject(supplierResult.records[0].get("s")),
      materials,
      affectedProductCount: affectedProductIds.size,
    };
  } finally {
    await session.close();
  }
}

// Other suppliers that can cover the materials this supplier provides.
export async function getSupplierAlternatives(id) {
  const session = getSession();
  try {
    const supplierResult = await session.executeRead((tx) =>
      tx.run(`MATCH (s:Supplier {id: $id}) RETURN s`, { id })
    );
    if (supplierResult.records.length === 0) {
      throw new AppError(`Supplier ${id} not found`, 404);
    }

    const result = await session.executeRead((tx) =>
      tx.run(
        `MATCH (s:Supplier {id: $id})-[:SUPPLIES]->(m:Material)<-[:SUPPLIES]-(alt:Supplier)
         WHERE alt.id <> $id
         RETURN alt, collect(DISTINCT m) AS sharedMaterials
         ORDER BY alt.name`,
        { id }
      )
    );

    return {
      supplier: nodeToObject(supplierResult.records[0].get("s")),
      alternatives: result.records.map((r) => ({
        ...nodeToObject(r.get("alt")),
        sharedMaterials: r.get("sharedMaterials").map(nodeToObject),
      })),
    };
  } finally {
    await session.close();
  }
}
