/**
 * @file ConflictError.js
 * @description Resource Conflict Error Class
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { AppError } from './AppError.js';

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict occurred', errorCode = 'RESOURCE_CONFLICT') {
    super(message, 409, errorCode);
  }
}
