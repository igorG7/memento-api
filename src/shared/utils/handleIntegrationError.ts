import { AppError } from "./appErrors.ts";

/**
 * Handler base para erros de integrações externas (UAU, Meta, Cloudinary, etc.).
 * Trata erros comuns de rede/timeout. Subclasses tratam erros específicos de cada provider.
 */
export default class IntegrationError {
  /**
   * Identifica o provider de origem do erro.
   * Retorna o nome do provider ou null se não for erro de integração.
   */
  private static identifyProvider(error: any): string | null {
    const baseURL = String(error?.config?.baseURL || "");
    const message = String(error?.message || "");

    // Verifica por baseURL (erros axios)
    switch (true) {
      case baseURL.includes("uauAPI"):
        return "UAU";
      case baseURL.includes("graph.facebook"):
        return "META";
      case baseURL.includes("cloudinary"):
        return "CLOUDINARY";
    }

    // Verifica por mensagem (erros não-axios)
    switch (true) {
      case message.includes("UAU"):
        return "UAU";
      case message.includes("not yet configured"):
        return "UAU";
    }

    // Erro genérico de axios sem provider identificado
    if (error?.isAxiosError || error?.config?.baseURL) return "UNKNOWN";

    return null;
  }

  /**
   * Verifica se o erro é de uma integração externa.
   */
  static isIntegrationError(error: any): boolean {
    return IntegrationError.identifyProvider(error) !== null;
  }

  /**
   * Roteia o erro para o handler correto com base na origem.
   */
  static route(error: any): AppError {
    const provider = IntegrationError.identifyProvider(error);

    switch (provider) {
      case "UAU": {
        const { default: UauError } = require("./integrations/uauError");
        return UauError.handle(error);
      }
      case "META": {
        const { default: MetaError } = require("./integrations/metaError");
        return MetaError.handle(error);
      }
      case "CLOUDINARY": {
        const { default: CloudinaryError } = require("./integrations/cloudinaryError");
        return CloudinaryError.handle(error);
      }
      default:
        return IntegrationError.handle(error, provider || "Integração");
    }
  }

  /**
   * Trata erros comuns de integração (rede, timeout, genérico).
   */
  static handle(error: any, provider: string): AppError {
    const code = error?.code || "";

    switch (code) {
      case "ECONNREFUSED":
        return new AppError(`${provider}: serviço indisponível.`, 503);

      case "ECONNABORTED":
      case "ETIMEDOUT":
        return new AppError(`${provider}: timeout na requisição.`, 504);

      case "ENOTFOUND":
        return new AppError(`${provider}: host não encontrado.`, 503);
    }

    // HTTP error com response
    if (error?.response?.status) {
      const status = error.response.status;
      const msg = error.response?.data?.message || error.message || "Erro na integração.";
      return new AppError(`${provider}: ${msg}`, status >= 500 ? 502 : status);
    }

    // Fallback
    return new AppError(`${provider}: erro inesperado — ${error?.message || "sem detalhes"}.`, 502);
  }
}
