/**
 * @file CatalystArrestRepository.js
 * @description Catalyst Arrest Data Store Repository
 * @author KCIP Engineering Team - Phase 5 Catalyst Integration
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { CatalystDataStoreRepository } from './CatalystDataStoreRepository.js';

export class CatalystArrestRepository extends CatalystDataStoreRepository {
  constructor(catalystApp = null) {
    super('Arrests', catalystApp);
  }

  /**
   * @param {string} accusedId
   * @returns {Promise<object[]>}
   */
  async findByAccusedId(accusedId) {
    return this.findByField('AccusedID', accusedId);
  }

  /**
   * @param {string} firNumber
   * @returns {Promise<object[]>}
   */
  async findByFirNumber(firNumber) {
    return this.findByField('FIRNumber', firNumber);
  }

  /**
   * @param {string} arrestId
   * @returns {Promise<object|null>}
   */
  async findByArrestId(arrestId) {
    return this.findOne({ ArrestID: arrestId });
  }

  /**
   * Arrests on a calendar day (YYYY-MM-DD).
   * @param {string} dateIso
   */
  async findByArrestDate(dateIso) {
    return this.search(
      `ArrestDate >= ${this._escape(`${dateIso} 00:00:00`)} AND ArrestDate <= ${this._escape(`${dateIso} 23:59:59`)}`
    );
  }
}
