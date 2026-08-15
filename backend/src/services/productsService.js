import { getSession } from "../config/db.js";
import { nodeToObject } from "../utils/serialize.js";
import { AppError } from "../middleware/errorHandler.js";

export async function getProductById(id) {
  const session = getSession();
  try {
    const result = await session.executeRead((tx) =>
      tx.run(
        `MATCH (p:Product {id: $id})
         OPTIONAL MATCH (p)-[:BELONGS_TO]->(c:ProductCategory)
         OPTIONAL MATCH (m:Material)-[:USED_IN]->(p)
         OPTIONAL MATCH (sup:Supplier)-[:SUPPLIES]->(m)
         RETURN p, c, m, collect(DISTINCT sup) AS suppliers`,
        { id }
      )
    );

    if (result.records.length === 0 || !result.records[0].get("p")) {
      throw new AppError(`Product ${id} not found`, 404);
    }

    const product = nodeToObject(result.records[0].get("p"));
    const category = result.records[0].get("c")
      ? nodeToObject(result.records[0].get("c"))
      : null;

    const materials = result.records
      .filter((r) => r.get("m"))
      .map((r) => ({
        ...nodeToObject(r.get("m")),
        suppliers: r.get("suppliers").map(nodeToObject),
      }));

    return { ...product, category, materials };
  } finally {
    await session.close();
  }
}
