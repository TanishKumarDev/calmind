// ======================================================================
// Global Error Handler Middleware
//
// Purpose:
// Centralized handling of all application errors. Operational (expected)
// errors are returned to the client with clean messages. Unexpected or
// programming errors are logged and return a generic safe response.
//
// Usage:
// Add after all routes in index.ts:
//
//   app.use(errorHandler);
//
// Supports AppError for controlled/operational failures.
// ======================================================================

import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

// ----------------------------------------------------------------------
// Custom Application Error
// Allows throwing errors with specific HTTP status codes.
// ----------------------------------------------------------------------
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// ----------------------------------------------------------------------
// Error Handler Middleware
// Detects operational errors vs unexpected application errors.
// ----------------------------------------------------------------------
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Operational error (trusted error thrown intentionally)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Unexpected or unknown server errors
  logger.error("Unexpected error:", err);

  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};

// ======================================================================
// End of Error Handler
// ======================================================================
