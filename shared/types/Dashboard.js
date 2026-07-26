/**
 * @file Dashboard.js
 * @description Aggregated Dashboard Metrics Entity Definition
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

/**
 * @typedef {Object} Dashboard
 * @property {string} id - Unique Identifier
 */

/**
 * Default empty object structure for Dashboard.
 * @type {Readonly<Object>}
 */
export const defaultDashboard = Object.freeze({ district: 'ALL', totalFIRs: 0, activeInvestigations: 0, totalHotspots: 0, highRiskSuspects: 0, lastUpdated: '' });

/**
 * Example valid entity structure for Dashboard.
 * @type {Readonly<Object>}
 */
export const exampleDashboard = Object.freeze({ district: 'Bengaluru Urban', totalFIRs: 1420, activeInvestigations: 310, totalHotspots: 18, highRiskSuspects: 45, lastUpdated: '2026-07-25T12:00:00Z' });
