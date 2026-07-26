/**
 * @file NotificationValidator.js
 * @description Notification Payload Backend Validator
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { BaseValidator } from './BaseValidator.js';

export class NotificationValidator extends BaseValidator {
  static validate(payload) {
    const errors = this.validateRequired(payload, ['recipientId', 'title', 'message']);
    return this.formatResult(errors);
  }
}
