/**
 * @file CatalystHotspotRepository.js
 * @description Catalyst Hotspot Data Store Repository
 * @author KCIP Engineering Team - Phase 5 Catalyst Integration
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { CatalystDataStoreRepository } from './CatalystDataStoreRepository.js';

export class CatalystHotspotRepository extends CatalystDataStoreRepository {
  constructor(catalystApp = null) {
    super('Hotspots', catalystApp);
  }

  /**
   * @param {string} district
   * @param {number} [radius] - Optional max RadiusMeters filter
   * @returns {Promise<object[]>}
   */
  async findHotspotsByDistrict(district, radius) {
    const filter = { District: district };
    if (radius !== undefined && radius !== null) {
      filter.RadiusMeters = { $lte: Number(radius) };
    }
    return this.search(filter, { sortBy: 'RiskScore', sortOrder: 'desc' });
  }

  /**
   * @param {string} hotspotId
   * @returns {Promise<object|null>}
   */
  async findByHotspotId(hotspotId) {
    return this.findOne({ HotspotID: hotspotId });
  }

  /**
   * Persist or refresh a hotspot score row.
   * @param {object} hotspot
   * @returns {Promise<object>}
   */
  async upsertHotspot(hotspot) {
    const existing = hotspot.HotspotID
      ? await this.findByHotspotId(hotspot.HotspotID)
      : null;

    if (existing?.ROWID) {
      return this.update(existing.ROWID, hotspot);
    }
    return this.create(hotspot);
  }

  /**
   * High-risk hotspots above a score threshold.
   * @param {number} [minScore=0.7]
   * @returns {Promise<object[]>}
   */
  async findHighRisk(minScore = 0.7) {
    return this.search(
      { RiskScore: { $gte: Number(minScore) } },
      { sortBy: 'RiskScore', sortOrder: 'desc' }
    );
  }
}
