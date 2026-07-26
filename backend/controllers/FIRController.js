/**
 * @file FIRController.js
 * @description FIR Controller — register, get, update, delete
 * @author KCIP Backend Engineering Team
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { BaseController } from './BaseController.js';
import { ResponseUtil } from '../utils/response.js';

export class FIRController extends BaseController {
  constructor(service = null) {
    super(service);
  }

  async execute(payload = {}) {
    return this.register(payload);
  }

  async register(payload = {}) {
    try {
      if (!this.service) {
        return ResponseUtil.error('Service instance not attached to controller.', 'SERVICE_MISSING', 500);
      }
      const data = await this.service.registerFIR(payload);
      return ResponseUtil.success(data, 'FIR registered successfully', 201);
    } catch (error) {
      return ResponseUtil.error(error.message, 'EXECUTION_FAILED', error.statusCode || 400);
    }
  }

  async get(payload = {}) {
    try {
      if (!this.service) {
        return ResponseUtil.error('Service instance not attached to controller.', 'SERVICE_MISSING', 500);
      }
      const data = payload.id
        ? await this.service.getById(payload.id)
        : await this.service.getFIRDetails(payload.firNumber);
      return ResponseUtil.success(data);
    } catch (error) {
      return ResponseUtil.error(error.message, 'EXECUTION_FAILED', error.statusCode || 400);
    }
  }

  async update(payload = {}) {
    try {
      if (!this.service) {
        return ResponseUtil.error('Service instance not attached to controller.', 'SERVICE_MISSING', 500);
      }
      const id = payload.id || payload.ROWID;
      if (!id) {
        return ResponseUtil.error('id is required to update FIR.', 'VALIDATION_ERROR', 400);
      }
      const { id: _id, ROWID, firNumber, ...updates } = payload;
      const data = await this.service.updateFIR(id, updates);
      return ResponseUtil.success(data, 'FIR updated successfully');
    } catch (error) {
      return ResponseUtil.error(error.message, 'EXECUTION_FAILED', error.statusCode || 400);
    }
  }

  async delete(payload = {}) {
    try {
      if (!this.service) {
        return ResponseUtil.error('Service instance not attached to controller.', 'SERVICE_MISSING', 500);
      }
      const id = payload.id || payload.ROWID;
      if (!id) {
        return ResponseUtil.error('id is required to delete FIR.', 'VALIDATION_ERROR', 400);
      }
      const data = await this.service.deleteFIR(id);
      return ResponseUtil.success(data, 'FIR deleted successfully');
    } catch (error) {
      return ResponseUtil.error(error.message, 'EXECUTION_FAILED', error.statusCode || 400);
    }
  }

  async list(payload = {}) {
    try {
      if (!this.service) {
        return ResponseUtil.error('Service instance not attached to controller.', 'SERVICE_MISSING', 500);
      }
      const data = await this.service.listFIRs(payload);
      return ResponseUtil.success(data);
    } catch (error) {
      return ResponseUtil.error(error.message, 'EXECUTION_FAILED', error.statusCode || 400);
    }
  }
}
