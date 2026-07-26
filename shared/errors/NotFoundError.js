/**
 * @file NotFoundError.js
 * @description Resource Not Found Error Class
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { AppError } from './AppError.js';

export class NotFoundError extends AppError {
  constructor(message = 'Requested resource not found', errorCode = 'RESOURCE_NOT_FOUND') {
    super(message, 404, errorCode);
  }
}
