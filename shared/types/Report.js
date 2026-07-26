/**
 * @file Report.js
 * @description Generated Intelligence Report Entity Definition
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

/**
 * @typedef {Object} Report
 * @property {string} id - Unique Identifier
 */

/**
 * Default empty object structure for Report.
 * @type {Readonly<Object>}
 */
export const defaultReport = Object.freeze({ reportId: '', type: 'CRIME_TREND_ANALYSIS', title: '', format: 'PDF', generatedBy: '', generatedAt: '', fileUrl: '' });

/**
 * Example valid entity structure for Report.
 * @type {Readonly<Object>}
 */
export const exampleReport = Object.freeze({ reportId: 'REP-5011', type: 'CRIME_TREND_ANALYSIS', title: 'Q2 Bengaluru Property Crime Report', format: 'PDF', generatedBy: 'usr-101', generatedAt: '2026-07-25T09:00:00Z', fileUrl: '/reports/REP-5011.pdf' });
