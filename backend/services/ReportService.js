/**
 * @file ReportService.js
 * @description Intelligence Report Generation Service — SmartBrowz + Data Store
 * @author KCIP Backend Engineering Team
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { BaseService } from './BaseService.js';
import { MapperUtil } from '../utils/mapper.js';
import { LoggerUtil } from '../utils/logger.js';

const SUPPORTED_TYPES = Object.freeze([
  'DAILY',
  'WEEKLY',
  'DISTRICT',
  'REPEAT_OFFENDER',
  'CRIME_TREND'
]);

export class ReportService extends BaseService {
  /**
   * @param {object|null} repository
   * @param {object} [options]
   * @param {string} [options.smartBrowzEndpoint]
   * @param {object|null} [options.catalystApp]
   */
  constructor(repository = null, options = {}) {
    super(repository);
    this.smartBrowzEndpoint =
      options.smartBrowzEndpoint ||
      process.env.KCIP_SMARTBROWZ_URL ||
      null;
    this.catalystApp = options.catalystApp || null;
  }

  setCatalystApp(catalystApp) {
    super.setCatalystApp(catalystApp);
    this.catalystApp = catalystApp;
  }

  _generateReportId() {
    return `REP-${Date.now()}`;
  }

  /**
   * Attempt SmartBrowz PDF generation; return URL or null.
   * @param {object} payload
   * @returns {Promise<string|null>}
   */
  async _generateWithSmartBrowz(payload) {
    if (!this.smartBrowzEndpoint && !(this.catalystApp && typeof this.catalystApp.smartbrowz === 'function')) {
      return null;
    }

    try {
      if (this.catalystApp && typeof this.catalystApp.smartbrowz === 'function') {
        const sb = this.catalystApp.smartbrowz();
        if (sb && typeof sb.convertToPdf === 'function') {
          const pdf = await sb.convertToPdf({
            html: payload.html,
            pdf_options: { format: 'A4' }
          });
          return pdf?.url || pdf?.download_url || null;
        }
      }

      if (this.smartBrowzEndpoint) {
        const response = await fetch(this.smartBrowzEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`SmartBrowz HTTP ${response.status}`);
        const body = await response.json();
        return body.url || body.downloadUrl || body.fileUrl || null;
      }
    } catch (error) {
      LoggerUtil.warn('[ReportService] SmartBrowz generation failed', {
        error: error.message
      });
    }
    return null;
  }

  _buildHtml(reportType, meta = {}) {
    return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>KCIP ${reportType} Report</title>
<style>
  body{font-family:Georgia,serif;margin:40px;color:#1a1a1a}
  h1{font-size:22px;border-bottom:2px solid #0b3d2e;padding-bottom:8px}
  .meta{color:#555;font-size:13px;margin-bottom:24px}
  table{width:100%;border-collapse:collapse;margin-top:16px}
  th,td{border:1px solid #ddd;padding:8px;text-align:left;font-size:13px}
  th{background:#0b3d2e;color:#fff}
</style></head>
<body>
  <h1>Karnataka Crime Intelligence Platform</h1>
  <h2>${reportType.replace(/_/g, ' ')} Report</h2>
  <div class="meta">Generated: ${new Date().toISOString()} | District: ${meta.district || 'ALL'}</div>
  <p>Official intelligence report for Karnataka State Police.</p>
  <pre>${JSON.stringify(meta.data || {}, null, 2)}</pre>
</body></html>`;
  }

  /**
   * @param {string} reportType
   * @param {string} [format='PDF']
   * @param {object} [options]
   * @returns {Promise<object>}
   */
  async generateReport(reportType, format = 'PDF', options = {}) {
    const repo = this.requireRepository();
    if (!reportType) throw new Error('Report Type is required.');

    const normalized = String(reportType).toUpperCase();
    if (!SUPPORTED_TYPES.includes(normalized)) {
      throw new Error(
        `Unsupported report type: ${reportType}. Supported: ${SUPPORTED_TYPES.join(', ')}`
      );
    }

    const reportId = this._generateReportId();
    const html = this._buildHtml(normalized, options);
    const fileUrl =
      (await this._generateWithSmartBrowz({
        reportType: normalized,
        format,
        html,
        ...options
      })) || `/reports/${reportId}.${String(format).toLowerCase()}`;

    const row = MapperUtil.toDataStore({
      reportId,
      type: normalized,
      title: options.title || `${normalized} Report`,
      format: String(format).toUpperCase(),
      generatedBy: options.generatedBy || 'SYSTEM',
      fileUrl
    });

    try {
      const saved = await repo.create(row);
      const mapped = MapperUtil.fromDataStore(saved);
      return {
        ...mapped,
        reportType: normalized,
        downloadUrl: mapped.fileUrl || fileUrl
      };
    } catch (error) {
      this.logError('generateReport', error, { reportType: normalized });
      return {
        reportId,
        reportType: normalized,
        format,
        downloadUrl: fileUrl,
        persistError: error.message
      };
    }
  }

  async getByReportId(reportId) {
    const repo = this.requireRepository();
    const row = await repo.findByReportId(reportId);
    if (!row) {
      const err = new Error(`Report not found: ${reportId}`);
      err.statusCode = 404;
      throw err;
    }
    return MapperUtil.fromDataStore(row);
  }

  async getByType(type) {
    const repo = this.requireRepository();
    return MapperUtil.fromDataStoreMany(await repo.findByType(type));
  }
}
