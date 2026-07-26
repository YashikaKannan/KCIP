/**
 * @file PredictionModel.js
 * @description AI Crime Prediction Business Entity
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { BaseModel } from './BaseModel.js';

export class PredictionModel extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.predictionId = data.predictionId || null;
    this.type = data.type || null;
    this.district = data.district || null;
    this.confidenceScore = data.confidenceScore || null;
    this.timeframe = data.timeframe || null;
    this.riskLevel = data.riskLevel || null;
  }
}
