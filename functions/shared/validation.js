/**
 * @file validation.js
 * @description Request context extraction and input validation utilities for Catalyst Advanced I/O functions
 * @module KCIP/Functions/Shared
 * @author KCIP Engineering Team — Phase 5 Catalyst Integration
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

/**
 * @typedef {object} RequestContext
 * @property {object} body    - Parsed request body
 * @property {object} query   - Query parameters
 * @property {object} params  - Path parameters
 * @property {object} headers - Request headers
 * @property {string} method  - HTTP method
 */

/**
 * Extract a normalised request context from the Catalyst Advanced I/O request.
 *
 * @param {object} req - Catalyst request object
 * @returns {RequestContext}
 */
export function extractRequestContext(req) {
  return {
    body:    req?.body    ?? {},
    query:   req?.query   ?? {},
    params:  req?.params  ?? {},
    headers: req?.headers ?? {},
    method:  (req?.method ?? 'GET').toUpperCase()
  };
}

/**
 * Extract the merged payload from body (POST) or query (GET).
 *
 * @param {object} req - Catalyst request object
 * @returns {object}
 */
export function extractPayload(req) {
  return { ...(req?.query ?? {}), ...(req?.body ?? {}) };
}

/**
 * Validate that required string fields are non-empty.
 *
 * @param {object}   payload        - Input object
 * @param {string[]} requiredFields - Field names that must be present and non-empty
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateRequiredFields(payload, requiredFields) {
  const errors = requiredFields
    .filter(f => !payload[f] || String(payload[f]).trim() === '')
    .map(f => `Field '${f}' is required`);
  return { isValid: errors.length === 0, errors };
}

/**
 * Validate a single string field matches a regex pattern.
 *
 * @param {string} value   - Value to test
 * @param {RegExp} pattern - Regex pattern
 * @param {string} label   - Field label for error message
 * @returns {{ isValid: boolean, error: string|null }}
 */
export function validatePattern(value, pattern, label) {
  if (!pattern.test(value)) {
    return { isValid: false, error: `'${label}' has an invalid format` };
  }
  return { isValid: true, error: null };
}
