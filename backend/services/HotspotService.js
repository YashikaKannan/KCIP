/**
 * @file HotspotService.js
 * @description Geospatial Hotspot Analysis Service — Catalyst Data Store backed
 * @author KCIP Backend Engineering Team
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { BaseService } from './BaseService.js';
import { MapperUtil } from '../utils/mapper.js';
import { LoggerUtil } from '../utils/logger.js';

export class HotspotService extends BaseService {
  /**
   * @param {object|null} repository - HotspotRepository
   * @param {object|null} [firRepository] - Optional FIRRepository for score calculation
   */
  constructor(repository = null, firRepository = null) {
    super(repository);
    this.firRepository = firRepository;
  }

  setCatalystApp(catalystApp) {
    super.setCatalystApp(catalystApp);
    if (this.firRepository && typeof this.firRepository.setCatalystApp === 'function') {
      this.firRepository.setCatalystApp(catalystApp);
    }
  }

  /**
   * @param {string} district
   * @param {number} [radiusKm=5]
   * @returns {Promise<object>}
   */
  async getHotspots(district, radiusKm = 5) {
    const repo = this.requireRepository();
    if (!district) throw new Error('District is required.');

    const radiusMeters = Number(radiusKm) * 1000;
    const rows = await repo.findHotspotsByDistrict(district, radiusMeters);
    return {
      district,
      radiusKm,
      hotspots: MapperUtil.fromDataStoreMany(rows)
    };
  }

  /**
   * Calculate hotspot scores from FIR density and persist to Hotspots table.
   * @param {string} district
   * @returns {Promise<object[]>}
   */
  async calculateAndStoreHotspots(district) {
    const repo = this.requireRepository();
    if (!district) throw new Error('District is required.');

    let firs = [];
    if (this.firRepository) {
      const result = await this.firRepository.findByDistrict(district, {
        paginated: false,
        limit: 500
      });
      firs = Array.isArray(result) ? result : result.data || [];
    }

    // Cluster by police station as a practical hotspot proxy
    const clusters = new Map();
    for (const fir of firs) {
      const key = fir.PoliceStation || fir.policeStation || 'UNKNOWN';
      if (!clusters.has(key)) {
        clusters.set(key, {
          policeStation: key,
          count: 0,
          latSum: 0,
          lngSum: 0,
          geoCount: 0
        });
      }
      const c = clusters.get(key);
      c.count += 1;
      const lat = Number(fir.Latitude ?? fir.latitude);
      const lng = Number(fir.Longitude ?? fir.longitude);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        c.latSum += lat;
        c.lngSum += lng;
        c.geoCount += 1;
      }
    }

    const maxCount = Math.max(1, ...[...clusters.values()].map((c) => c.count));
    const saved = [];

    for (const cluster of clusters.values()) {
      const riskScore = Number(((cluster.count / maxCount) * 100).toFixed(2));
      const hotspotId = `HS-${district.replace(/\s+/g, '').slice(0, 8)}-${cluster.policeStation.replace(/\s+/g, '').slice(0, 8)}`;
      const centerLat =
        cluster.geoCount > 0 ? cluster.latSum / cluster.geoCount : 12.9716;
      const centerLng =
        cluster.geoCount > 0 ? cluster.lngSum / cluster.geoCount : 77.5946;

      const row = MapperUtil.toDataStore({
        hotspotId,
        district,
        centerLat,
        centerLng,
        radiusMeters: 800,
        riskScore
      });

      try {
        const upserted = await repo.upsertHotspot({
          ...row,
          // crimeCount is not in schema but useful if column exists later
        });
        saved.push(MapperUtil.fromDataStore(upserted));
      } catch (error) {
        LoggerUtil.warn('[HotspotService] upsert failed', {
          hotspotId,
          error: error.message
        });
      }
    }

    LoggerUtil.info('[HotspotService] Hotspots calculated', {
      district,
      count: saved.length
    });

    return saved;
  }
}
