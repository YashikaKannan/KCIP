/**
 * @file logger.js
 * @description Backend Logger Utility
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export class LoggerUtil {
  static info(message, meta = {}) {
    console.log(`[KCIP-INFO] [${new Date().toISOString()}] ${message}`, Object.keys(meta).length ? meta : '');
  }

  static warn(message, meta = {}) {
    console.warn(`[KCIP-WARN] [${new Date().toISOString()}] ${message}`, Object.keys(meta).length ? meta : '');
  }

  static error(message, meta = {}) {
    console.error(`[KCIP-ERROR] [${new Date().toISOString()}] ${message}`, Object.keys(meta).length ? meta : '');
  }

  static debug(message, meta = {}) {
    console.debug(`[KCIP-DEBUG] [${new Date().toISOString()}] ${message}`, Object.keys(meta).length ? meta : '');
  }
}
