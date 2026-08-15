import * as materialsService from "../services/materialsService.js";

export async function listMaterials(req, res) {
  const materials = await materialsService.listMaterials();
  res.json(materials);
}

export async function getMaterialSuppliers(req, res) {
  const result = await materialsService.getMaterialSuppliers(req.params.id);
  res.json(result);
}
