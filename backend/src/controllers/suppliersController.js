import * as suppliersService from "../services/suppliersService.js";

export async function listSuppliers(req, res) {
  const suppliers = await suppliersService.listSuppliers();
  res.json(suppliers);
}

export async function getSupplier(req, res) {
  const supplier = await suppliersService.getSupplierById(req.params.id);
  res.json(supplier);
}

export async function getSupplierDependencies(req, res) {
  const dependencies = await suppliersService.getSupplierDependencies(req.params.id);
  res.json(dependencies);
}

export async function getSupplierAlternatives(req, res) {
  const alternatives = await suppliersService.getSupplierAlternatives(req.params.id);
  res.json(alternatives);
}
