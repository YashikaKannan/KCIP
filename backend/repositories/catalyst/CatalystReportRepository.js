/**
 * @file CatalystReportRepository.js
 * @description Catalyst Report Data Store Repository
 * @author KCIP Engineering Team - Phase 5 Catalyst Integration
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { CatalystDataStoreRepository } from './CatalystDataStoreRepository.js';

export class CatalystReportRepository extends CatalystDataStoreRepository {
  constructor(catalystApp = null) {
    super('Reports', catalystApp);
  }

  /**
   * @param {string} reportId
   * @returns {Promise<object|null>}
   */
  async findByReportId(reportId) {
    return this.findOne({ ReportID: reportId });
  }

  /**
   * @param {string} type
   * @param {object} [options]
   * @returns {Promise<object[]>}
   */
  async findByType(type, options = {}) {
    return this.search({ Type: type }, options);
  }

  /**
   * @param {string} generatedBy
   * @returns {Promise<object[]>}
   */
  async findByGeneratedBy(generatedBy) {
    return this.findByField('GeneratedBy', generatedBy);
  }
}
