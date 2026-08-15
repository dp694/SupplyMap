import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as suppliersController from "../controllers/suppliersController.js";

const router = Router();

router.get("/", asyncHandler(suppliersController.listSuppliers));
router.get("/:id", asyncHandler(suppliersController.getSupplier));
router.get("/:id/dependencies", asyncHandler(suppliersController.getSupplierDependencies));
router.get("/:id/alternatives", asyncHandler(suppliersController.getSupplierAlternatives));

export default router;
