/**
 * @file PredictionValidator.js
 * @description AI Crime Prediction Input Validator
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { BaseValidator } from './BaseValidator.js';

export class PredictionValidator extends BaseValidator {
  static validate(payload) {
    const errors = this.validateRequired(payload, ['district', 'type']);
    return this.formatResult(errors);
  }
}
