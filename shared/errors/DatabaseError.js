/**
 * @file DatabaseError.js
 * @description Database Access Error Class
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { AppError } from './AppError.js';

export class DatabaseError extends AppError {
  constructor(message = 'Database operation failed', errorCode = 'DATABASE_ERROR') {
    super(message, 500, errorCode);
  }
}
