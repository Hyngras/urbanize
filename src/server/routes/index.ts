import { Router } from "express";
import { authRoutes } from "./authRoutes";
import { demandRoutes } from "./demandRoutes";
import { metricsRoutes } from "./metricsRoutes";

export const routes = Router();

routes.get("/health", (_req, res) => res.json({ success: true, data: { status: "ok" } }));
routes.use("/auth", authRoutes);
routes.use("/demands", demandRoutes);
routes.use("/metrics", metricsRoutes);
