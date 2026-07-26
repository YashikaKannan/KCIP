/**
 * @file Logger.js
 * @description Pure System Logger and Data Utility Helpers
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export class Logger {
  static generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  static deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    return JSON.parse(JSON.stringify(obj));
  }

  static safeParseJSON(jsonStr, fallback = {}) {
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      return fallback;
    }
  }

  static mergeObjects(target = {}, source = {}) {
    return { ...target, ...source };
  }

  static info(message, context = {}) {
    console.log(`[INFO] [${new Date().toISOString()}] ${message}`, context);
  }

  static warn(message, context = {}) {
    console.warn(`[WARN] [${new Date().toISOString()}] ${message}`, context);
  }

  static error(message, context = {}) {
    console.error(`[ERROR] [${new Date().toISOString()}] ${message}`, context);
  }

  static debug(message, context = {}) {
    console.debug(`[DEBUG] [${new Date().toISOString()}] ${message}`, context);
  }
}
