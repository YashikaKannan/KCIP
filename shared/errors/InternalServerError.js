/**
 * @file InternalServerError.js
 * @description Internal Server Error Class
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { AppError } from './AppError.js';

export class InternalServerError extends AppError {
  constructor(message = 'An unexpected error occurred', errorCode = 'INTERNAL_SERVER_ERROR') {
    super(message, 500, errorCode);
  }
}
