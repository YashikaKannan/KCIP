/**
 * @file CatalystAccusedRepository.js
 * @description Catalyst Accused Data Store Repository
 * @author KCIP Engineering Team - Phase 5 Catalyst Integration
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { CatalystDataStoreRepository } from './CatalystDataStoreRepository.js';
import { repositoryConfig } from '../../config/repositoryConfig.js';

export class CatalystAccusedRepository extends CatalystDataStoreRepository {
  constructor(catalystApp = null) {
    super('Accused', catalystApp);
  }

  /**
   * All accused linked to an FIR.
   * @param {string} firNumber
   * @returns {Promise<object[]>}
   */
  async findByFirNumber(firNumber) {
    return this.findByField('FIRNumber', firNumber);
  }

  /**
   * High-risk suspects, optionally scoped to a district via related FIR filter.
   * When district is provided, filters RiskLevel HIGH and returns matching accused.
   * @param {string} [district]
   * @returns {Promise<object[]>}
   */
  async findHighRiskSuspects(district) {
    const highRisk = await this.search({
      RiskLevel: { $in: ['HIGH', 'CRITICAL', 'High', 'Critical'] }
    });

    if (!district) return highRisk;

    // Accused table has no District column in datastore-schema; join via FIR numbers.
    const firRepoTable = 'FIRs';
    const zql = this._zql();
    if (!zql) {
      return highRisk.filter((r) => r.District === district);
    }

    try {
      const firs = await zql.executeZQLQuery(
        `SELECT FIRNumber FROM ${firRepoTable} WHERE District = ${this._escape(district)}`
      );
      const firNumbers = new Set(
        (firs ?? []).map((r) => (r[firRepoTable] ?? r).FIRNumber).filter(Boolean)
      );
      return highRisk.filter((a) => firNumbers.has(a.FIRNumber));
    } catch {
      return highRisk;
    }
  }

  /**
   * @param {string} query
   * @param {object} [options]
   */
  async searchAccused(query, options = {}) {
    return this.findAll({
      ...options,
      search: query,
      searchFields: ['Name', 'Alias', 'FIRNumber']
    });
  }

  /**
   * Repeat offenders = same Name appearing on multiple FIRs.
   * @returns {Promise<object[]>}
   */
  async findRepeatOffenders() {
    const all = await this.findAll({
      paginated: false,
      pageSize: repositoryConfig.maxPageSize,
      limit: 500
    });
    const rows = Array.isArray(all) ? all : all.data;
    const byName = new Map();

    for (const row of rows) {
      const key = String(row.Name || '').trim().toLowerCase();
      if (!key) continue;
      if (!byName.has(key)) byName.set(key, []);
      byName.get(key).push(row);
    }

    return [...byName.values()]
      .filter((group) => {
        const firs = new Set(group.map((g) => g.FIRNumber));
        return firs.size > 1;
      })
      .map((group) => ({
        name: group[0].Name,
        firCount: new Set(group.map((g) => g.FIRNumber)).size,
        records: group
      }));
  }
}
