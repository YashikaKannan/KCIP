/**
 * @file CatalystAuthService.js
 * @description Zoho Catalyst Authentication Adapter
 * @author KCIP Engineering Team - Phase 5 Catalyst Integration
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { LoggerUtil } from '../../utils/logger.js';

export class CatalystAuthService {
  constructor(catalystApp = null) {
    this.catalystApp = catalystApp;
  }

  setCatalystApp(catalystApp) {
    this.catalystApp = catalystApp;
  }

  _auth() {
    if (this.catalystApp && typeof this.catalystApp.auth === 'function') {
      return this.catalystApp.auth();
    }
    return null;
  }

  /**
   * @param {object} [req]
   * @returns {Promise<object|null>}
   */
  async getCurrentUser(req) {
    const auth = this._auth();
    if (!auth) {
      return {
        user_id: 'usr-101',
        email: 'officer@ksp.gov.in',
        role_name: 'INVESTIGATION_OFFICER',
        first_name: 'Investigation',
        last_name: 'Officer',
        _offline: true
      };
    }

    try {
      if (typeof auth.getCurrentUser === 'function') {
        return await auth.getCurrentUser();
      }
      if (typeof auth.getCurrentUserDetails === 'function') {
        return await auth.getCurrentUserDetails();
      }
    } catch (error) {
      LoggerUtil.warn('[CatalystAuthService] getCurrentUser failed', {
        error: error.message
      });
      throw error;
    }

    return null;
  }

  /**
   * @param {string} username
   * @param {string} password
   * @returns {Promise<object>}
   */
  async signIn(username, password) {
    const auth = this._auth();
    if (!auth) {
      return {
        user_id: `local-${username}`,
        email: username,
        role_name: 'INVESTIGATION_OFFICER',
        token: `kcip-dev-${Date.now()}`,
        _offline: true
      };
    }

    if (typeof auth.signin === 'function') {
      return auth.signin(username, password);
    }
    if (typeof auth.signIn === 'function') {
      return auth.signIn(username, password);
    }

    throw new Error('Catalyst Auth sign-in API is not available in this runtime.');
  }

  /**
   * @returns {Promise<boolean>}
   */
  async signOut() {
    const auth = this._auth();
    if (!auth) return true;

    if (typeof auth.signout === 'function') {
      await auth.signout();
      return true;
    }
    if (typeof auth.signOut === 'function') {
      await auth.signOut();
      return true;
    }
    return true;
  }
}
