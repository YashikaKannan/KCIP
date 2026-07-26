/**
 * @file VictimService.js
 * @description Victim Management Service — Catalyst Data Store backed
 * @author KCIP Backend Engineering Team
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { BaseService } from './BaseService.js';
import { MapperUtil } from '../utils/mapper.js';

export class VictimService extends BaseService {
  constructor(repository = null) {
    super(repository);
  }

  async addVictim(victimData) {
    const repo = this.requireRepository();
    if (!victimData?.name || !victimData?.firNumber) {
      throw new Error('Victim name and FIR Number required.');
    }

    const row = MapperUtil.toDataStore({
      firNumber: victimData.firNumber,
      name: victimData.name,
      age: victimData.age ?? null,
      gender: victimData.gender ?? null,
      contactNumber: victimData.contactNumber ?? null,
      statement: victimData.statement ?? null
    });

    const created = await repo.create(row);
    return MapperUtil.fromDataStore(created);
  }

  async getVictimsByFIR(firNumber) {
    const repo = this.requireRepository();
    if (!firNumber) throw new Error('FIR Number is required.');
    const rows = await repo.findByFirNumber(firNumber);
    return MapperUtil.fromDataStoreMany(rows);
  }

  async getById(id) {
    const repo = this.requireRepository();
    const row = await repo.findById(id);
    if (!row) {
      const err = new Error(`Victim not found: ${id}`);
      err.statusCode = 404;
      throw err;
    }
    return MapperUtil.fromDataStore(row);
  }

  async listVictims(options = {}) {
    const repo = this.requireRepository();
    const result = await repo.findAll(options);
    if (Array.isArray(result)) {
      return { data: MapperUtil.fromDataStoreMany(result) };
    }
    return { ...result, data: MapperUtil.fromDataStoreMany(result.data || []) };
  }

  async updateVictim(id, updates = {}) {
    const repo = this.requireRepository();
    const updated = await repo.update(id, MapperUtil.toDataStore(updates));
    return MapperUtil.fromDataStore(updated);
  }

  async deleteVictim(id) {
    return this.requireRepository().delete(id);
  }
}
