/**
 * @file ArrestValidator.js
 * @description Arrest Record Backend Validator
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { BaseValidator } from './BaseValidator.js';

export class ArrestValidator extends BaseValidator {
  static validate(payload) {
    const errors = this.validateRequired(payload, ['accusedId', 'firNumber', 'arrestingOfficer']);
    return this.formatResult(errors);
  }
}
