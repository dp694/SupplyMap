import { getSession } from "../config/db.js";
import { nodeToObject } from "../utils/serialize.js";
import { AppError } from "../middleware/errorHandler.js";

export async function listMaterials() {
  const session = getSession();
  try {
    const result = await session.executeRead((tx) =>
      tx.run(`MATCH (m:Material) RETURN m ORDER BY m.name`)
    );
    return result.records.map((r) => nodeToObject(r.get("m")));
  } finally {
    await session.close();
  }
}

// All suppliers that currently provide this material - who could I call instead?
export async function getMaterialSuppliers(id) {
  const session = getSession();
  try {
    const materialResult = await session.executeRead((tx) =>
      tx.run(`MATCH (m:Material {id: $id}) RETURN m`, { id })
    );
    if (materialResult.records.length === 0) {
      throw new AppError(`Material ${id} not found`, 404);
    }

    const result = await session.executeRead((tx) =>
      tx.run(
        `MATCH (s:Supplier)-[:SUPPLIES]->(m:Material {id: $id})
         RETURN s ORDER BY s.name`,
        { id }
      )
    );

    return {
      material: nodeToObject(materialResult.records[0].get("m")),
      suppliers: result.records.map((r) => nodeToObject(r.get("s"))),
    };
  } finally {
    await session.close();
  }
}
