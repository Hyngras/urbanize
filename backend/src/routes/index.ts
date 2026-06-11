import { Router } from "express";
import { authRoutes } from "./authRoutes";
import { demandRoutes } from "./demandRoutes";
import { metricsRoutes } from "./metricsRoutes";
import { uploadRoutes } from "./uploadRoutes";
import { organRoutes } from "./organRoutes";

export const routes = Router();

routes.get("/health", (_req, res) => res.json({ success: true, data: { status: "ok" } }));
routes.use("/auth", authRoutes);
routes.use("/demands", demandRoutes);
routes.use("/metrics", metricsRoutes);
routes.use("/upload", uploadRoutes);
routes.use("/organs", organRoutes);
