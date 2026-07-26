/**
 * @file User.js
 * @description User Entity Definition
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

/**
 * @typedef {Object} User
 * @property {string} id - Unique Identifier
 */

/**
 * Default empty object structure for User.
 * @type {Readonly<Object>}
 */
export const defaultUser = Object.freeze({ id: '', name: '', email: '', role: 'ANALYST', district: '', isActive: true });

/**
 * Example valid entity structure for User.
 * @type {Readonly<Object>}
 */
export const exampleUser = Object.freeze({ id: 'usr-101', name: 'Inspector Kumar', email: 'kumar@ksp.gov.in', role: 'INVESTIGATION_OFFICER', district: 'Bengaluru Urban', isActive: true });
