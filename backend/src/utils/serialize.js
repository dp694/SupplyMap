// Flattens a neo4j Node into a plain object: { id, ...properties }, dropping driver internals.
export function nodeToObject(node) {
  if (!node) return null;
  return { id: node.properties.id, ...node.properties };
}

export function relToObject(rel) {
  if (!rel) return null;
  return { ...rel.properties };
}
