/**
 * @file PredictionResponse.js
 * @description AI Prediction Results Response DTO
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

/**
 * Data Transfer Object defining API payload structure.
 * Pure data structure with zero business logic or API calls.
 */
export const PredictionResponseDTO = Object.freeze({ predictionId: '', type: '', confidence: 0.0, details: {} });
