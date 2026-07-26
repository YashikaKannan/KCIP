/**
 * @file AccusedValidator.js
 * @description Accused Record Backend Validator
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { BaseValidator } from './BaseValidator.js';

export class AccusedValidator extends BaseValidator {
  static validate(payload) {
    const errors = this.validateRequired(payload, ['name', 'firNumber']);
    return this.formatResult(errors);
  }
}
