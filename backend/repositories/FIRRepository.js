/**
 * @file FIRRepository.js
 * @description FIR Data Access Repository — Catalyst Data Store implementation
 * @author KCIP Backend Engineering Team
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { BaseRepository } from './BaseRepository.js';
import { CatalystFIRRepository } from './catalyst/CatalystFIRRepository.js';

export class FIRRepository extends BaseRepository {
  /**
   * @param {object|null} catalystApp - Initialised Catalyst App from function context
   */
  constructor(catalystApp = null) {
    super();
    this.store = new CatalystFIRRepository(catalystApp);
  }

  /** Re-bind Catalyst app after construction (e.g. per-request init). */
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
    if (typeof query === 'string' && !query.includes('=')) {
      return this.store.searchFIRs(query);
    }
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

  async findByFirNumber(firNumber) {
    return this.store.findByFirNumber(firNumber);
  }

  async findByDistrict(district, options = {}) {
    return this.store.findByDistrict(district, options);
  }

  async findByPoliceStation(station, options = {}) {
    return this.store.findByPoliceStation(station, options);
  }

  async findByStatus(status, options = {}) {
    return this.store.findByStatus(status, options);
  }

  async findByIncidentDate(dateIso) {
    return this.store.findByIncidentDate(dateIso);
  }
}
