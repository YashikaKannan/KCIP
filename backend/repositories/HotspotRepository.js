/**
 * @file HotspotRepository.js
 * @description Geospatial Hotspot Repository — Catalyst Data Store implementation
 * @author KCIP Backend Engineering Team
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { BaseRepository } from './BaseRepository.js';
import { CatalystHotspotRepository } from './catalyst/CatalystHotspotRepository.js';

export class HotspotRepository extends BaseRepository {
  /**
   * @param {object|null} catalystApp - Initialised Catalyst App from function context
   */
  constructor(catalystApp = null) {
    super();
    this.store = new CatalystHotspotRepository(catalystApp);
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

  async findHotspotsByDistrict(district, radius) {
    return this.store.findHotspotsByDistrict(district, radius);
  }

  async findByHotspotId(hotspotId) {
    return this.store.findByHotspotId(hotspotId);
  }

  async upsertHotspot(hotspot) {
    return this.store.upsertHotspot(hotspot);
  }

  async findHighRisk(minScore = 0.7) {
    return this.store.findHighRisk(minScore);
  }
}
