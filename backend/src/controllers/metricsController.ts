import { Request, Response } from "express";
import { metricsService } from "../services/metricsService";
import { AppError } from "../utils/appError";
import { asyncHandler } from "../utils/asyncHandler";

export const metricsController = {
  summary: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Sessão não autenticada.", 401, "UNAUTHENTICATED");
    const data = await metricsService.summary(req.user);
    res.json({ success: true, data });
  }),
};
