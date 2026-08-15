import { verifyConnectivity } from "../config/db.js";

export async function health(req, res) {
  try {
    await verifyConnectivity();
    res.json({ status: "ok", database: "connected" });
  } catch (err) {
    res.status(503).json({ status: "degraded", database: "unreachable" });
  }
}
