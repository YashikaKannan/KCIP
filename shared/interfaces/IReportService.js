/**
 * @file IReportService.js
 * @description Report Generation Service Interface Contract
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

/**
 * Interface contract for IReportService.
 * Defines standard method signatures without concrete backend logic.
 */
export class IReportService {
  /**
   * Method contract for generateReport(reportType, parameters)
   */
  generateReport(reportType, parameters) {
    throw new Error('Method generateReport(reportType, parameters) must be implemented.');
  }
  /**
   * Method contract for getReportById(reportId)
   */
  getReportById(reportId) {
    throw new Error('Method getReportById(reportId) must be implemented.');
  }
  /**
   * Method contract for listReports(filters)
   */
  listReports(filters) {
    throw new Error('Method listReports(filters) must be implemented.');
  }
}
