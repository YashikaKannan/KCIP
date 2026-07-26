/**
 * @file LoginValidator.js
 * @description Login Request Validator
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export class LoginValidator {
  /**
   * Input verification returning { isValid, errors }.
   * @param {Object} payload
   * @returns {{ isValid: boolean, errors: string[] }}
   */
  static validateLogin(payload) {
    const errors = [];
    if (!payload || !payload.username) errors.push('Field "username" is required.');
    if (!payload || !payload.password) errors.push('Field "password" is required.');
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
