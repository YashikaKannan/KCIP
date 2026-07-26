/**
 * @file FIR.js
 * @description First Information Report Entity Definition
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

/**
 * @typedef {Object} FIR
 * @property {string} id - Unique Identifier
 */

/**
 * Default empty object structure for FIR.
 * @type {Readonly<Object>}
 */
export const defaultFIR = Object.freeze({ firNumber: '', policeStation: '', district: '', crimeType: '', IPCSections: [], status: 'REGISTERED', incidentDate: '' });

/**
 * Example valid entity structure for FIR.
 * @type {Readonly<Object>}
 */
export const exampleFIR = Object.freeze({ firNumber: 'FIR/2026/BLR/0412', policeStation: 'Koramangala', district: 'Bengaluru Urban', crimeType: 'BURGLARY', IPCSections: ['379', '457'], status: 'UNDER_INVESTIGATION', incidentDate: '2026-07-20T14:30:00Z' });
