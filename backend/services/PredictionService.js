/**
 * @file PredictionService.js
 * @description AI Crime Prediction Business Service — AppSail + Data Store
 * @author KCIP Backend Engineering Team
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { BaseService } from './BaseService.js';
import { MapperUtil } from '../utils/mapper.js';
import { LoggerUtil } from '../utils/logger.js';
import { serviceConfig } from '../config/serviceConfig.js';

export class PredictionService extends BaseService {
  /**
   * @param {object|null} repository
   * @param {object} [options]
   * @param {string} [options.appSailEndpoint] - AppSail AI prediction endpoint URL
   * @param {object|null} [options.catalystApp]
   */
  constructor(repository = null, options = {}) {
    super(repository);
    this.appSailEndpoint =
      options.appSailEndpoint ||
      process.env.KCIP_APPSAIL_PREDICTION_URL ||
      null;
    this.catalystApp = options.catalystApp || null;
  }

  setCatalystApp(catalystApp) {
    super.setCatalystApp(catalystApp);
    this.catalystApp = catalystApp;
  }

  _generatePredictionId() {
    return `PRED-${Date.now()}`;
  }

  _riskFromConfidence(score) {
    if (score >= 0.85) return 'CRITICAL';
    if (score >= 0.7) return 'HIGH';
    if (score >= 0.45) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Call AppSail AI endpoint when configured; otherwise use heuristic fallback.
   * @param {string} district
   * @param {string} type
   * @param {object} [context]
   * @returns {Promise<object>}
   */
  async _invokeAppSail(district, type, context = {}) {
    if (!this.appSailEndpoint) {
      return null;
    }

    try {
      const response = await fetch(this.appSailEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ district, type, ...context })
      });

      if (!response.ok) {
        throw new Error(`AppSail responded with ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      LoggerUtil.warn('[PredictionService] AppSail call failed — using heuristic', {
        error: error.message,
        endpoint: this.appSailEndpoint
      });
      return null;
    }
  }

  /**
   * Heuristic prediction when AppSail is unavailable (offline / local).
   * @param {string} district
   * @param {string} type
   */
  async _heuristicPrediction(district, type) {
    let firCount = 0;
    try {
      if (this.repository?.catalystApp || this.catalystApp) {
        // Soft dependency: count recent FIRs via ZQL if repository exposes count
        if (typeof this.repository.count === 'function') {
          // Predictions repo counts Predictions table — not ideal; leave heuristic score
        }
      }
    } catch {
      // ignore
    }

    const base = 0.55 + Math.min(0.35, firCount / 100);
    const confidenceScore = Number(base.toFixed(3));
    return {
      predictionId: this._generatePredictionId(),
      district,
      type,
      confidenceScore,
      timeframe: 'NEXT_7_DAYS',
      riskLevel: this._riskFromConfidence(confidenceScore),
      source: 'HEURISTIC'
    };
  }

  /**
   * Generate a prediction, persist to Predictions table, return domain object.
   * @param {string} district
   * @param {string} type
   * @param {object} [context]
   * @returns {Promise<object>}
   */
  async generatePrediction(district, type, context = {}) {
    const repo = this.requireRepository();
    if (!district || !type) {
      throw new Error('District and Prediction Type required.');
    }

    const aiResult = await this._invokeAppSail(district, type, context);
    const prediction = aiResult
      ? {
          predictionId: aiResult.predictionId || this._generatePredictionId(),
          district,
          type: aiResult.type || type,
          confidenceScore: Number(aiResult.confidenceScore ?? aiResult.confidence ?? 0.75),
          timeframe: aiResult.timeframe || 'NEXT_7_DAYS',
          riskLevel:
            aiResult.riskLevel ||
            this._riskFromConfidence(Number(aiResult.confidenceScore ?? aiResult.confidence ?? 0.75)),
          source: 'APPSAIL'
        }
      : await this._heuristicPrediction(district, type);

    if (prediction.confidenceScore < serviceConfig.predictionConfidenceThreshold) {
      LoggerUtil.info('[PredictionService] Low-confidence prediction', {
        district,
        type,
        confidenceScore: prediction.confidenceScore
      });
    }

    const row = MapperUtil.toDataStore({
      predictionId: prediction.predictionId,
      district: prediction.district,
      predictionType: prediction.type,
      confidenceScore: prediction.confidenceScore,
      riskLevel: prediction.riskLevel
    });

    try {
      const saved = await repo.create(row);
      return {
        ...MapperUtil.fromDataStore(saved),
        timeframe: prediction.timeframe,
        source: prediction.source,
        type: prediction.type
      };
    } catch (error) {
      this.logError('generatePrediction', error, { district, type });
      // Still return computed prediction if persist fails
      return { ...prediction, persistError: error.message };
    }
  }

  async getLatestByDistrict(district) {
    const repo = this.requireRepository();
    if (!district) throw new Error('District is required.');
    const row = await repo.findLatestByDistrict(district);
    return MapperUtil.fromDataStore(row);
  }

  async getByType(predictionType) {
    const repo = this.requireRepository();
    return MapperUtil.fromDataStoreMany(await repo.findByType(predictionType));
  }

  async listPredictions(options = {}) {
    const repo = this.requireRepository();
    const result = await repo.findAll(options);
    if (Array.isArray(result)) {
      return { data: MapperUtil.fromDataStoreMany(result) };
    }
    return { ...result, data: MapperUtil.fromDataStoreMany(result.data || []) };
  }
}
