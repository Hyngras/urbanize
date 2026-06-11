import { Router, Request, Response } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { organService } from "../services/organService";
import { asyncHandler } from "../utils/asyncHandler";

export const organRoutes = Router();

organRoutes.use(requireAuth);

organRoutes.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    const data = await organService.list();
    res.json({ success: true, data });
  })
);
