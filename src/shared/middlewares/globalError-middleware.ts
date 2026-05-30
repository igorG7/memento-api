import type { Request, Response, NextFunction } from "express";
import { isProduction } from "../../config/production-config.ts";

interface HttpError extends Error {
  statusCode: number;
  source?: string;
  details?: any;
}

export const launchError = (error: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (error && error.statusCode) {
    return res.status(error.statusCode).json({
      statusCode: error.statusCode,
      message: error.message,
      source: error.source ?? null,
      ...(!isProduction && { details: error.details ?? null }),
    });
  }

  return res.status(500).json({
    statusCode: 500,
    message: "Erro interno do servidor.",
    ...(!isProduction && { details: error?.message || null }),
  });
};
