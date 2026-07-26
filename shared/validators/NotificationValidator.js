/**
 * @file NotificationValidator.js
 * @description Notification Message Validator
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export class NotificationValidator {
  /**
   * Input verification returning { isValid, errors }.
   * @param {Object} payload
   * @returns {{ isValid: boolean, errors: string[] }}
   */
  static validateNotification(payload) {
    const errors = [];
    if (!payload || !payload.recipientId) errors.push('Field "recipientId" is required.');
    if (!payload || !payload.title) errors.push('Field "title" is required.');
    if (!payload || !payload.message) errors.push('Field "message" is required.');
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
