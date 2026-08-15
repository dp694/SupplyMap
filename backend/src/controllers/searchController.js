import { AppError } from "../middleware/errorHandler.js";
import * as searchService from "../services/searchService.js";

export async function search(req, res) {
  const { q } = req.query;
  if (!q || !q.trim()) {
    throw new AppError("Query parameter 'q' is required", 400);
  }
  const results = await searchService.searchByName(q.trim());
  res.json(results);
}
