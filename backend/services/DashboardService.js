/**
 * @file DashboardService.js
 * @description Dashboard Analytics Aggregation Service — Catalyst Data Store backed
 * @author KCIP Backend Engineering Team
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { BaseService } from './BaseService.js';
import { MapperUtil } from '../utils/mapper.js';

export class DashboardService extends BaseService {
  constructor(repository = null) {
    super(repository);
  }

  /**
   * Aggregate KPI summary for a district or statewide.
   * @param {string} [district='ALL']
   * @returns {Promise<object>}
   */
  async getSummaryMetrics(district = 'ALL') {
    const repo = this.requireRepository();
    const scope = !district || district === 'ALL' ? undefined : district;
    const metrics = await repo.getDistrictMetrics(scope);

    return {
      district: metrics.district || district || 'ALL',
      totalFIRs: metrics.totalFIRs ?? 0,
      todaysFIRs: metrics.todaysFIRs ?? 0,
      pendingInvestigation: metrics.pendingInvestigation ?? 0,
      activeInvestigations: metrics.pendingInvestigation ?? 0,
      arrests: metrics.arrests ?? 0,
      victims: metrics.victims ?? 0,
      totalHotspots: metrics.totalHotspots ?? 0,
      highRiskSuspects: metrics.highRiskSuspects ?? 0,
      crimeCategories: MapperUtil.fromDataStoreMany(metrics.crimeCategories || []),
      districtStatistics: MapperUtil.fromDataStoreMany(metrics.districtStatistics || []),
      lastUpdated: metrics.lastUpdated || new Date().toISOString()
    };
  }

  /**
   * District-level statistics only.
   * @param {string} [district]
   */
  async getDistrictStatistics(district) {
    const summary = await this.getSummaryMetrics(district || 'ALL');
    return {
      district: summary.district,
      districtStatistics: summary.districtStatistics,
      totalFIRs: summary.totalFIRs,
      lastUpdated: summary.lastUpdated
    };
  }
}
