/**
 * @file loggerConfig.js
 * @description Backend Logger Configuration
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export const loggerConfig = Object.freeze({
  level: process.env.LOG_LEVEL || 'info',
  enableConsole: true,
  enableAuditTrail: true
});
