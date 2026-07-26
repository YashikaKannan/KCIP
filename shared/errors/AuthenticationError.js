/**
 * @file AuthenticationError.js
 * @description Authentication Failure Error Class
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { AppError } from './AppError.js';

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required', errorCode = 'AUTHENTICATION_FAILED') {
    super(message, 401, errorCode);
  }
}
