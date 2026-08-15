// Creates constraints/indexes and loads a small, realistic dataset for a fictional
// bicycle manufacturer: SupplyMap.Suppliers -> Materials -> Products -> ProductCategories.
//
// Run with: npm run seed  (reads NEO4J_URI / NEO4J_USERNAME / NEO4J_PASSWORD from .env)
import "dotenv/config";
import driver, { getSession } from "../src/config/db.js";

const suppliers = [
  { id: "sup-001", name: "Ironclad Steel Co.", region: "Ohio, USA", contactEmail: "orders@ironcladsteel.example" },
  { id: "sup-002", name: "Alloy Dynamics", region: "Ontario, Canada", contactEmail: "sales@alloydynamics.example" },
  { id: "sup-003", name: "Continental Rubber Works", region: "Akron, USA", contactEmail: "supply@contirubber.example" },
  { id: "sup-004", name: "ChainTech Industries", region: "Taichung, Taiwan", contactEmail: "export@chaintech.example" },
  { id: "sup-005", name: "BrakeSure Components", region: "Guangdong, China", contactEmail: "sales@brakesure.example" },
  { id: "sup-006", name: "Summit Metals", region: "Pennsylvania, USA", contactEmail: "info@summitmetals.example" },
  { id: "sup-007", name: "EverGrip Rubber", region: "Taichung, Taiwan", contactEmail: "sales@evergrip.example" },
  { id: "sup-008", name: "Precision Gearworks", region: "Guangdong, China", contactEmail: "orders@precisiongear.example" },
  { id: "sup-009", name: "ComfortSeat Manufacturing", region: "Ontario, Canada", contactEmail: "sales@comfortseat.example" },
];

const materials = [
  { id: "mat-001", name: "Steel Tubing", unit: "meter" },
  { id: "mat-002", name: "Aluminum Rim", unit: "piece" },
  { id: "mat-003", name: "Bicycle Tire", unit: "piece" },
  { id: "mat-004", name: "Inner Tube", unit: "piece" },
  { id: "mat-005", name: "Chain", unit: "piece" },
  { id: "mat-006", name: "Gear Cassette", unit: "piece" },
  { id: "mat-007", name: "Brake Pad", unit: "pair" },
  { id: "mat-008", name: "Brake Cable", unit: "meter" },
  { id: "mat-009", name: "Saddle", unit: "piece" },
  { id: "mat-010", name: "Handlebar Grip", unit: "pair" },
  { id: "mat-011", name: "Steel Fork", unit: "piece" },
  { id: "mat-012", name: "Aluminum Frame", unit: "piece" },
];

const categories = [
  { id: "cat-001", name: "Mountain Bikes" },
  { id: "cat-002", name: "Commuter Bikes" },
  { id: "cat-003", name: "Cargo Bikes" },
  { id: "cat-004", name: "Kids Bikes" },
  { id: "cat-005", name: "Road Bikes" },
];

const products = [
  { id: "prod-001", name: "Trailblazer Mountain Bike", sku: "TB-MTB-001", categoryId: "cat-001" },
  { id: "prod-002", name: "Summit Pro Mountain Bike", sku: "SP-MTB-002", categoryId: "cat-001" },
  { id: "prod-003", name: "CityGlide Commuter Bike", sku: "CG-COM-003", categoryId: "cat-002" },
  { id: "prod-004", name: "UrbanLite Commuter Bike", sku: "UL-COM-004", categoryId: "cat-002" },
  { id: "prod-005", name: "CargoMax Delivery Bike", sku: "CM-CGO-005", categoryId: "cat-003" },
  { id: "prod-006", name: "KidsRider 16-inch", sku: "KR-KID-006", categoryId: "cat-004" },
  { id: "prod-007", name: "RoadRunner Speed Bike", sku: "RR-ROD-007", categoryId: "cat-005" },
];

// Which supplier supplies which material, and at what lead time / unit cost.
const supplies = [
  { supplierId: "sup-001", materialId: "mat-001", leadTimeDays: 14, unitCost: 8.5 },
  { supplierId: "sup-001", materialId: "mat-011", leadTimeDays: 18, unitCost: 22.0 },
  { supplierId: "sup-002", materialId: "mat-002", leadTimeDays: 10, unitCost: 15.75 },
  { supplierId: "sup-002", materialId: "mat-012", leadTimeDays: 21, unitCost: 64.0 },
  { supplierId: "sup-003", materialId: "mat-003", leadTimeDays: 12, unitCost: 18.2 },
  { supplierId: "sup-003", materialId: "mat-004", leadTimeDays: 7, unitCost: 3.4 },
  { supplierId: "sup-004", materialId: "mat-005", leadTimeDays: 20, unitCost: 6.1 },
  { supplierId: "sup-004", materialId: "mat-006", leadTimeDays: 20, unitCost: 12.9 },
  { supplierId: "sup-005", materialId: "mat-007", leadTimeDays: 9, unitCost: 4.25 },
  { supplierId: "sup-005", materialId: "mat-008", leadTimeDays: 9, unitCost: 1.6 },
  { supplierId: "sup-006", materialId: "mat-001", leadTimeDays: 11, unitCost: 9.1 },
  { supplierId: "sup-006", materialId: "mat-011", leadTimeDays: 16, unitCost: 23.5 },
  { supplierId: "sup-007", materialId: "mat-003", leadTimeDays: 15, unitCost: 17.1 },
  { supplierId: "sup-007", materialId: "mat-010", leadTimeDays: 8, unitCost: 2.3 },
  { supplierId: "sup-008", materialId: "mat-006", leadTimeDays: 18, unitCost: 13.4 },
  { supplierId: "sup-008", materialId: "mat-005", leadTimeDays: 19, unitCost: 6.4 },
  { supplierId: "sup-009", materialId: "mat-009", leadTimeDays: 13, unitCost: 11.0 },
  { supplierId: "sup-009", materialId: "mat-010", leadTimeDays: 8, unitCost: 2.1 },
];

// Which materials go into which products, and how many units per finished product.
const usedIn = [
  { materialId: "mat-012", productId: "prod-001", quantityPerUnit: 1 },
  { materialId: "mat-011", productId: "prod-001", quantityPerUnit: 1 },
  { materialId: "mat-003", productId: "prod-001", quantityPerUnit: 2 },
  { materialId: "mat-005", productId: "prod-001", quantityPerUnit: 1 },
  { materialId: "mat-007", productId: "prod-001", quantityPerUnit: 2 },
  { materialId: "mat-009", productId: "prod-001", quantityPerUnit: 1 },

  { materialId: "mat-012", productId: "prod-002", quantityPerUnit: 1 },
  { materialId: "mat-011", productId: "prod-002", quantityPerUnit: 1 },
  { materialId: "mat-003", productId: "prod-002", quantityPerUnit: 2 },
  { materialId: "mat-006", productId: "prod-002", quantityPerUnit: 1 },
  { materialId: "mat-007", productId: "prod-002", quantityPerUnit: 2 },
  { materialId: "mat-010", productId: "prod-002", quantityPerUnit: 1 },

  { materialId: "mat-001", productId: "prod-003", quantityPerUnit: 3 },
  { materialId: "mat-002", productId: "prod-003", quantityPerUnit: 2 },
  { materialId: "mat-003", productId: "prod-003", quantityPerUnit: 2 },
  { materialId: "mat-005", productId: "prod-003", quantityPerUnit: 1 },
  { materialId: "mat-008", productId: "prod-003", quantityPerUnit: 2 },
  { materialId: "mat-009", productId: "prod-003", quantityPerUnit: 1 },

  { materialId: "mat-012", productId: "prod-004", quantityPerUnit: 1 },
  { materialId: "mat-002", productId: "prod-004", quantityPerUnit: 2 },
  { materialId: "mat-004", productId: "prod-004", quantityPerUnit: 2 },
  { materialId: "mat-005", productId: "prod-004", quantityPerUnit: 1 },
  { materialId: "mat-008", productId: "prod-004", quantityPerUnit: 2 },
  { materialId: "mat-010", productId: "prod-004", quantityPerUnit: 1 },

  { materialId: "mat-001", productId: "prod-005", quantityPerUnit: 4 },
  { materialId: "mat-011", productId: "prod-005", quantityPerUnit: 1 },
  { materialId: "mat-002", productId: "prod-005", quantityPerUnit: 2 },
  { materialId: "mat-005", productId: "prod-005", quantityPerUnit: 1 },
  { materialId: "mat-006", productId: "prod-005", quantityPerUnit: 1 },
  { materialId: "mat-007", productId: "prod-005", quantityPerUnit: 2 },

  { materialId: "mat-001", productId: "prod-006", quantityPerUnit: 2 },
  { materialId: "mat-002", productId: "prod-006", quantityPerUnit: 2 },
  { materialId: "mat-004", productId: "prod-006", quantityPerUnit: 2 },
  { materialId: "mat-005", productId: "prod-006", quantityPerUnit: 1 },
  { materialId: "mat-010", productId: "prod-006", quantityPerUnit: 1 },

  { materialId: "mat-012", productId: "prod-007", quantityPerUnit: 1 },
  { materialId: "mat-002", productId: "prod-007", quantityPerUnit: 2 },
  { materialId: "mat-003", productId: "prod-007", quantityPerUnit: 2 },
  { materialId: "mat-006", productId: "prod-007", quantityPerUnit: 1 },
  { materialId: "mat-008", productId: "prod-007", quantityPerUnit: 2 },
  { materialId: "mat-009", productId: "prod-007", quantityPerUnit: 1 },
];

async function applyConstraints(session) {
  const statements = [
    "CREATE CONSTRAINT supplier_id IF NOT EXISTS FOR (s:Supplier) REQUIRE s.id IS UNIQUE",
    "CREATE CONSTRAINT material_id IF NOT EXISTS FOR (m:Material) REQUIRE m.id IS UNIQUE",
    "CREATE CONSTRAINT product_id IF NOT EXISTS FOR (p:Product) REQUIRE p.id IS UNIQUE",
    "CREATE CONSTRAINT category_id IF NOT EXISTS FOR (c:ProductCategory) REQUIRE c.id IS UNIQUE",
    "CREATE INDEX supplier_name IF NOT EXISTS FOR (s:Supplier) ON (s.name)",
    "CREATE INDEX material_name IF NOT EXISTS FOR (m:Material) ON (m.name)",
    "CREATE INDEX product_name IF NOT EXISTS FOR (p:Product) ON (p.name)",
  ];
  for (const statement of statements) {
    await session.executeWrite((tx) => tx.run(statement));
  }
}

async function clearExistingData(session) {
  await session.executeWrite((tx) =>
    tx.run(
      "MATCH (n) WHERE n:Supplier OR n:Material OR n:Product OR n:ProductCategory DETACH DELETE n"
    )
  );
}

async function loadNodes(session) {
  await session.executeWrite((tx) =>
    tx.run(
      "UNWIND $rows AS row CREATE (s:Supplier) SET s = row",
      { rows: suppliers }
    )
  );
  await session.executeWrite((tx) =>
    tx.run(
      "UNWIND $rows AS row CREATE (m:Material) SET m = row",
      { rows: materials }
    )
  );
  await session.executeWrite((tx) =>
    tx.run(
      "UNWIND $rows AS row CREATE (c:ProductCategory) SET c = row",
      { rows: categories }
    )
  );
  await session.executeWrite((tx) =>
    tx.run(
      `UNWIND $rows AS row
       CREATE (p:Product) SET p.id = row.id, p.name = row.name, p.sku = row.sku
       WITH p, row
       MATCH (c:ProductCategory {id: row.categoryId})
       CREATE (p)-[:BELONGS_TO]->(c)`,
      { rows: products }
    )
  );
}

async function loadRelationships(session) {
  await session.executeWrite((tx) =>
    tx.run(
      `UNWIND $rows AS row
       MATCH (s:Supplier {id: row.supplierId}), (m:Material {id: row.materialId})
       CREATE (s)-[:SUPPLIES {leadTimeDays: row.leadTimeDays, unitCost: row.unitCost}]->(m)`,
      { rows: supplies }
    )
  );
  await session.executeWrite((tx) =>
    tx.run(
      `UNWIND $rows AS row
       MATCH (m:Material {id: row.materialId}), (p:Product {id: row.productId})
       CREATE (m)-[:USED_IN {quantityPerUnit: row.quantityPerUnit}]->(p)`,
      { rows: usedIn }
    )
  );
}

async function seed() {
  const session = getSession();
  try {
    console.log("Applying constraints and indexes...");
    await applyConstraints(session);

    console.log("Clearing existing SupplyMap data...");
    await clearExistingData(session);

    console.log("Loading suppliers, materials, categories and products...");
    await loadNodes(session);

    console.log("Loading SUPPLIES and USED_IN relationships...");
    await loadRelationships(session);

    console.log(
      `Seed complete: ${suppliers.length} suppliers, ${materials.length} materials, ` +
        `${products.length} products, ${categories.length} categories.`
    );
  } finally {
    await session.close();
    await driver.close();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
