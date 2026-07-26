/**
 * @file CatalystPredictionRepository.js
 * @description Catalyst Prediction Data Store Repository
 * @author KCIP Engineering Team - Phase 5 Catalyst Integration
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { CatalystDataStoreRepository } from './CatalystDataStoreRepository.js';

export class CatalystPredictionRepository extends CatalystDataStoreRepository {
  constructor(catalystApp = null) {
    super('Predictions', catalystApp);
  }

  /**
   * Latest prediction for a district (highest ROWID / most recent).
   * @param {string} district
   * @returns {Promise<object|null>}
   */
  async findLatestByDistrict(district) {
    const rows = await this.search(
      { District: district },
      { sortBy: 'ROWID', sortOrder: 'desc', limit: 1 }
    );
    return rows[0] ?? null;
  }

  /**
   * @param {string} predictionType
   * @param {object} [options]
   * @returns {Promise<object[]>}
   */
  async findByType(predictionType, options = {}) {
    return this.search(
      { PredictionType: predictionType },
      options
    );
  }

  /**
   * @param {string} predictionId
   * @returns {Promise<object|null>}
   */
  async findByPredictionId(predictionId) {
    return this.findOne({ PredictionID: predictionId });
  }

  /**
   * @param {string} district
   * @returns {Promise<object[]>}
   */
  async findByDistrict(district) {
    return this.findByField('District', district);
  }
}
