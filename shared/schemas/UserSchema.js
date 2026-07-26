/**
 * @file UserSchema.js
 * @description User Structure Schema Placeholder
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

/**
 * Schema placeholder describing expected object structure for User.
 * Generic schema definition; NOT a database model or ORM schema.
 */
export const UserSchema = Object.freeze({
  entity: 'User',
  version: 1,
  fields: {
    id: { type: 'string', required: true },
    createdAt: { type: 'string', required: true },
    updatedAt: { type: 'string', required: false }
  }
});
