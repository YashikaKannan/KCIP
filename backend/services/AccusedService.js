/**
 * @file AccusedService.js
 * @description Accused Management Service — Catalyst Data Store backed
 * @author KCIP Backend Engineering Team
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { BaseService } from './BaseService.js';
import { MapperUtil } from '../utils/mapper.js';

export class AccusedService extends BaseService {
  constructor(repository = null) {
    super(repository);
  }

  async addAccused(accusedData) {
    const repo = this.requireRepository();
    if (!accusedData?.name || !accusedData?.firNumber) {
      throw new Error('Accused name and FIR Number required.');
    }

    const row = MapperUtil.toDataStore({
      firNumber: accusedData.firNumber,
      name: accusedData.name,
      alias: accusedData.alias ?? null,
      age: accusedData.age ?? null,
      status: accusedData.status || 'ABSCONDING',
      riskLevel: accusedData.riskLevel || 'MEDIUM'
    });

    const created = await repo.create(row);
    return MapperUtil.fromDataStore(created);
  }

  async getAccusedByFIR(firNumber) {
    const repo = this.requireRepository();
    if (!firNumber) throw new Error('FIR Number is required.');
    return MapperUtil.fromDataStoreMany(await repo.findByFirNumber(firNumber));
  }

  async getHighRiskSuspects(district) {
    const repo = this.requireRepository();
    return MapperUtil.fromDataStoreMany(await repo.findHighRiskSuspects(district));
  }

  async getRepeatOffenders() {
    const repo = this.requireRepository();
    return repo.findRepeatOffenders();
  }

  async getById(id) {
    const repo = this.requireRepository();
    const row = await repo.findById(id);
    if (!row) {
      const err = new Error(`Accused not found: ${id}`);
      err.statusCode = 404;
      throw err;
    }
    return MapperUtil.fromDataStore(row);
  }

  async listAccused(options = {}) {
    const repo = this.requireRepository();
    const result = await repo.findAll(options);
    if (Array.isArray(result)) {
      return { data: MapperUtil.fromDataStoreMany(result) };
    }
    return { ...result, data: MapperUtil.fromDataStoreMany(result.data || []) };
  }

  async updateAccused(id, updates = {}) {
    const repo = this.requireRepository();
    const updated = await repo.update(id, MapperUtil.toDataStore(updates));
    return MapperUtil.fromDataStore(updated);
  }

  async deleteAccused(id) {
    return this.requireRepository().delete(id);
  }
}
