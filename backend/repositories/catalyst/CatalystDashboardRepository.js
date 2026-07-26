/**
 * @file CatalystDashboardRepository.js
 * @description Catalyst Dashboard Metrics Data Store Repository
 * @author KCIP Engineering Team - Phase 5 Catalyst Integration
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { CatalystDataStoreRepository } from './CatalystDataStoreRepository.js';
import { LoggerUtil } from '../../utils/logger.js';

export class CatalystDashboardRepository extends CatalystDataStoreRepository {
  constructor(catalystApp = null) {
    super('FIRs', catalystApp);
  }

  /**
   * Aggregate district-level KPI metrics from FIRs / related tables.
   * @param {string} [district]
   * @returns {Promise<object>}
   */
  async getDistrictMetrics(district) {
    const filter = district ? { District: district } : {};
    const today = new Date().toISOString().slice(0, 10);

    try {
      const [totalFIRs, pendingInvestigation, todayFIRs, crimeTypes, districtStats] =
        await Promise.all([
          this.count(filter),
          this.count({
            ...filter,
            Status: { $in: ['PENDING', 'UNDER_INVESTIGATION', 'OPEN', 'Pending', 'Under Investigation'] }
          }),
          this._countToday(district, today),
          this.aggregate({
            groupBy: 'CrimeType',
            aggregate: 'COUNT',
            field: 'ROWID',
            filter
          }),
          district
            ? Promise.resolve([])
            : this.aggregate({
                groupBy: 'District',
                aggregate: 'COUNT',
                field: 'ROWID'
              })
        ]);

      const arrests = await this._countRelated('Arrests', district);
      const victims = await this._countRelated('Victims', district);
      const hotspots = await this._countRelated('Hotspots', district);
      const highRiskSuspects = await this._countHighRisk(district);

      return {
        district: district || 'ALL',
        totalFIRs,
        todaysFIRs: todayFIRs,
        pendingInvestigation,
        arrests,
        victims,
        totalHotspots: hotspots,
        highRiskSuspects,
        crimeCategories: crimeTypes,
        districtStatistics: districtStats,
        lastUpdated: new Date().toISOString()
      };
    } catch (err) {
      LoggerUtil.error('[DashboardRepository] getDistrictMetrics failed', { error: err.message });
      return {
        district: district || 'ALL',
        totalFIRs: 0,
        todaysFIRs: 0,
        pendingInvestigation: 0,
        arrests: 0,
        victims: 0,
        totalHotspots: 0,
        highRiskSuspects: 0,
        crimeCategories: [],
        districtStatistics: [],
        lastUpdated: new Date().toISOString(),
        error: err.message
      };
    }
  }

  async _countToday(district, today) {
    let where =
      `IncidentDate >= ${this._escape(`${today} 00:00:00`)} ` +
      `AND IncidentDate <= ${this._escape(`${today} 23:59:59`)}`;
    if (district) {
      where += ` AND District = ${this._escape(district)}`;
    }
    return this.count(where);
  }

  async _countRelated(tableName, district) {
    const zql = this._zql();
    if (!zql) return 0;

    try {
      if (!district || tableName === 'Hotspots') {
        const where = district && tableName === 'Hotspots'
          ? ` WHERE District = ${this._escape(district)}`
          : '';
        if (tableName === 'Hotspots' || !district) {
          const result = await zql.executeZQLQuery(`SELECT COUNT(ROWID) FROM ${tableName}${where}`);
          const row = result?.[0]?.[tableName] ?? result?.[0] ?? {};
          return Number(row.COUNT ?? row['COUNT(ROWID)'] ?? Object.values(row)[0] ?? 0);
        }
      }

      // Victims / Arrests: count via FIR numbers in district
      const firs = await zql.executeZQLQuery(
        `SELECT FIRNumber FROM FIRs WHERE District = ${this._escape(district)}`
      );
      const firNumbers = (firs ?? [])
        .map((r) => (r.FIRs ?? r).FIRNumber)
        .filter(Boolean);

      if (!firNumbers.length) return 0;

      // Batch IN clauses (Catalyst ZQL practical limit)
      const chunk = firNumbers.slice(0, 50);
      const list = chunk.map((f) => this._escape(f)).join(', ');
      const result = await zql.executeZQLQuery(
        `SELECT COUNT(ROWID) FROM ${tableName} WHERE FIRNumber IN (${list})`
      );
      const row = result?.[0]?.[tableName] ?? result?.[0] ?? {};
      return Number(row.COUNT ?? row['COUNT(ROWID)'] ?? Object.values(row)[0] ?? 0);
    } catch (err) {
      LoggerUtil.warn(`[DashboardRepository] _countRelated(${tableName})`, { error: err.message });
      return 0;
    }
  }

  async _countHighRisk(district) {
    const zql = this._zql();
    if (!zql) return 0;
    try {
      const result = await zql.executeZQLQuery(
        `SELECT COUNT(ROWID) FROM Accused WHERE RiskLevel = ${this._escape('HIGH')}`
      );
      const row = result?.[0]?.Accused ?? result?.[0] ?? {};
      const count = Number(row.COUNT ?? row['COUNT(ROWID)'] ?? Object.values(row)[0] ?? 0);
      if (!district) return count;

      // Approximate: filter via FIR district when needed
      const accused = await zql.executeZQLQuery(
        `SELECT FIRNumber FROM Accused WHERE RiskLevel = ${this._escape('HIGH')}`
      );
      const firNumbers = (accused ?? []).map((r) => (r.Accused ?? r).FIRNumber).filter(Boolean);
      if (!firNumbers.length) return 0;

      const list = firNumbers.slice(0, 50).map((f) => this._escape(f)).join(', ');
      const firs = await zql.executeZQLQuery(
        `SELECT COUNT(ROWID) FROM FIRs WHERE District = ${this._escape(district)} AND FIRNumber IN (${list})`
      );
      const firRow = firs?.[0]?.FIRs ?? firs?.[0] ?? {};
      return Number(firRow.COUNT ?? firRow['COUNT(ROWID)'] ?? Object.values(firRow)[0] ?? 0);
    } catch {
      return 0;
    }
  }
}
