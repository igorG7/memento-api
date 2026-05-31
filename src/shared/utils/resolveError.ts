import { AppError } from "./appErrors.ts";
import DatabaseError from "./handleDataBaseError.ts";
import IntegrationError from "./handleIntegrationError.ts";

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
