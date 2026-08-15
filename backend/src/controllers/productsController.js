import * as productsService from "../services/productsService.js";

export async function getProduct(req, res) {
  const product = await productsService.getProductById(req.params.id);
  res.json(product);
}
