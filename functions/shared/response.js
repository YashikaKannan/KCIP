/**
 * @file response.js
 * @description Standardised HTTP response helpers for all Catalyst Advanced I/O functions
 * @module KCIP/Functions/Shared
 * @author KCIP Engineering Team — Phase 5 Catalyst Integration
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

/**
 * Sends a 200 OK success response.
 *
 * @param {object} res        - Catalyst response object
 * @param {*}      data       - Payload data
 * @param {string} [message]  - Human-readable message
 * @param {object} [meta]     - Optional pagination / metadata
 */
export function sendSuccess(res, data, message = 'Success', meta = null) {
  const body = {
    success:   true,
    statusCode: 200,
    message,
    data,
    ...(meta && { meta }),
    timestamp: new Date().toISOString()
  };
  _send(res, 200, body);
  return body;
}

/**
 * Sends a 201 Created response.
 *
 * @param {object} res       - Catalyst response object
 * @param {*}      data      - Created resource
 * @param {string} [message] - Human-readable message
 */
export function sendCreated(res, data, message = 'Resource created successfully') {
  const body = {
    success:    true,
    statusCode: 201,
    message,
    data,
    timestamp: new Date().toISOString()
  };
  _send(res, 201, body);
  return body;
}

/**
 * Sends a 400 Bad Request error response.
 *
 * @param {object}   res       - Catalyst response object
 * @param {string}   message   - Error message
 * @param {string[]} [errors]  - Validation error list
 */
export function sendBadRequest(res, message = 'Bad Request', errors = []) {
  const body = {
    success:    false,
    statusCode: 400,
    errorCode:  'BAD_REQUEST',
    message,
    ...(errors.length && { errors }),
    timestamp: new Date().toISOString()
  };
  _send(res, 400, body);
  return body;
}

/**
 * Sends a 401 Unauthorised response.
 *
 * @param {object} res     - Catalyst response object
 * @param {string} message - Error message
 */
export function sendUnauthorised(res, message = 'Unauthorised') {
  const body = {
    success:    false,
    statusCode: 401,
    errorCode:  'UNAUTHORISED',
    message,
    timestamp: new Date().toISOString()
  };
  _send(res, 401, body);
  return body;
}

/**
 * Sends a 403 Forbidden response.
 *
 * @param {object} res     - Catalyst response object
 * @param {string} message - Error message
 */
export function sendForbidden(res, message = 'Forbidden') {
  const body = {
    success:    false,
    statusCode: 403,
    errorCode:  'FORBIDDEN',
    message,
    timestamp: new Date().toISOString()
  };
  _send(res, 403, body);
  return body;
}

/**
 * Sends a 404 Not Found response.
 *
 * @param {object} res      - Catalyst response object
 * @param {string} resource - Resource name
 */
export function sendNotFound(res, resource = 'Resource') {
  const body = {
    success:    false,
    statusCode: 404,
    errorCode:  'NOT_FOUND',
    message:    `${resource} not found`,
    timestamp: new Date().toISOString()
  };
  _send(res, 404, body);
  return body;
}

/**
 * Sends a 500 Internal Server Error response.
 *
 * @param {object} res     - Catalyst response object
 * @param {string} message - Error message
 * @param {string} [code]  - Internal error code
 */
export function sendInternalError(res, message = 'Internal server error', code = 'INTERNAL_SERVER_ERROR') {
  const body = {
    success:    false,
    statusCode: 500,
    errorCode:  code,
    message,
    timestamp: new Date().toISOString()
  };
  _send(res, 500, body);
  return body;
}

// ── internal helper ──────────────────────────────────────────────────────────
function _send(res, statusCode, body) {
  if (res && typeof res.writeHead === 'function') {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
  }
}
