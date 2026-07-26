/**
 * @file serviceConfig.js
 * @description Backend Service Execution Configuration
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export const serviceConfig = Object.freeze({
  timeoutMs: 15000,
  maxRetryAttempts: 3,
  cacheTTLSeconds: 300,
  predictionConfidenceThreshold: 0.75
});
