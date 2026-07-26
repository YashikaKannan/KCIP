/**
 * @file CatalystVictimRepository.js
 * @description Catalyst Victim Data Store Repository
 * @author KCIP Engineering Team - Phase 5 Catalyst Integration
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { CatalystDataStoreRepository } from './CatalystDataStoreRepository.js';

export class CatalystVictimRepository extends CatalystDataStoreRepository {
  constructor(catalystApp = null) {
    super('Victims', catalystApp);
  }

  /**
   * All victims linked to an FIR.
   * @param {string} firNumber
   * @returns {Promise<object[]>}
   */
  async findByFirNumber(firNumber) {
    return this.findByField('FIRNumber', firNumber);
  }

  /**
   * Free-text victim search.
   * @param {string} query
   * @param {object} [options]
   */
  async searchVictims(query, options = {}) {
    return this.findAll({
      ...options,
      search: query,
      searchFields: ['Name', 'FIRNumber', 'ContactNumber']
    });
  }
}
