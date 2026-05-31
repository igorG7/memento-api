import rateLimit from "express-rate-limit";

export const uploadRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 15, // máximo 30 requisições por janela
  message: { message: "Muitas requisições de upload. Tente novamente em 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});
