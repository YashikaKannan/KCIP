/**
 * @file AccusedValidator.js
 * @description Accused Entity Validator
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export class AccusedValidator {
  /**
   * Input verification returning { isValid, errors }.
   * @param {Object} payload
   * @returns {{ isValid: boolean, errors: string[] }}
   */
  static validateAccused(payload) {
    const errors = [];
    if (!payload || !payload.name) errors.push('Field "name" is required.');
    if (!payload || !payload.firNumber) errors.push('Field "firNumber" is required.');
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
