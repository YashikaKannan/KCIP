/**
 * @file HotspotModel.js
 * @description Geospatial Crime Hotspot Business Entity
 * @author KCIP Backend Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

import { BaseModel } from './BaseModel.js';

export class HotspotModel extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.hotspotId = data.hotspotId || null;
    this.district = data.district || null;
    this.centerLat = data.centerLat || null;
    this.centerLng = data.centerLng || null;
    this.radiusMeters = data.radiusMeters || null;
    this.riskScore = data.riskScore || null;
    this.crimeCount = data.crimeCount || null;
  }
}
