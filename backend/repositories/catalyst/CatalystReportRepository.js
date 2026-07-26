/**
 * @file CatalystReportRepository.js
 * @description Catalyst Report Data Store Repository
 * @author KCIP Engineering Team - Phase 5 Catalyst Integration
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { CatalystDataStoreRepository } from './CatalystDataStoreRepository.js';

export class CatalystReportRepository extends CatalystDataStoreRepository {
  constructor(catalystApp = null) {
    super('Reports', catalystApp);
  }

  async findByFirNumber(firNumber) {
    const all = await this.findAll();
    return all.find(r => r.FIRNumber === firNumber) || null;
  }

  async findByDistrict(district) {
    const all = await this.findAll();
    return all.filter(r => r.District === district);
  }
}
