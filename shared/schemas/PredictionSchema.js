/**
 * @file PredictionSchema.js
 * @description Prediction Structure Schema Placeholder
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

/**
 * Schema placeholder describing expected object structure for Prediction.
 * Generic schema definition; NOT a database model or ORM schema.
 */
export const PredictionSchema = Object.freeze({
  entity: 'Prediction',
  version: 1,
  fields: {
    id: { type: 'string', required: true },
    createdAt: { type: 'string', required: true },
    updatedAt: { type: 'string', required: false }
  }
});
