/**
 * @file ChargesheetService.js
 * @description Chargesheet Legal Document Service — Catalyst Data Store backed
 * @author KCIP Backend Engineering Team
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { BaseService } from './BaseService.js';
import { MapperUtil } from '../utils/mapper.js';

export class ChargesheetService extends BaseService {
  constructor(repository = null) {
    super(repository);
  }

  _generateChargesheetNumber() {
    const year = new Date().getFullYear();
    const seq = String(Date.now()).slice(-5);
    return `CS/${year}/${seq}`;
  }

  async fileChargesheet(chargesheetData) {
    const repo = this.requireRepository();
    if (!chargesheetData?.firNumber || !chargesheetData?.courtName) {
      throw new Error('FIR Number and Court Name required.');
    }

    const chargesheetNumber =
      chargesheetData.chargesheetNumber || this._generateChargesheetNumber();

    const existing = await repo.findByChargesheetNumber(chargesheetNumber);
    if (existing) {
      throw new Error(`Chargesheet already exists: ${chargesheetNumber}`);
    }

    const row = MapperUtil.toDataStore({
      chargesheetNumber,
      firNumber: chargesheetData.firNumber,
      filingDate:
        chargesheetData.filingDate ||
        new Date().toISOString().replace('T', ' ').slice(0, 19),
      courtName: chargesheetData.courtName,
      accusedList: chargesheetData.accusedList ?? null,
      ipcSections: chargesheetData.ipcSections || chargesheetData.IPCSections || null
    });

    const created = await repo.create(row);
    return MapperUtil.fromDataStore(created);
  }

  async getByFIR(firNumber) {
    const repo = this.requireRepository();
    if (!firNumber) throw new Error('FIR Number is required.');
    return MapperUtil.fromDataStoreMany(await repo.findByFirNumber(firNumber));
  }

  async getByChargesheetNumber(csNumber) {
    const repo = this.requireRepository();
    const row = await repo.findByChargesheetNumber(csNumber);
    if (!row) {
      const err = new Error(`Chargesheet not found: ${csNumber}`);
      err.statusCode = 404;
      throw err;
    }
    return MapperUtil.fromDataStore(row);
  }

  async listChargesheets(options = {}) {
    const repo = this.requireRepository();
    const result = await repo.findAll(options);
    if (Array.isArray(result)) {
      return { data: MapperUtil.fromDataStoreMany(result) };
    }
    return { ...result, data: MapperUtil.fromDataStoreMany(result.data || []) };
  }
}
