/**
 * @file BaseValidator.js
 * @description Base Validator Class
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export class BaseValidator {
  static validateRequired(payload, fields = []) {
    const errors = [];
    fields.forEach(field => {
      if (!payload || payload[field] === undefined || payload[field] === null || String(payload[field]).trim() === '') {
        errors.push(`Field '${field}' is required.`);
      }
    });
    return errors;
  }

  static formatResult(errors = []) {
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
