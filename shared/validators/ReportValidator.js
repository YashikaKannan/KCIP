/**
 * @file ReportValidator.js
 * @description Report Request Validator
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export class ReportValidator {
  /**
   * Input verification returning { isValid, errors }.
   * @param {Object} payload
   * @returns {{ isValid: boolean, errors: string[] }}
   */
  static validateReportRequest(payload) {
    const errors = [];
    if (!payload || !payload.reportType) errors.push('Field "reportType" is required.');
    if (!payload || !payload.format) errors.push('Field "format" is required.');
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
