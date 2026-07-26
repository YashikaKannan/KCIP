/**
 * @file ErrorMiddleware.js
 * @description Centralized Error Catching Utility
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { ResponseUtil } from '../utils/response.js';
import { LoggerUtil } from '../utils/logger.js';

export class ErrorMiddleware {
  static handleError(error) {
    LoggerUtil.error(`Unhandled Backend Error: ${error.message}`, { stack: error.stack });
    return ResponseUtil.error(error.message || 'An unexpected error occurred', 'INTERNAL_SERVER_ERROR', 500);
  }
}
