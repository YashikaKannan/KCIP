/**
 * @file ReportModel.js
 * @description Intelligence Report Business Entity
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { BaseModel } from './BaseModel.js';

export class ReportModel extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.reportId = data.reportId || null;
    this.type = data.type || null;
    this.title = data.title || null;
    this.format = data.format || null;
    this.generatedBy = data.generatedBy || null;
    this.generatedAt = data.generatedAt || null;
    this.fileUrl = data.fileUrl || null;
  }
}
