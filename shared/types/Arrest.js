/**
 * @file Arrest.js
 * @description Arrest Record Entity Definition
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

/**
 * @typedef {Object} Arrest
 * @property {string} id - Unique Identifier
 */

/**
 * Default empty object structure for Arrest.
 * @type {Readonly<Object>}
 */
export const defaultArrest = Object.freeze({ arrestId: '', accusedId: '', firNumber: '', arrestDate: '', arrestingOfficer: '', detentionLocation: '' });

/**
 * Example valid entity structure for Arrest.
 * @type {Readonly<Object>}
 */
export const exampleArrest = Object.freeze({ arrestId: 'ARR-4091', accusedId: 'ACC-802', firNumber: 'FIR/2026/BLR/0412', arrestDate: '2026-07-22T08:15:00Z', arrestingOfficer: 'KSP-4412', detentionLocation: 'Koramangala Lockup' });
