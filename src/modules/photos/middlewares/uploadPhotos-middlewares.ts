import path from "path";
import multer from "multer";
import type { Request, Response, NextFunction } from "express";
import { BadRequest } from "../../../shared/utils/appErrors.ts";

// ─── Allowed Types ────────────────────────────────────────────────────────────

const ALLOWED_MIMETYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

// ─── Multer Config ────────────────────────────────────────────────────────────

const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
    files: 5,
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (!ALLOWED_MIMETYPES.includes(file.mimetype) || !ALLOWED_EXTENSIONS.includes(ext)) {
      return cb(
        new BadRequest(
          `Tipo de arquivo não permitido: ${file.mimetype}. Envie apenas imagens (jpeg, png, webp, gif).`,
        ),
      );
    }

    cb(null, true);
  },
});

// ─── Middleware ───────────────────────────────────────────────────────────────

export function uploadMiddleware(req: Request, res: Response, next: NextFunction): void {
  multerUpload.array("files", 5)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      switch (err.code) {
        case "LIMIT_FILE_SIZE":
          return next(new BadRequest("Arquivo muito grande. Tamanho máximo permitido: 50MB."));
        case "LIMIT_FILE_COUNT":
          return next(new BadRequest("Limite excedido. Envie no máximo 5 arquivos por vez."));
        case "LIMIT_UNEXPECTED_FILE":
          return next(new BadRequest('Campo de arquivo inválido. Use o campo "files".'));
        default:
          return next(new BadRequest(`Erro no upload: ${err.message}`));
      }
    }

    if (err) {
      return next(err);
    }

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return next(new BadRequest("Nenhum arquivo enviado."));
    }

    next();
  });
}
