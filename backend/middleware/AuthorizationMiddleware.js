/**
 * @file AuthorizationMiddleware.js
 * @description Authorization Permission Checker Utility
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { ResponseUtil } from '../utils/response.js';

export class AuthorizationMiddleware {
  static authorize(user, requiredPermission) {
    if (!user) {
      return { isAuthorized: false, response: ResponseUtil.error('Authentication required', 'UNAUTHENTICATED', 401) };
    }
    if (requiredPermission && Array.isArray(user.permissions) && !user.permissions.includes(requiredPermission)) {
      return { isAuthorized: false, response: ResponseUtil.error('Access denied', 'FORBIDDEN', 403) };
    }
    return { isAuthorized: true, response: null };
  }
}
