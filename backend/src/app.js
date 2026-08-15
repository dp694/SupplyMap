import cors from "cors";
import express from "express";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import suppliersRoutes from "./routes/suppliersRoutes.js";
import materialsRoutes from "./routes/materialsRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

app.use("/api/suppliers", suppliersRoutes);
app.use("/api/materials", materialsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/health", healthRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
