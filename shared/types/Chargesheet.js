/**
 * @file Chargesheet.js
 * @description Chargesheet Legal Document Entity Definition
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

/**
 * @typedef {Object} Chargesheet
 * @property {string} id - Unique Identifier
 */

/**
 * Default empty object structure for Chargesheet.
 * @type {Readonly<Object>}
 */
export const defaultChargesheet = Object.freeze({ chargesheetNumber: '', firNumber: '', filingDate: '', courtName: '', accusedList: [], IPCSections: [] });

/**
 * Example valid entity structure for Chargesheet.
 * @type {Readonly<Object>}
 */
export const exampleChargesheet = Object.freeze({ chargesheetNumber: 'CS/2026/881', firNumber: 'FIR/2026/BLR/0412', filingDate: '2026-07-24T11:00:00Z', courtName: '1st ACMM Court Bengaluru', accusedList: ['ACC-802'], IPCSections: ['379', '457'] });
