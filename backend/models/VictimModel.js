/**
 * @file VictimModel.js
 * @description Victim Domain Business Entity
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { BaseModel } from './BaseModel.js';

export class VictimModel extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.firNumber = data.firNumber || null;
    this.name = data.name || null;
    this.age = data.age || null;
    this.gender = data.gender || null;
    this.contactNumber = data.contactNumber || null;
    this.statement = data.statement || null;
  }
}
