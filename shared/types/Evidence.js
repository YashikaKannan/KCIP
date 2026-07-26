/**
 * @file Evidence.js
 * @description Legal Evidence Item Entity Definition
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

/**
 * @typedef {Object} Evidence
 * @property {string} id - Unique Identifier
 */

/**
 * Default empty object structure for Evidence.
 * @type {Readonly<Object>}
 */
export const defaultEvidence = Object.freeze({ evidenceId: '', firNumber: '', type: 'PHYSICAL', description: '', status: 'COLLECTED', collectedBy: '', chainOfCustody: [] });

/**
 * Example valid entity structure for Evidence.
 * @type {Readonly<Object>}
 */
export const exampleEvidence = Object.freeze({ evidenceId: 'EVD-302', firNumber: 'FIR/2026/BLR/0412', type: 'DIGITAL', description: 'CCTV Footage Koramangala Store', status: 'SEALED', collectedBy: 'KSP-4412', chainOfCustody: ['KSP-4412 logged at 2026-07-21'] });
