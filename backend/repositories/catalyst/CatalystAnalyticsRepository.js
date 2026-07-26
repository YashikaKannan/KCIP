/**
 * @file CatalystAnalyticsRepository.js
 * @description Catalyst Analytics Data Store Repository
 * @author KCIP Engineering Team - Phase 5 Catalyst Integration
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { CatalystDataStoreRepository } from './CatalystDataStoreRepository.js';
import { LoggerUtil } from '../../utils/logger.js';

export class CatalystAnalyticsRepository extends CatalystDataStoreRepository {
  constructor(catalystApp = null) {
    super('FIRs', catalystApp);
  }

  /**
   * Crime trend buckets between two dates for a district (or statewide).
   * @param {string} startDate - YYYY-MM-DD
   * @param {string} endDate - YYYY-MM-DD
   * @param {string} [district]
   * @returns {Promise<object[]>}
   */
  async getCrimeTrendStats(startDate, endDate, district) {
    let where =
      `IncidentDate >= ${this._escape(`${startDate} 00:00:00`)} ` +
      `AND IncidentDate <= ${this._escape(`${endDate} 23:59:59`)}`;
    if (district) {
      where += ` AND District = ${this._escape(district)}`;
    }

    try {
      const rows = await this.search(where, { sortBy: 'IncidentDate', sortOrder: 'asc' });
      const buckets = new Map();

      for (const row of rows) {
        const raw = row.IncidentDate || row.CREATEDTIME || '';
        const day = String(raw).slice(0, 10);
        if (!day) continue;
        if (!buckets.has(day)) {
          buckets.set(day, { date: day, count: 0, byCrimeType: {} });
        }
        const bucket = buckets.get(day);
        bucket.count += 1;
        const ct = row.CrimeType || 'UNKNOWN';
        bucket.byCrimeType[ct] = (bucket.byCrimeType[ct] || 0) + 1;
      }

      return [...buckets.values()];
    } catch (err) {
      LoggerUtil.error('[AnalyticsRepository] getCrimeTrendStats failed', { error: err.message });
      return [];
    }
  }

  /**
   * Crime category distribution for a district (or statewide).
   * @param {string} [district]
   * @returns {Promise<object[]>}
   */
  async getCrimeCategoryDistribution(district) {
    const filter = district ? { District: district } : {};
    try {
      const grouped = await this.aggregate({
        groupBy: 'CrimeType',
        aggregate: 'COUNT',
        field: 'ROWID',
        filter
      });

      return grouped.map((row) => ({
        category: row.CrimeType,
        count: Number(row.COUNT_ROWID ?? row['COUNT(ROWID)'] ?? row.count ?? 0)
      }));
    } catch (err) {
      LoggerUtil.error('[AnalyticsRepository] getCrimeCategoryDistribution failed', {
        error: err.message
      });
      return [];
    }
  }

  /**
   * Officer / station workload stats derived from FIR counts.
   * @param {string} [district]
   * @returns {Promise<object[]>}
   */
  async getOfficerStationStats(district) {
    const filter = district ? { District: district } : {};
    try {
      const grouped = await this.aggregate({
        groupBy: 'PoliceStation',
        aggregate: 'COUNT',
        field: 'ROWID',
        filter
      });
      return grouped.map((row) => ({
        policeStation: row.PoliceStation,
        firCount: Number(row.COUNT_ROWID ?? row['COUNT(ROWID)'] ?? row.count ?? 0),
        district: district || null
      }));
    } catch (err) {
      LoggerUtil.error('[AnalyticsRepository] getOfficerStationStats failed', { error: err.message });
      return [];
    }
  }

  /**
   * GeoJSON-compatible crime map features from FIRs that carry coordinates
   * (Latitude / Longitude columns when present) or hotspot centers as fallback.
   * @param {object} [options]
   * @returns {Promise<{ type: 'FeatureCollection', features: object[] }>}
   */
  async getCrimeMapFeatures(options = {}) {
    const { district, crimeType, limit = 500 } = options;
    const filter = {};
    if (district) filter.District = district;
    if (crimeType) filter.CrimeType = crimeType;

    try {
      const result = await this.findAll({
        filter,
        limit,
        paginated: false,
        sortBy: 'IncidentDate',
        sortOrder: 'desc'
      });
      const rows = Array.isArray(result) ? result : result.data;

      const features = rows
        .filter((r) => r.Latitude != null && r.Longitude != null)
        .map((r) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [Number(r.Longitude), Number(r.Latitude)]
          },
          properties: {
            firNumber: r.FIRNumber,
            district: r.District,
            policeStation: r.PoliceStation,
            crimeType: r.CrimeType,
            severity: r.Severity || r.Status,
            time: r.IncidentDate,
            status: r.Status
          }
        }));

      return { type: 'FeatureCollection', features };
    } catch (err) {
      LoggerUtil.error('[AnalyticsRepository] getCrimeMapFeatures failed', { error: err.message });
      return { type: 'FeatureCollection', features: [] };
    }
  }
}
