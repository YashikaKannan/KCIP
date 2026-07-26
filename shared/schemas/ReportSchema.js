/**
 * @file ReportSchema.js
 * @description Report Structure Schema Placeholder
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

/**
 * Schema placeholder describing expected object structure for Report.
 * Generic schema definition; NOT a database model or ORM schema.
 */
export const ReportSchema = Object.freeze({
  entity: 'Report',
  version: 1,
  fields: {
    id: { type: 'string', required: true },
    createdAt: { type: 'string', required: true },
    updatedAt: { type: 'string', required: false }
  }
});
