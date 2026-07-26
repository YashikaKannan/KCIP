/**
 * @file AuthService.js
 * @description Authentication Service
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { BaseService } from './BaseService.js';

export class AuthService extends BaseService {
  constructor(repository = null) {
    super(repository);
  }

  async login(username, password) {
    if (!username || !password) {
      throw new Error('Username and password are required.');
    }
    return { token: 'mock-jwt-token', user: { username, role: 'ANALYST' } };
  }

}
