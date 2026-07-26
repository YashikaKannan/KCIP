/**
 * @file CatalystFIRRepository.js
 * @description Catalyst FIR Data Store Repository
 * @author KCIP Engineering Team - Phase 5 Catalyst Integration
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { CatalystDataStoreRepository } from './CatalystDataStoreRepository.js';

export class CatalystFIRRepository extends CatalystDataStoreRepository {
  constructor(catalystApp = null) {
    super('FIRs', catalystApp);
  }

  /**
   * @param {string} firNumber
   * @returns {Promise<object|null>}
   */
  async findByFirNumber(firNumber) {
    return this.findOne({ FIRNumber: firNumber });
  }

  /**
   * @param {string} district
   * @param {object} [options]
   * @returns {Promise<object[]|{ data: object[], page: number, pageSize: number, total: number }>}
   */
  async findByDistrict(district, options = {}) {
    return this.findAll({
      ...options,
      filter: { ...(options.filter || {}), District: district }
    });
  }

  /**
   * @param {string} station
   * @param {object} [options]
   * @returns {Promise<object[]|{ data: object[], page: number, pageSize: number, total: number }>}
   */
  async findByPoliceStation(station, options = {}) {
    return this.findAll({
      ...options,
      filter: { ...(options.filter || {}), PoliceStation: station }
    });
  }

  /**
   * @param {string} status
   * @param {object} [options]
   */
  async findByStatus(status, options = {}) {
    return this.findAll({
      ...options,
      filter: { ...(options.filter || {}), Status: status }
    });
  }

  /**
   * Search FIRs by number, complainant, crime type, or district.
   * @param {string} query
   * @param {object} [options]
   */
  async searchFIRs(query, options = {}) {
    return this.findAll({
      ...options,
      search: query,
      searchFields: ['FIRNumber', 'ComplainantName', 'CrimeType', 'District', 'PoliceStation']
    });
  }

  /**
   * FIRs registered on a calendar day (YYYY-MM-DD).
   * @param {string} dateIso
   */
  async findByIncidentDate(dateIso) {
    return this.search(
      `IncidentDate >= ${this._escape(`${dateIso} 00:00:00`)} AND IncidentDate <= ${this._escape(`${dateIso} 23:59:59`)}`
    );
  }

  /**
   * Count FIRs with optional district/status filters for dashboard KPIs.
   * @param {object} [filter]
   */
  async countByFilter(filter = {}) {
    return this.count(filter);
  }
}
