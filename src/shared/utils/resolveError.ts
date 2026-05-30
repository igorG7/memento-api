import { AppError } from "./appErrors.ts";
import DataBaseError from "./handleDataBaseError.ts";

export default class ResolveError {
  static resolve = (error: any) => {
    if (error instanceof AppError) {
      throw error;
    }
    throw DataBaseError.handle(error);
  };
}
