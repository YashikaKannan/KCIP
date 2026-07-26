/**
 * @file FIRModel.js
 * @description FIR Domain Business Entity
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { BaseModel } from './BaseModel.js';

export class FIRModel extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.firNumber = data.firNumber || null;
    this.policeStation = data.policeStation || null;
    this.district = data.district || null;
    this.crimeType = data.crimeType || null;
    this.IPCSections = data.IPCSections || null;
    this.complainantName = data.complainantName || null;
    this.incidentDate = data.incidentDate || null;
    this.status = data.status || null;
  }
}
