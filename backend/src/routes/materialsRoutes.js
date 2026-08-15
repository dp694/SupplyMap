import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as materialsController from "../controllers/materialsController.js";

const router = Router();

router.get("/", asyncHandler(materialsController.listMaterials));
router.get("/:id/suppliers", asyncHandler(materialsController.getMaterialSuppliers));

export default router;
