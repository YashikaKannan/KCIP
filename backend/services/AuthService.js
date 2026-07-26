/**
 * @file AuthService.js
 * @description Authentication Service — Catalyst Authentication + RBAC
 * @author KCIP Backend Engineering Team
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { BaseService } from './BaseService.js';
import { CatalystAuthService } from './catalyst/CatalystAuthService.js';
import { Roles, RolePermissions, RoleLabels, normalizeRole } from '../../shared/constants/Roles.js';
import { LoggerUtil } from '../utils/logger.js';

export class AuthService extends BaseService {
  /**
   * @param {object|null} repository - Optional user/profile repository
   * @param {object|null} [catalystApp]
   */
  constructor(repository = null, catalystApp = null) {
    super(repository);
    this.catalystApp = catalystApp;
    this.catalystAuth = new CatalystAuthService(catalystApp);
    /** @type {Map<string, object>} In-memory session mirror for the current function instance */
    this._sessions = new Map();
  }

  setCatalystApp(catalystApp) {
    super.setCatalystApp(catalystApp);
    this.catalystApp = catalystApp;
    this.catalystAuth = new CatalystAuthService(catalystApp);
  }

  /**
   * Build a normalized KCIP user profile from Catalyst / login input.
   * @param {object} raw
   * @returns {object}
   */
  _buildUserProfile(raw = {}) {
    const role = normalizeRole(
      raw.role || raw.role_name || raw.roleName || Roles.FIELD_OFFICER
    );
    const permissions = RolePermissions[role] || RolePermissions[Roles.FIELD_OFFICER];

    return {
      userId: raw.user_id || raw.userId || raw.zuid || raw.id || null,
      email: raw.email || raw.email_id || null,
      username: raw.username || raw.email || raw.user_name || null,
      firstName: raw.first_name || raw.firstName || null,
      lastName: raw.last_name || raw.lastName || null,
      role,
      roleLabel: RoleLabels[role] || role,
      permissions: [...permissions],
      district: raw.district || raw.org_id || null,
      policeStation: raw.policeStation || raw.station || null
    };
  }

  /**
   * Login — accepts (username, password) or ({ username, password, role }).
   * Uses Catalyst Auth when available; otherwise issues a controlled session for local/dev.
   * @param {string|object} usernameOrPayload
   * @param {string} [password]
   * @returns {Promise<object>}
   */
  async login(usernameOrPayload, password) {
    const payload =
      typeof usernameOrPayload === 'object' && usernameOrPayload !== null
        ? usernameOrPayload
        : { username: usernameOrPayload, password };

    const username = payload.username || payload.email;
    const pwd = payload.password;

    if (!username || !pwd) {
      throw new Error('Username and password are required.');
    }

    let catalystUser = null;

    try {
      if (this.catalystApp && typeof this.catalystApp.auth === 'function') {
        const auth = this.catalystApp.auth();

        // Catalyst Native Auth / Custom Auth sign-in when SDK exposes it
        if (typeof auth.signin === 'function') {
          catalystUser = await auth.signin(username, pwd);
        } else if (typeof auth.signIn === 'function') {
          catalystUser = await auth.signIn(username, pwd);
        } else if (typeof auth.getCurrentUser === 'function') {
          // Cookie/session already established by Catalyst Hosted Login
          catalystUser = await auth.getCurrentUser();
        }
      }
    } catch (error) {
      LoggerUtil.warn('[AuthService] Catalyst sign-in failed', { error: error.message });
      const err = new Error('Authentication failed.');
      err.statusCode = 401;
      throw err;
    }

    const user = this._buildUserProfile({
      ...(catalystUser || {}),
      username,
      email: catalystUser?.email || username,
      role: payload.role || catalystUser?.role_name || catalystUser?.role || Roles.INVESTIGATION_OFFICER
    });

    const token =
      catalystUser?.token ||
      catalystUser?.access_token ||
      `kcip-session-${user.userId || username}-${Date.now()}`;

    const session = {
      token,
      user,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    };

    this._sessions.set(token, session);
    LoggerUtil.info('[AuthService] Login success', {
      username: user.username,
      role: user.role
    });

    return {
      token,
      user,
      session: {
        issuedAt: session.issuedAt,
        expiresAt: session.expiresAt
      }
    };
  }

  /**
   * Logout current session / Catalyst user.
   * @param {string} [token]
   * @returns {Promise<object>}
   */
  async logout(token) {
    try {
      if (this.catalystApp && typeof this.catalystApp.auth === 'function') {
        const auth = this.catalystApp.auth();
        if (typeof auth.signout === 'function') {
          await auth.signout();
        } else if (typeof auth.signOut === 'function') {
          await auth.signOut();
        }
      }
    } catch (error) {
      LoggerUtil.warn('[AuthService] Catalyst sign-out warning', { error: error.message });
    }

    if (token) this._sessions.delete(token);
    return { success: true, message: 'Logged out successfully.' };
  }

  /**
   * Resolve the current authenticated user from Catalyst or session token.
   * @param {object} [options]
   * @param {string} [options.token]
   * @param {object} [options.req]
   * @returns {Promise<object>}
   */
  async getCurrentUser(options = {}) {
    const { token, req } = options;

    if (token && this._sessions.has(token)) {
      const session = this._sessions.get(token);
      if (new Date(session.expiresAt).getTime() < Date.now()) {
        this._sessions.delete(token);
        const err = new Error('Session expired.');
        err.statusCode = 401;
        throw err;
      }
      return session.user;
    }

    try {
      const raw = await this.catalystAuth.getCurrentUser(req);
      if (raw) return this._buildUserProfile(raw);
    } catch (error) {
      LoggerUtil.warn('[AuthService] getCurrentUser failed', { error: error.message });
    }

    const err = new Error('Not authenticated.');
    err.statusCode = 401;
    throw err;
  }

  /**
   * Role-based access check.
   * @param {object} user
   * @param {string|string[]} allowedRoles
   * @returns {boolean}
   */
  hasRole(user, allowedRoles) {
    if (!user?.role) return false;
    const allowed = (Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles])
      .map((r) => normalizeRole(r));
    return allowed.includes(normalizeRole(user.role));
  }

  /**
   * Permission-based access check.
   * @param {object} user
   * @param {string} permission
   * @returns {boolean}
   */
  hasPermission(user, permission) {
    if (!user) return false;
    if (!permission) return true;
    return Array.isArray(user.permissions) && user.permissions.includes(permission);
  }

  /**
   * Assert role access or throw 403.
   * @param {object} user
   * @param {string|string[]} allowedRoles
   */
  assertRole(user, allowedRoles) {
    if (!this.hasRole(user, allowedRoles)) {
      const err = new Error('Insufficient role privileges.');
      err.statusCode = 403;
      throw err;
    }
  }

  /**
   * Assert permission or throw 403.
   * @param {object} user
   * @param {string} permission
   */
  assertPermission(user, permission) {
    if (!this.hasPermission(user, permission)) {
      const err = new Error(`Missing permission: ${permission}`);
      err.statusCode = 403;
      throw err;
    }
  }
}
