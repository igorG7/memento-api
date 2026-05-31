import { AppError } from "./appErrors.js";
import DatabaseError from "./handleDataBaseError.js";
import IntegrationError from "./handleIntegrationError.js";

export class ResolveError {
  static resolve(error: Error) {
    throw ResolveError.classify(error);
  }

  static classify(error: Error): AppError {
    if (error instanceof AppError) return error;
    if (IntegrationError.isIntegrationError(error)) return IntegrationError.route(error);
    return DatabaseError.handle(error);
  }
}
