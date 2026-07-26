/**
 * @file RiskScoreHelper.js
 * @description Crime Risk Score Calculation Helper
 * @author KCIP Engineering Team
 * @version 1.0.0
 * @lastUpdated 2026-07-25
 */

export class RiskScoreHelper {
  static calculateRiskScore(factors = {}) {
    const { crimeFrequency = 0, violenceWeight = 0, offenderRepeatCount = 0 } = factors;
    const rawScore = (crimeFrequency * 0.4) + (violenceWeight * 0.4) + (offenderRepeatCount * 0.2);
    return Math.min(100, Math.max(0, Number(rawScore.toFixed(2))));
  }

  static getRiskLevel(score = 0) {
    if (score >= 80) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 40) return 'MEDIUM';
    if (score >= 20) return 'LOW';
    return 'NEGLIGIBLE';
  }

  static evaluateCrimeWeight(crimeType = '') {
    const weights = {
      MURDER: 10,
      DACOITY: 9,
      ROBBERY: 8,
      BURGLARY: 6,
      CYBER_CRIME: 5,
      THEFT: 4
    };
    return weights[crimeType] || 3;
  }
}
