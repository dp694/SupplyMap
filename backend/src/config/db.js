import neo4j from "neo4j-driver";

const { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env;

if (!NEO4J_URI || !NEO4J_USERNAME || !NEO4J_PASSWORD) {
  console.error(
    "Missing CognoDB connection details. Set NEO4J_URI, NEO4J_USERNAME and NEO4J_PASSWORD (see .env.example)."
  );
}

// One driver instance for the whole app - the driver already pools connections internally,
// so services/controllers just borrow a session from this and close it when done.
const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD),
  {
    // Our property values are small (ids, counts, costs) so plain JS numbers are safe
    // and this avoids dealing with neo4j.Integer objects throughout the app.
    disableLosslessIntegers: true,
    // Fail fast instead of the driver's ~30s defaults, so an unreachable CognoDB
    // instance surfaces as a 503 quickly rather than hanging the request. Without
    // this, executeRead/executeWrite retry transient connection failures for up
    // to maxTransactionRetryTime before giving up.
    connectionTimeout: 5000,
    maxTransactionRetryTime: 5000,
  }
);

export async function verifyConnectivity() {
  await driver.verifyConnectivity();
}

export function getSession() {
  return driver.session();
}

export default driver;
