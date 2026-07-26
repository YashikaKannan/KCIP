/**
 * @file ReportValidator.js
 * @description Report Request Backend Validator
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { BaseValidator } from './BaseValidator.js';

export class ReportValidator extends BaseValidator {
  static validate(payload) {
    const errors = this.validateRequired(payload, ['reportType', 'format']);
    return this.formatResult(errors);
  }
}
