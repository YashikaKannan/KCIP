/**
 * @file ValidationMiddleware.js
 * @description Payload Validation Middleware Utility
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { ResponseUtil } from '../utils/response.js';

export class ValidationMiddleware {
  static validate(validatorClass, payload) {
    if (!validatorClass || typeof validatorClass.validate !== 'function') {
      return { isValid: true, response: null };
    }
    const result = validatorClass.validate(payload);
    if (!result.isValid) {
      return {
        isValid: false,
        response: ResponseUtil.error('Validation failed', 'VALIDATION_FAILED', 400, result.errors)
      };
    }
    return { isValid: true, response: null };
  }
}
