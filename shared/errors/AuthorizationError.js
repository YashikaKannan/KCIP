/**
 * @file AuthorizationError.js
 * @description Authorization Access Denied Error Class
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { AppError } from './AppError.js';

export class AuthorizationError extends AppError {
  constructor(message = 'Permission denied', errorCode = 'ACCESS_DENIED') {
    super(message, 403, errorCode);
  }
}
