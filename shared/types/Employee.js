/**
 * @file Employee.js
 * @description Employee / Police Officer Entity Definition
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

/**
 * @typedef {Object} Employee
 * @property {string} id - Unique Identifier
 */

/**
 * Default empty object structure for Employee.
 * @type {Readonly<Object>}
 */
export const defaultEmployee = Object.freeze({ id: '', badgeNumber: '', name: '', rank: 'PSI', district: '', station: '' });

/**
 * Example valid entity structure for Employee.
 * @type {Readonly<Object>}
 */
export const exampleEmployee = Object.freeze({ id: 'EMP-9921', badgeNumber: 'KSP-4412', name: 'Rajesh Gowda', rank: 'Police Inspector', district: 'Bengaluru Urban', station: 'Koramangala PS' });
