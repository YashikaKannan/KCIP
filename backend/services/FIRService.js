/**
 * @file FIRService.js
 * @description FIR Business Service — Catalyst Data Store backed
 * @author KCIP Backend Engineering Team
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { BaseService } from './BaseService.js';
import { MapperUtil } from '../utils/mapper.js';
import { LoggerUtil } from '../utils/logger.js';
import { CatalystSignalsService } from './catalyst/CatalystSignalsService.js';
import { CatalystCircuitsService } from './catalyst/CatalystCircuitsService.js';

export class FIRService extends BaseService {
  /**
   * @param {object|null} repository
   * @param {object} [options]
   * @param {object|null} [options.catalystApp]
   * @param {object} [options.pipelineHandlers]
   */
  constructor(repository = null, options = {}) {
    super(repository);
    this.catalystApp = options.catalystApp || null;
    this.pipelineHandlers = options.pipelineHandlers || {};
    this.signals = new CatalystSignalsService(this.catalystApp);
    this.circuits = new CatalystCircuitsService(this.catalystApp);
  }

  setCatalystApp(catalystApp) {
    super.setCatalystApp(catalystApp);
    this.catalystApp = catalystApp;
    this.signals.setCatalystApp(catalystApp);
    this.circuits.setCatalystApp(catalystApp);
  }

  setPipelineHandlers(handlers = {}) {
    this.pipelineHandlers = handlers;
  }

  /**
   * Generate a unique FIR number for Karnataka State Police.
   * @param {string} district
   * @returns {string}
   */
  _generateFirNumber(district = 'KA') {
    const year = new Date().getFullYear();
    const code = String(district)
      .replace(/[^A-Za-z]/g, '')
      .slice(0, 3)
      .toUpperCase() || 'KA';
    const seq = String(Date.now()).slice(-6);
    return `FIR/${year}/${code}/${seq}`;
  }

  /**
   * Register a new FIR in Catalyst Data Store.
   * @param {object} firData
   * @returns {Promise<object>}
   */
  async registerFIR(firData) {
    const repo = this.requireRepository();

    if (!firData || !firData.policeStation || !firData.district) {
      throw new Error('Invalid FIR registration data.');
    }
    if (!firData.crimeType || !firData.complainantName) {
      throw new Error('crimeType and complainantName are required.');
    }

    const firNumber = firData.firNumber || this._generateFirNumber(firData.district);
    const existing = await repo.findByFirNumber(firNumber);
    if (existing) {
      throw new Error(`FIR already exists: ${firNumber}`);
    }

    const row = MapperUtil.toDataStore({
      firNumber,
      policeStation: firData.policeStation,
      district: firData.district,
      crimeType: firData.crimeType,
      ipcSections: firData.ipcSections || firData.IPCSections || null,
      complainantName: firData.complainantName,
      incidentDate: firData.incidentDate || new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: firData.status || 'REGISTERED',
      latitude: firData.latitude,
      longitude: firData.longitude,
      severity: firData.severity
    });

    try {
      const created = await repo.create(row);
      LoggerUtil.info('[FIRService] FIR registered', { firNumber });
      const mapped = MapperUtil.fromDataStore(created);

      // Event-driven pipeline (Signals) + Circuits workflow — never fail registration
      try {
        await this.signals.onFIRInserted(mapped, this.pipelineHandlers);
      } catch (signalErr) {
        LoggerUtil.warn('[FIRService] Signal pipeline warning', { error: signalErr.message });
      }
      try {
        await this.circuits.runNewFIRWorkflow(mapped, this.pipelineHandlers);
      } catch (circuitErr) {
        LoggerUtil.warn('[FIRService] Circuit workflow warning', { error: circuitErr.message });
      }

      return mapped;
    } catch (error) {
      this.logError('registerFIR', error, { firNumber });
      throw error;
    }
  }

  /**
   * @param {string} firNumber
   * @returns {Promise<object>}
   */
  async getFIRDetails(firNumber) {
    const repo = this.requireRepository();
    if (!firNumber) throw new Error('FIR Number is required.');

    const row = await repo.findByFirNumber(firNumber);
    if (!row) {
      const err = new Error(`FIR not found: ${firNumber}`);
      err.statusCode = 404;
      throw err;
    }
    return MapperUtil.fromDataStore(row);
  }

  /**
   * @param {string|number} id
   * @returns {Promise<object>}
   */
  async getById(id) {
    const repo = this.requireRepository();
    const row = await repo.findById(id);
    if (!row) {
      const err = new Error(`FIR not found for id: ${id}`);
      err.statusCode = 404;
      throw err;
    }
    return MapperUtil.fromDataStore(row);
  }

  /**
   * @param {object} [options]
   * @returns {Promise<object>}
   */
  async listFIRs(options = {}) {
    const repo = this.requireRepository();
    const result = await repo.findAll(options);
    if (Array.isArray(result)) {
      return { data: MapperUtil.fromDataStoreMany(result), total: result.length };
    }
    return {
      ...result,
      data: MapperUtil.fromDataStoreMany(result.data || [])
    };
  }

  /**
   * @param {string|number} id
   * @param {object} updates
   * @returns {Promise<object>}
   */
  async updateFIR(id, updates = {}) {
    const repo = this.requireRepository();
    if (!id) throw new Error('FIR id is required for update.');
    const payload = MapperUtil.toDataStore(updates);
    delete payload.FIRNumber;
    const updated = await repo.update(id, payload);
    return MapperUtil.fromDataStore(updated);
  }

  /**
   * @param {string|number} id
   * @returns {Promise<object>}
   */
  async deleteFIR(id) {
    const repo = this.requireRepository();
    if (!id) throw new Error('FIR id is required for delete.');
    return repo.delete(id);
  }

  /**
   * @param {string} district
   * @param {object} [options]
   */
  async getByDistrict(district, options = {}) {
    const repo = this.requireRepository();
    if (!district) throw new Error('District is required.');
    const result = await repo.findByDistrict(district, options);
    if (Array.isArray(result)) {
      return MapperUtil.fromDataStoreMany(result);
    }
    return {
      ...result,
      data: MapperUtil.fromDataStoreMany(result.data || [])
    };
  }
}
