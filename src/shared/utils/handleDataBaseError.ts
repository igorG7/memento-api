import { DatabaseException } from "./appErrors.ts";

export default class DataBaseError {
  static handle = (error: any): DatabaseException => {
    switch (error.name) {
      case "CastError":
        return new DatabaseException(`Valor inválido para o campo "${error.path}"`, 400, error);

      case "ValidationError":
        const path = Object.keys(error.errors)[0];
        return new DatabaseException(`Erro de validação no campo "${path}".`, 400, error.errors);

      case "MongoServerError":
        if (error.code === 11000) {
          return new DatabaseException(
            `Erro de chave duplicada "${Object.keys(error.keyValue)[0]}"`,
            409,
            error,
          );
        }
        return new DatabaseException("Erro no banco de dados.", 500, error);

      default:
        return new DatabaseException("Erro interno do servidor", 500, error);
    }
  };
}
