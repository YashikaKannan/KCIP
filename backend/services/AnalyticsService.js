/**
 * @file AnalyticsService.js
 * @description Crime Analytics & Intelligence Service — Catalyst Data Store backed
 * @author KCIP Backend Engineering Team
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { BaseService } from './BaseService.js';

export class AnalyticsService extends BaseService {
  constructor(repository = null) {
    super(repository);
  }

  /**
   * @param {string} district
   * @param {string} startDate
   * @param {string} endDate
   * @returns {Promise<object>}
   */
  async getCrimeTrends(district, startDate, endDate) {
    const repo = this.requireRepository();
    if (!startDate || !endDate) {
      throw new Error('startDate and endDate are required (YYYY-MM-DD).');
    }

    const scope = !district || district === 'ALL' ? undefined : district;
    const trends = await repo.getCrimeTrendStats(startDate, endDate, scope);

    return {
      district: district || 'ALL',
      timeframe: { startDate, endDate },
      trends
    };
  }

  /**
   * @param {string} [district]
   * @returns {Promise<object>}
   */
  async getCrimeCategories(district) {
    const repo = this.requireRepository();
    const scope = !district || district === 'ALL' ? undefined : district;
    const categories = await repo.getCrimeCategoryDistribution(scope);
    return { district: district || 'ALL', categories };
  }

  /**
   * @param {string} [district]
   * @returns {Promise<object>}
   */
  async getOfficerStatistics(district) {
    const repo = this.requireRepository();
    const scope = !district || district === 'ALL' ? undefined : district;
    const stations = await repo.getOfficerStationStats(scope);
    return { district: district || 'ALL', stations };
  }

  /**
   * GeoJSON FeatureCollection for crime map.
   * @param {object} [options]
   * @returns {Promise<object>}
   */
  async getCrimeMap(options = {}) {
    const repo = this.requireRepository();
    return repo.getCrimeMapFeatures(options);
  }
}
