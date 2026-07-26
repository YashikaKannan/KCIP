/**
 * @file AuthorizationMiddleware.js
 * @description Authorization Permission & Role Checker Utility
 * @author KCIP Backend Engineering Team
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { ResponseUtil } from '../utils/response.js';
import { normalizeRole } from '../../shared/constants/Roles.js';

export class AuthorizationMiddleware {
  /**
   * Permission-based authorization.
   * @param {object} user
   * @param {string} requiredPermission
   * @returns {{ isAuthorized: boolean, response: object|null }}
   */
  static authorize(user, requiredPermission) {
    if (!user) {
      return {
        isAuthorized: false,
        response: ResponseUtil.error('Authentication required', 'UNAUTHENTICATED', 401)
      };
    }
    if (
      requiredPermission &&
      Array.isArray(user.permissions) &&
      !user.permissions.includes(requiredPermission)
    ) {
      return {
        isAuthorized: false,
        response: ResponseUtil.error('Access denied', 'FORBIDDEN', 403)
      };
    }
    return { isAuthorized: true, response: null };
  }

  /**
   * Role-based authorization.
   * @param {object} user
   * @param {string|string[]} allowedRoles
   * @returns {{ isAuthorized: boolean, response: object|null }}
   */
  static authorizeRoles(user, allowedRoles) {
    if (!user) {
      return {
        isAuthorized: false,
        response: ResponseUtil.error('Authentication required', 'UNAUTHENTICATED', 401)
      };
    }

    const allowed = (Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles])
      .map((r) => normalizeRole(r));
    const userRole = normalizeRole(user.role || user.role_name);

    if (!allowed.includes(userRole)) {
      return {
        isAuthorized: false,
        response: ResponseUtil.error('Insufficient role privileges', 'FORBIDDEN', 403)
      };
    }

    return { isAuthorized: true, response: null };
  }
}
