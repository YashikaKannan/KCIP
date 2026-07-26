/**
 * @file BaseModel.js
 * @description Base Business Domain Model
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export class BaseModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  toJSON() {
    return { ...this };
  }

  validate() {
    return { isValid: true, errors: [] };
  }
}
