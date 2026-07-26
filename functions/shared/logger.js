/**
 * @file logger.js
 * @description Structured console logger for Catalyst Serverless Functions — outputs JSON-compatible log lines
 * @module KCIP/Functions/Shared
 * @author KCIP Engineering Team — Phase 5 Catalyst Integration
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

const LOG_LEVELS = Object.freeze({ DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 });
const CURRENT_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL?.toUpperCase()] ?? LOG_LEVELS.INFO;

/**
 * @typedef {object} LogEntry
 * @property {string} level      - Log level
 * @property {string} service    - Originating function name
 * @property {string} message    - Log message
 * @property {*}      [data]     - Optional structured data
 * @property {string} timestamp  - ISO 8601 timestamp
 */

/**
 * Create a scoped logger for a specific Catalyst function.
 *
 * @param {string} functionName - Name of the Catalyst function (e.g. 'registerFIR')
 * @returns {{ debug, info, warn, error }} Logger object
 */
export function createLogger(functionName) {
  const _log = (level, message, data) => {
    if (LOG_LEVELS[level] < CURRENT_LEVEL) return;
    /** @type {LogEntry} */
    const entry = {
      level,
      service: functionName,
      message,
      ...(data !== undefined && { data }),
      timestamp: new Date().toISOString()
    };
    const out = level === 'ERROR' || level === 'WARN' ? console.error : console.log;
    out(JSON.stringify(entry));
  };

  return {
    debug: (msg, data) => _log('DEBUG', msg, data),
    info:  (msg, data) => _log('INFO',  msg, data),
    warn:  (msg, data) => _log('WARN',  msg, data),
    error: (msg, data) => _log('ERROR', msg, data)
  };
}
