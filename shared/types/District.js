/**
 * @file District.js
 * @description District Administrative Profile Entity Definition
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

/**
 * @typedef {Object} District
 * @property {string} id - Unique Identifier
 */

/**
 * Default empty object structure for District.
 * @type {Readonly<Object>}
 */
export const defaultDistrict = Object.freeze({ name: '', code: '', hqStation: '', totalStations: 0, riskLevel: 'LOW' });

/**
 * Example valid entity structure for District.
 * @type {Readonly<Object>}
 */
export const exampleDistrict = Object.freeze({ name: 'Bengaluru Urban', code: 'BLR_U', hqStation: 'Commissionerate Office', totalStations: 108, riskLevel: 'HIGH' });
