/**
 * @file index.js
 * @description Barrel export for all Catalyst Function shared utilities
 * @module KCIP/Functions/Shared
 * @author KCIP Engineering Team — Phase 5 Catalyst Integration
 * @version 2.1.0
 * @lastUpdated 2026-07-26
 */

export { initCatalyst }          from './catalyst.js';
export {
  sendSuccess,
  sendCreated,
  sendBadRequest,
  sendUnauthorised,
  sendForbidden,
  sendNotFound,
  sendInternalError
}                                from './response.js';
export { createLogger }          from './logger.js';
export {
  extractRequestContext,
  extractPayload,
  validateRequiredFields,
  validatePattern
}                                from './validation.js';
export { handleError }           from './errorHandler.js';
export { collectArguments, writeJson, createBasicIOHandler } from './basicIOHelper.js';
export { composeBackend }        from './compose.js';
