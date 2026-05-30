export class AppError extends Error {
  statusCode: number;
  details: any;

  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.statusCode = statusCode as number;
    this.name = this.constructor.name;
    this.details = details;
  }
}

export class NotFound extends AppError {
  constructor(message: string, statusCode = 404) {
    super(message, statusCode);
  }
}

export class BadRequest extends AppError {
  constructor(message: string, statusCode = 400) {
    super(message, statusCode);
  }
}

export class Unauthorized extends AppError {
  constructor(message: string, statusCode = 401) {
    super(message, statusCode);
  }
}

export class Forbidden extends AppError {
  constructor(message: string, statusCode = 403) {
    super(message, statusCode);
  }
}

export class Conflict extends AppError {
  constructor(message: string, statusCode = 409) {
    super(message, statusCode);
  }
}

export class DatabaseException extends AppError {
  constructor(message: string, statusCode: number, details?: unknown) {
    super(message, statusCode, details);
  }
}
export class UnprocessableEntity extends AppError {
  constructor(message: string, statusCode = 422) {
    super(message, statusCode);
  }
}
