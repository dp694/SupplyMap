import { getSession } from "../config/db.js";
import { nodeToObject } from "../utils/serialize.js";

// A simple cross-entity name search for the dashboard's search box.
export async function searchByName(query) {
  const session = getSession();
  try {
    const result = await session.executeRead((tx) =>
      tx.run(
        `MATCH (n)
         WHERE (n:Supplier OR n:Material OR n:Product) AND toLower(n.name) CONTAINS toLower($query)
         RETURN n, labels(n) AS labels
         ORDER BY n.name
         LIMIT 20`,
        { query }
      )
    );

    return result.records.map((r) => ({
      ...nodeToObject(r.get("n")),
      type: r.get("labels")[0],
    }));
  } finally {
    await session.close();
  }
}
