/**
 * @file DashboardModel.js
 * @description Dashboard Metrics Business Entity
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { BaseModel } from './BaseModel.js';

export class DashboardModel extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.district = data.district || null;
    this.totalFIRs = data.totalFIRs || null;
    this.activeInvestigations = data.activeInvestigations || null;
    this.totalHotspots = data.totalHotspots || null;
    this.highRiskSuspects = data.highRiskSuspects || null;
    this.lastUpdated = data.lastUpdated || null;
  }
}
