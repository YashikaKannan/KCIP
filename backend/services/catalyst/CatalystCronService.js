/**
 * @file CatalystCronService.js
 * @description Scheduled job definitions for Catalyst Cron
 * @author KCIP Engineering Team - Phase 5 Catalyst Integration
 * @version 1.0.0
 * @lastUpdated 2026-07-26
 */

import { LoggerUtil } from '../../utils/logger.js';
import { CatalystCacheService } from './CatalystCacheService.js';

export const KCIPCronJobs = Object.freeze({
  DAILY_HOTSPOT: 'daily_hotspot_calculation',
  WEEKLY_REPORTS: 'weekly_reports',
  MONTHLY_ANALYTICS: 'monthly_crime_analytics',
  DASHBOARD_CACHE_REFRESH: 'dashboard_cache_refresh'
});

export class CatalystCronService {
  /**
   * @param {object|null} catalystApp
   * @param {object} [deps] - wired services { hotspotService, reportService, analyticsService, dashboardService }
   */
  constructor(catalystApp = null, deps = {}) {
    this.catalystApp = catalystApp;
    this.deps = deps;
    this.cache = new CatalystCacheService(catalystApp);
  }

  setCatalystApp(catalystApp) {
    this.catalystApp = catalystApp;
    this.cache = new CatalystCacheService(catalystApp);
  }

  /**
   * Dispatch a cron job by name.
   * @param {string} jobName
   * @param {object} [params]
   * @returns {Promise<object>}
   */
  async run(jobName, params = {}) {
    LoggerUtil.info('[Cron] Job started', { jobName, params });
    try {
      switch (jobName) {
        case KCIPCronJobs.DAILY_HOTSPOT:
          return await this.dailyHotspotCalculation(params);
        case KCIPCronJobs.WEEKLY_REPORTS:
          return await this.weeklyReports(params);
        case KCIPCronJobs.MONTHLY_ANALYTICS:
          return await this.monthlyCrimeAnalytics(params);
        case KCIPCronJobs.DASHBOARD_CACHE_REFRESH:
          return await this.dashboardCacheRefresh(params);
        default:
          throw new Error(`Unknown cron job: ${jobName}`);
      }
    } catch (error) {
      LoggerUtil.error('[Cron] Job failed', { jobName, error: error.message });
      return { success: false, jobName, error: error.message };
    }
  }

  async dailyHotspotCalculation(params = {}) {
    const district = params.district || 'Bengaluru Urban';
    if (!this.deps.hotspotService) {
      return { success: false, jobName: KCIPCronJobs.DAILY_HOTSPOT, error: 'hotspotService missing' };
    }
    const hotspots = await this.deps.hotspotService.calculateAndStoreHotspots(district);
    return {
      success: true,
      jobName: KCIPCronJobs.DAILY_HOTSPOT,
      district,
      count: hotspots.length,
      hotspots
    };
  }

  async weeklyReports(params = {}) {
    if (!this.deps.reportService) {
      return { success: false, jobName: KCIPCronJobs.WEEKLY_REPORTS, error: 'reportService missing' };
    }
    const report = await this.deps.reportService.generateReport('WEEKLY', 'PDF', {
      district: params.district || 'ALL',
      generatedBy: 'CRON'
    });
    return { success: true, jobName: KCIPCronJobs.WEEKLY_REPORTS, report };
  }

  async monthlyCrimeAnalytics(params = {}) {
    if (!this.deps.analyticsService) {
      return { success: false, jobName: KCIPCronJobs.MONTHLY_ANALYTICS, error: 'analyticsService missing' };
    }
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    const startDate = start.toISOString().slice(0, 10);
    const endDate = end.toISOString().slice(0, 10);
    const trends = await this.deps.analyticsService.getCrimeTrends(
      params.district || 'ALL',
      startDate,
      endDate
    );
    const categories = await this.deps.analyticsService.getCrimeCategories(params.district);
    return {
      success: true,
      jobName: KCIPCronJobs.MONTHLY_ANALYTICS,
      trends,
      categories
    };
  }

  async dashboardCacheRefresh(params = {}) {
    if (!this.deps.dashboardService) {
      return {
        success: false,
        jobName: KCIPCronJobs.DASHBOARD_CACHE_REFRESH,
        error: 'dashboardService missing'
      };
    }
    const district = params.district || 'ALL';
    const metrics = await this.deps.dashboardService.getSummaryMetrics(district);
    const cacheKey = `dashboard:${district}`;
    await this.cache.put(cacheKey, metrics, params.ttlSeconds || 300);
    return {
      success: true,
      jobName: KCIPCronJobs.DASHBOARD_CACHE_REFRESH,
      cacheKey,
      metrics
    };
  }
}
