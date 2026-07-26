/**
 * @file errorHandler.js
 * @description Centralised error handler for all Catalyst Serverless Functions — maps error types to standard HTTP responses
 * @module KCIP/Functions/Shared
 * @author KCIP Engineering Team — Phase 5 Catalyst Integration
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { sendBadRequest, sendUnauthorised, sendForbidden, sendNotFound, sendInternalError } from './response.js';

const ERROR_CODE_MAP = Object.freeze({
  VALIDATION_ERROR:    400,
  BAD_REQUEST:         400,
  AUTHENTICATION_ERROR:401,
  UNAUTHORIZED:        401,
  AUTHORIZATION_ERROR: 403,
  FORBIDDEN:           403,
  NOT_FOUND:           404,
  CONFLICT:            409,
  INTERNAL:            500
});

/**
 * Handle an error thrown anywhere inside a Catalyst function execution.
 * Resolves the correct HTTP status code and sends a standardised error response.
 *
 * @param {object}    res          - Catalyst response object
 * @param {Error}     error        - Caught error
 * @param {object}    logger       - Scoped logger from createLogger()
 * @param {string}    functionName - Name of the function for context
 * @returns {object} Error response body
 */
export function handleError(res, error, logger, functionName) {
  logger.error(`Unhandled error in ${functionName}`, {
    name:    error.name,
    message: error.message,
    code:    error.code ?? error.errorCode
  });

  const code    = error.code ?? error.errorCode ?? 'INTERNAL';
  const status  = ERROR_CODE_MAP[code] ?? 500;
  const message = error.message ?? 'An unexpected error occurred';

  switch (status) {
    case 400: return sendBadRequest(res, message, error.errors ?? []);
    case 401: return sendUnauthorised(res, message);
    case 403: return sendForbidden(res, message);
    case 404: return sendNotFound(res, message);
    default:  return sendInternalError(res, message, code);
  }
}
