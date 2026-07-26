/**
 * @file ChargesheetValidator.js
 * @description Chargesheet Legal Document Backend Validator
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { BaseValidator } from './BaseValidator.js';

export class ChargesheetValidator extends BaseValidator {
  static validate(payload) {
    const errors = this.validateRequired(payload, ['firNumber', 'courtName']);
    return this.formatResult(errors);
  }
}
