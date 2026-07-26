/**
 * @file ChargesheetModel.js
 * @description Chargesheet Domain Business Entity
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { BaseModel } from './BaseModel.js';

export class ChargesheetModel extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.chargesheetNumber = data.chargesheetNumber || null;
    this.firNumber = data.firNumber || null;
    this.filingDate = data.filingDate || null;
    this.courtName = data.courtName || null;
    this.accusedList = data.accusedList || null;
    this.IPCSections = data.IPCSections || null;
  }
}
