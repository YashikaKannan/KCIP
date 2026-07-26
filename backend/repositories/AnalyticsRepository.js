/**
 * @file AnalyticsRepository.js
 * @description Crime Analytics Repository — Catalyst Data Store implementation
 * @author KCIP Backend Engineering Team
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { BaseRepository } from './BaseRepository.js';
import { CatalystAnalyticsRepository } from './catalyst/CatalystAnalyticsRepository.js';

export class AnalyticsRepository extends BaseRepository {
  /**
   * @param {object|null} catalystApp - Initialised Catalyst App from function context
   */
  constructor(catalystApp = null) {
    super();
    this.store = new CatalystAnalyticsRepository(catalystApp);
  }

  setCatalystApp(catalystApp) {
    this.store.catalystApp = catalystApp;
  }

  async findById(id) {
    return this.store.findById(id);
  }

  async findAll(options = {}) {
    return this.store.findAll(options);
  }

  async create(data) {
    return this.store.create(data);
  }

  async update(id, data) {
    return this.store.update(id, data);
  }

  async delete(id) {
    return this.store.delete(id);
  }

  async search(query) {
    return this.store.search(query);
  }

  async bulkInsert(items) {
    return this.store.bulkInsert(items);
  }

  async count(filter = {}) {
    return this.store.count(filter);
  }

  async aggregate(pipeline) {
    return this.store.aggregate(pipeline);
  }

  async getCrimeTrendStats(startDate, endDate, district) {
    return this.store.getCrimeTrendStats(startDate, endDate, district);
  }

  async getCrimeCategoryDistribution(district) {
    return this.store.getCrimeCategoryDistribution(district);
  }

  async getOfficerStationStats(district) {
    return this.store.getOfficerStationStats(district);
  }

  async getCrimeMapFeatures(options = {}) {
    return this.store.getCrimeMapFeatures(options);
  }
}
