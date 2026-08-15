import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as productsController from "../controllers/productsController.js";

const router = Router();

router.get("/:id", asyncHandler(productsController.getProduct));

export default router;
