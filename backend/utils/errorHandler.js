/**
 * @file errorHandler.js
 * @description Backend Error Handling Utility
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { ResponseUtil } from './response.js';

export class ErrorHandlerUtil {
  static handle(error) {
    const statusCode = error.statusCode || 500;
    const errorCode = error.errorCode || 'INTERNAL_SERVER_ERROR';
    const message = error.message || 'An unexpected error occurred';
    return ResponseUtil.error(message, errorCode, statusCode, error.details || null);
  }
}
