/**
 * @file audit.js
 * @description Backend Audit Trail Utility
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { LoggerUtil } from './logger.js';

export class AuditUtil {
  static logAction(userId, action, resource, details = {}) {
    LoggerUtil.info(`AUDIT: User [${userId}] executed [${action}] on [${resource}]`, details);
  }
}
