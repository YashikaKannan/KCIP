/**
 * @file ArrestService.js
 * @description Arrest Record Business Service — Catalyst Data Store backed
 * @author KCIP Backend Engineering Team
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { BaseService } from './BaseService.js';
import { MapperUtil } from '../utils/mapper.js';

export class ArrestService extends BaseService {
  constructor(repository = null) {
    super(repository);
  }

  _generateArrestId() {
    return `ARR-${Date.now()}`;
  }

  async recordArrest(arrestData) {
    const repo = this.requireRepository();
    if (!arrestData?.accusedId || !arrestData?.firNumber) {
      throw new Error('Accused ID and FIR Number required.');
    }

    const arrestId = arrestData.arrestId || this._generateArrestId();
    const row = MapperUtil.toDataStore({
      arrestId,
      accusedId: arrestData.accusedId,
      firNumber: arrestData.firNumber,
      arrestDate: arrestData.arrestDate || new Date().toISOString().replace('T', ' ').slice(0, 19),
      arrestingOfficer: arrestData.arrestingOfficer || 'UNKNOWN',
      detentionLocation: arrestData.detentionLocation ?? null
    });

    const created = await repo.create(row);
    return MapperUtil.fromDataStore(created);
  }

  async getArrestsByFIR(firNumber) {
    const repo = this.requireRepository();
    if (!firNumber) throw new Error('FIR Number is required.');
    return MapperUtil.fromDataStoreMany(await repo.findByFirNumber(firNumber));
  }

  async getArrestsByAccused(accusedId) {
    const repo = this.requireRepository();
    if (!accusedId) throw new Error('Accused ID is required.');
    return MapperUtil.fromDataStoreMany(await repo.findByAccusedId(accusedId));
  }

  async getByArrestId(arrestId) {
    const repo = this.requireRepository();
    const row = await repo.findByArrestId(arrestId);
    if (!row) {
      const err = new Error(`Arrest not found: ${arrestId}`);
      err.statusCode = 404;
      throw err;
    }
    return MapperUtil.fromDataStore(row);
  }

  async listArrests(options = {}) {
    const repo = this.requireRepository();
    const result = await repo.findAll(options);
    if (Array.isArray(result)) {
      return { data: MapperUtil.fromDataStoreMany(result) };
    }
    return { ...result, data: MapperUtil.fromDataStoreMany(result.data || []) };
  }

  async updateArrest(id, updates = {}) {
    const repo = this.requireRepository();
    const updated = await repo.update(id, MapperUtil.toDataStore(updates));
    return MapperUtil.fromDataStore(updated);
  }

  async deleteArrest(id) {
    return this.requireRepository().delete(id);
  }
}
