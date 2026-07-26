/**
 * @file BaseController.js
 * @description Base Controller Class
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { ResponseUtil } from '../utils/response.js';

export class BaseController {
  constructor(service = null) {
    this.service = service;
  }

  async handleRequest(actionFn, payload = {}) {
    try {
      const data = await actionFn(payload);
      return ResponseUtil.success(data);
    } catch (error) {
      return ResponseUtil.error(error.message, 'CONTROLLER_ERROR', 400);
    }
  }
}
