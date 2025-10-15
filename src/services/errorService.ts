import { ErrorDTO } from "../models/dto/ErrorDTO";
import { AppError } from "../models/errors/AppError";
import { logError } from "../services/loggingService";

export function createAppError(err: any): ErrorDTO {
  let modelError: ErrorDTO = createErrorDTO(
    500,
    err?.message || "Internal Server Error",
    "InternalServerError"
  );

  logError(err);
  logError(
    `Error: ${err?.message}\nStacktrace:\n${err?.stack || "No stacktrace available"}`
  );

  if (
    err instanceof AppError ||
    (err.status && typeof err.status === "number")
  ) {
    modelError = createErrorDTO(err.status, err.message, err.name);
  }

  return modelError;
}


export function createErrorDTO(
  code: number,
  message?: string,
  name?: string
): ErrorDTO {
  return {
    code,
    name,
    message,
   } as ErrorDTO;
}

