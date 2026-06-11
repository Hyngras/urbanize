import { Router, Request, Response } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadMiddleware";
import { visionService } from "../services/visionService";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/appError";
import { DemandCategory } from "../generated/prisma/client";

export const uploadRoutes = Router();

uploadRoutes.use(requireAuth);

uploadRoutes.post(
  "/image",
  upload.single("imagem"),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw new AppError("Nenhuma imagem enviada.", 400, "NO_FILE");

    const imageUrl = `/uploads/${req.file.filename}`;

    // Usa categoria enviada pelo frontend (TF.js) como fallback se Vision não estiver configurado
    const clientCategoria = req.body.categoria as DemandCategory | undefined;
    const triagem = await visionService.triarImagem(req.file.path, clientCategoria);

    res.json({ success: true, data: { imageUrl, triagem } });
  })
);
