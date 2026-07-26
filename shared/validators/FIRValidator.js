/**
 * @file FIRValidator.js
 * @description FIR Registration Form Validator
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export class FIRValidator {
  /**
   * Input verification returning { isValid, errors }.
   * @param {Object} payload
   * @returns {{ isValid: boolean, errors: string[] }}
   */
  static validateFIR(payload) {
    const errors = [];
    if (!payload || !payload.policeStation) errors.push('Field "policeStation" is required.');
    if (!payload || !payload.district) errors.push('Field "district" is required.');
    if (!payload || !payload.crimeType) errors.push('Field "crimeType" is required.');
    if (!payload || !payload.complainantName) errors.push('Field "complainantName" is required.');
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
