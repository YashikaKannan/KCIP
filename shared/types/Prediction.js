/**
 * @file Prediction.js
 * @description AI Crime Prediction Output Entity Definition
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

/**
 * @typedef {Object} Prediction
 * @property {string} id - Unique Identifier
 */

/**
 * Default empty object structure for Prediction.
 * @type {Readonly<Object>}
 */
export const defaultPrediction = Object.freeze({ predictionId: '', type: '', district: '', confidenceScore: 0.0, timeframe: '', riskLevel: 'LOW' });

/**
 * Example valid entity structure for Prediction.
 * @type {Readonly<Object>}
 */
export const examplePrediction = Object.freeze({ predictionId: 'PRED-7721', type: 'HOTSPOT_FORECAST', district: 'Bengaluru Urban', confidenceScore: 0.89, timeframe: 'NEXT_7_DAYS', riskLevel: 'CRITICAL' });
