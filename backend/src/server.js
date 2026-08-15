import "dotenv/config";
import app from "./app.js";
import { verifyConnectivity } from "./config/db.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log(`SupplyMap API listening on http://localhost:${PORT}`);
  try {
    await verifyConnectivity();
    console.log("Connected to CognoDB.");
  } catch (err) {
    console.error("Could not reach CognoDB at startup - the API will keep running and report 503s until it recovers.");
  }
});
