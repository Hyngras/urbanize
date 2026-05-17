import { Router } from "express";
import { metricsController } from "../controllers/metricsController";
import { requireAuth } from "../middlewares/authMiddleware";

export const metricsRoutes = Router();

metricsRoutes.get("/summary", requireAuth, metricsController.summary);
