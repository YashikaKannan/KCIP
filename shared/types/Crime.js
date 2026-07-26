/**
 * @file Crime.js
 * @description Crime Event Entity Definition
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

/**
 * @typedef {Object} Crime
 * @property {string} id - Unique Identifier
 */

/**
 * Default empty object structure for Crime.
 * @type {Readonly<Object>}
 */
export const defaultCrime = Object.freeze({ crimeId: '', title: '', category: '', type: '', severity: 'MODERATE', latitude: 0, longitude: 0, district: '' });

/**
 * Example valid entity structure for Crime.
 * @type {Readonly<Object>}
 */
export const exampleCrime = Object.freeze({ crimeId: 'CRM-1092', title: 'Night Burglary at Electronics Shop', category: 'PROPERTY_CRIME', type: 'BURGLARY', severity: 'HIGH', latitude: 12.9352, longitude: 77.6245, district: 'Bengaluru Urban' });
