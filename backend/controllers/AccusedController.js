/**
 * @file AccusedController.js
 * @description Accused Controller
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { BaseController } from './BaseController.js';
import { ResponseUtil } from '../utils/response.js';

export class AccusedController extends BaseController {
  constructor(service = null) {
    super(service);
  }

  async execute(payload = {}) {
    try {
      if (!this.service) {
        return ResponseUtil.error('Service instance not attached to controller.', 'SERVICE_MISSING', 500);
      }
      if (payload?.action === 'listByFIR') {
        const data = await this.service.getAccusedByFIR(payload.firNumber);
        return ResponseUtil.success(data);
      }
      if (payload?.action === 'highRisk') {
        const data = await this.service.getHighRiskSuspects(payload.district);
        return ResponseUtil.success(data);
      }
      if (payload?.action === 'repeatOffenders') {
        const data = await this.service.getRepeatOffenders();
        return ResponseUtil.success(data);
      }
      const data = await this.service.addAccused(payload);
      return ResponseUtil.success(data, 'Accused added successfully', 201);
    } catch (error) {
      return ResponseUtil.error(error.message, 'EXECUTION_FAILED', error.statusCode || 400);
    }
  }
}
