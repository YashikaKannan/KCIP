/**
 * @file AccusedModel.js
 * @description Accused Domain Business Entity
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { BaseModel } from './BaseModel.js';

export class AccusedModel extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.firNumber = data.firNumber || null;
    this.name = data.name || null;
    this.alias = data.alias || null;
    this.age = data.age || null;
    this.status = data.status || null;
    this.riskLevel = data.riskLevel || null;
  }
}
