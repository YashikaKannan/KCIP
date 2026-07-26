/**
 * @file PredictionValidator.js
 * @description Prediction Input Validator
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export class PredictionValidator {
  /**
   * Input verification returning { isValid, errors }.
   * @param {Object} payload
   * @returns {{ isValid: boolean, errors: string[] }}
   */
  static validatePredictionInput(payload) {
    const errors = [];
    if (!payload || !payload.district) errors.push('Field "district" is required.');
    if (!payload || !payload.type) errors.push('Field "type" is required.');
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
