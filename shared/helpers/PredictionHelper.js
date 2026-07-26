/**
 * @file PredictionHelper.js
 * @description Prediction Utilities and Trend Calculation
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export class PredictionHelper {
  static calculateTrendDirection(series = []) {
    if (series.length < 2) return 'STABLE';
    const last = series[series.length - 1];
    const prev = series[series.length - 2];
    if (last > prev) return 'INCREASING';
    if (last < prev) return 'DECREASING';
    return 'STABLE';
  }

  static normalizePredictionConfidence(score = 0) {
    return Math.min(1.0, Math.max(0.0, Number(score)));
  }

  static aggregateHotspotScores(hotspots = []) {
    if (hotspots.length === 0) return 0;
    const total = hotspots.reduce((acc, h) => acc + (h.riskScore || 0), 0);
    return Math.round((total / hotspots.length) * 100) / 100;
  }
}
