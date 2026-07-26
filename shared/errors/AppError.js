/**
 * @file AppError.js
 * @description Centralized Base Application Error Class
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export class AppError extends Error {
  constructor(message = 'An application error occurred', statusCode = 500, errorCode = 'APP_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}
