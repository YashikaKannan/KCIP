/**
 * @file CatalystChargesheetRepository.js
 * @description Catalyst Chargesheet Data Store Repository
 * @author KCIP Engineering Team - Phase 5 Catalyst Integration
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { CatalystDataStoreRepository } from './CatalystDataStoreRepository.js';

export class CatalystChargesheetRepository extends CatalystDataStoreRepository {
  constructor(catalystApp = null) {
    super('Chargesheets', catalystApp);
  }

  /**
   * @param {string} firNumber
   * @returns {Promise<object[]>}
   */
  async findByFirNumber(firNumber) {
    return this.findByField('FIRNumber', firNumber);
  }

  /**
   * @param {string} csNumber
   * @returns {Promise<object|null>}
   */
  async findByChargesheetNumber(csNumber) {
    return this.findOne({ ChargesheetNumber: csNumber });
  }
}
