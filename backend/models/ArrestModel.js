/**
 * @file ArrestModel.js
 * @description Arrest Record Domain Business Entity
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { BaseModel } from './BaseModel.js';

export class ArrestModel extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.arrestId = data.arrestId || null;
    this.accusedId = data.accusedId || null;
    this.firNumber = data.firNumber || null;
    this.arrestDate = data.arrestDate || null;
    this.arrestingOfficer = data.arrestingOfficer || null;
    this.detentionLocation = data.detentionLocation || null;
  }
}
