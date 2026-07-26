/**
 * @file HotspotController.js
 * @description Hotspot Controller
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { BaseController } from './BaseController.js';
import { ResponseUtil } from '../utils/response.js';

export class HotspotController extends BaseController {
  constructor(service = null) {
    super(service);
  }

  async execute(payload = {}) {
    try {
      if (!this.service) {
        return ResponseUtil.error('Service instance not attached to controller.', 'SERVICE_MISSING', 500);
      }
      if (payload?.action === 'calculate') {
        const data = await this.service.calculateAndStoreHotspots(payload?.district);
        return ResponseUtil.success(data, 'Hotspots calculated');
      }
      const data = await this.service.getHotspots(payload?.district, payload?.radiusKm);
      return ResponseUtil.success(data);
    } catch (error) {
      return ResponseUtil.error(error.message, 'EXECUTION_FAILED', error.statusCode || 400);
    }
  }
}
