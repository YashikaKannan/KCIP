/**
 * @file LoggingMiddleware.js
 * @description Operation Logging Wrapper Utility
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { LoggerUtil } from '../utils/logger.js';

export class LoggingMiddleware {
  static async logOperation(operationName, handlerFn) {
    const startTime = Date.now();
    LoggerUtil.info(`START Operation: [${operationName}]`);
    try {
      const result = await handlerFn();
      const duration = Date.now() - startTime;
      LoggerUtil.info(`SUCCESS Operation: [${operationName}] in ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      LoggerUtil.error(`FAILED Operation: [${operationName}] in ${duration}ms - ${error.message}`);
      throw error;
    }
  }
}
