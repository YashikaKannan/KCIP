/**
 * @file Accused.js
 * @description Accused / Suspect Entity Definition
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

/**
 * @typedef {Object} Accused
 * @property {string} id - Unique Identifier
 */

/**
 * Default empty object structure for Accused.
 * @type {Readonly<Object>}
 */
export const defaultAccused = Object.freeze({ id: '', firNumber: '', name: '', alias: '', age: 0, status: 'SUSPECT', riskLevel: 'MEDIUM' });

/**
 * Example valid entity structure for Accused.
 * @type {Readonly<Object>}
 */
export const exampleAccused = Object.freeze({ id: 'ACC-802', firNumber: 'FIR/2026/BLR/0412', name: 'Ramesh Singh', alias: 'Ramu', age: 29, status: 'ARRESTED', riskLevel: 'HIGH' });
