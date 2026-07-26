/**
 * @file FIRValidator.js
 * @description FIR Form Registration Backend Validator
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { BaseValidator } from './BaseValidator.js';

export class FIRValidator extends BaseValidator {
  static validate(payload) {
    const errors = this.validateRequired(payload, ['policeStation', 'district', 'crimeType', 'complainantName']);
    return this.formatResult(errors);
  }
}
