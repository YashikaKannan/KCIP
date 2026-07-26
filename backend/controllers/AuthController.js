/**
 * @file AuthController.js
 * @description Auth Controller — login, logout, current user
 * @author KCIP Backend Engineering Team
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { BaseController } from './BaseController.js';
import { ResponseUtil } from '../utils/response.js';

export class AuthController extends BaseController {
  constructor(service = null) {
    super(service);
  }

  async execute(payload = {}) {
    try {
      if (!this.service) {
        return ResponseUtil.error('Service instance not attached to controller.', 'SERVICE_MISSING', 500);
      }
      const data = await this.service.login(payload);
      return ResponseUtil.success(data, 'Login successful');
    } catch (error) {
      return ResponseUtil.error(error.message, 'EXECUTION_FAILED', error.statusCode || 401);
    }
  }

  async login(payload = {}) {
    return this.execute(payload);
  }

  async logout(payload = {}) {
    try {
      if (!this.service) {
        return ResponseUtil.error('Service instance not attached to controller.', 'SERVICE_MISSING', 500);
      }
      const data = await this.service.logout(payload.token);
      return ResponseUtil.success(data, 'Logout successful');
    } catch (error) {
      return ResponseUtil.error(error.message, 'EXECUTION_FAILED', error.statusCode || 400);
    }
  }

  async currentUser(payload = {}) {
    try {
      if (!this.service) {
        return ResponseUtil.error('Service instance not attached to controller.', 'SERVICE_MISSING', 500);
      }
      const data = await this.service.getCurrentUser(payload);
      return ResponseUtil.success(data);
    } catch (error) {
      return ResponseUtil.error(error.message, 'UNAUTHENTICATED', error.statusCode || 401);
    }
  }
}
