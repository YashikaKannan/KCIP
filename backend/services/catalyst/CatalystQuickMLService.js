/**
 * @file CatalystQuickMLService.js
 * @description Zoho Catalyst QuickML adapter for crime intelligence ML tasks
 * @author KCIP Engineering Team - Phase 5 Catalyst Integration
 * @version 1.0.0
 * @lastUpdated 2026-07-26
 */

import { LoggerUtil } from '../../utils/logger.js';

export class CatalystQuickMLService {
  /**
   * @param {object|null} catalystApp
   * @param {object} [options]
   * @param {string} [options.endpoint]
   */
  constructor(catalystApp = null, options = {}) {
    this.catalystApp = catalystApp;
    this.endpoint = options.endpoint || process.env.KCIP_QUICKML_URL || null;
  }

  setCatalystApp(catalystApp) {
    this.catalystApp = catalystApp;
  }

  /**
   * Invoke QuickML model endpoint or Catalyst ML integration.
   * @param {string} modelName
   * @param {object} features
   * @returns {Promise<object>}
   */
  async predict(modelName, features = {}) {
    try {
      if (this.endpoint) {
        const response = await fetch(this.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: modelName, features })
        });
        if (!response.ok) throw new Error(`QuickML HTTP ${response.status}`);
        return await response.json();
      }

      if (this.catalystApp && typeof this.catalystApp.ml === 'function') {
        const ml = this.catalystApp.ml();
        if (ml && typeof ml.predict === 'function') {
          return await ml.predict(modelName, features);
        }
      }
    } catch (error) {
      LoggerUtil.warn('[QuickML] predict failed — heuristic fallback', {
        modelName,
        error: error.message
      });
    }

    return null;
  }

  /**
   * Crime similarity between two case feature vectors.
   * @param {object} caseA
   * @param {object} caseB
   * @returns {Promise<object>}
   */
  async crimeSimilarity(caseA, caseB) {
    const ml = await this.predict('crime_similarity', { caseA, caseB });
    if (ml) return ml;

    const score = this._jaccard(
      this._tokens(caseA),
      this._tokens(caseB)
    );
    return {
      model: 'crime_similarity',
      similarity: score,
      match: score >= 0.55,
      source: 'HEURISTIC'
    };
  }

  /**
   * Recommend related cases for an FIR.
   * @param {object} fir
   * @param {object[]} candidates
   * @returns {Promise<object>}
   */
  async caseRecommendation(fir, candidates = []) {
    const ml = await this.predict('case_recommendation', { fir, candidates });
    if (ml) return ml;

    const ranked = candidates
      .map((c) => ({
        case: c,
        score: this._jaccard(this._tokens(fir), this._tokens(c))
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return {
      model: 'case_recommendation',
      recommendations: ranked,
      source: 'HEURISTIC'
    };
  }

  /**
   * Discover patterns across a set of FIRs.
   * @param {object[]} firs
   * @returns {Promise<object>}
   */
  async patternDiscovery(firs = []) {
    const ml = await this.predict('pattern_discovery', { firs });
    if (ml) return ml;

    const byCrime = {};
    const byStation = {};
    for (const fir of firs) {
      const ct = fir.crimeType || fir.CrimeType || 'UNKNOWN';
      const ps = fir.policeStation || fir.PoliceStation || 'UNKNOWN';
      byCrime[ct] = (byCrime[ct] || 0) + 1;
      byStation[ps] = (byStation[ps] || 0) + 1;
    }

    return {
      model: 'pattern_discovery',
      patterns: {
        topCrimeTypes: Object.entries(byCrime).sort((a, b) => b[1] - a[1]).slice(0, 5),
        topStations: Object.entries(byStation).sort((a, b) => b[1] - a[1]).slice(0, 5)
      },
      sampleSize: firs.length,
      source: 'HEURISTIC'
    };
  }

  /**
   * Repeat offender likelihood for an accused profile.
   * @param {object} accused
   * @param {object[]} history
   * @returns {Promise<object>}
   */
  async repeatOffenderPrediction(accused, history = []) {
    const ml = await this.predict('repeat_offender', { accused, history });
    if (ml) return ml;

    const firCount = new Set(
      history.map((h) => h.firNumber || h.FIRNumber).filter(Boolean)
    ).size;
    const probability = Math.min(0.95, 0.2 + firCount * 0.15);
    return {
      model: 'repeat_offender',
      accusedName: accused.name || accused.Name,
      priorFIRCount: firCount,
      probability: Number(probability.toFixed(3)),
      riskLevel: probability >= 0.7 ? 'HIGH' : probability >= 0.4 ? 'MEDIUM' : 'LOW',
      source: 'HEURISTIC'
    };
  }

  _tokens(obj = {}) {
    const text = [
      obj.crimeType || obj.CrimeType,
      obj.district || obj.District,
      obj.policeStation || obj.PoliceStation,
      obj.ipcSections || obj.IPCSections,
      obj.name || obj.Name
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return new Set(text.split(/[^a-z0-9]+/).filter(Boolean));
  }

  _jaccard(a, b) {
    if (!a.size && !b.size) return 0;
    let inter = 0;
    for (const t of a) if (b.has(t)) inter += 1;
    const union = a.size + b.size - inter;
    return union === 0 ? 0 : Number((inter / union).toFixed(3));
  }
}
