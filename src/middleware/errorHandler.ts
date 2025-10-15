import { ErrorDTO, ErrorDTOToJSON } from "../models/dto/ErrorDTO";
import { createAppError } from "../services/errorService";
import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let modelError: ErrorDTO = createAppError(err);
  console.error("Error caught by middleware:", err);

  res.status(modelError.code).json(ErrorDTOToJSON(modelError));
}
