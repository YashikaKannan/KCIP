/**
 * @file Victim.js
 * @description Victim Entity Definition
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

/**
 * @typedef {Object} Victim
 * @property {string} id - Unique Identifier
 */

/**
 * Default empty object structure for Victim.
 * @type {Readonly<Object>}
 */
export const defaultVictim = Object.freeze({ id: '', firNumber: '', name: '', age: 0, gender: '', contactNumber: '' });

/**
 * Example valid entity structure for Victim.
 * @type {Readonly<Object>}
 */
export const exampleVictim = Object.freeze({ id: 'VIC-301', firNumber: 'FIR/2026/BLR/0412', name: 'Suresh Kumar', age: 34, gender: 'Male', contactNumber: '+919876543210' });
