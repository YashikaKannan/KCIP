/**
 * @file CatalystCircuitsService.js
 * @description Zoho Catalyst Circuits Workflow Adapter
 * @author KCIP Engineering Team - Phase 5 Catalyst Integration
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { LoggerUtil } from '../../utils/logger.js';

/** Named KCIP circuit workflows */
export const KCIPCircuits = Object.freeze({
  NEW_FIR_WORKFLOW: 'KCIP_NEW_FIR_WORKFLOW'
});

export class CatalystCircuitsService {
  constructor(catalystApp = null) {
    this.catalystApp = catalystApp;
  }

  setCatalystApp(catalystApp) {
    this.catalystApp = catalystApp;
  }

  /**
   * Execute a Catalyst Circuit by ID.
   * @param {string} circuitId
   * @param {object} [payload]
   * @returns {Promise<object>}
   */
  async executeCircuit(circuitId, payload = {}) {
    LoggerUtil.info(`[CatalystCircuits] Triggering Circuit: ${circuitId}`, {
      keys: Object.keys(payload)
    });

    try {
      if (this.catalystApp && typeof this.catalystApp.circuits === 'function') {
        const circuits = this.catalystApp.circuits();
        if (circuits && typeof circuits.execute === 'function') {
          return await circuits.execute(circuitId, payload);
        }
        if (circuits && typeof circuits.executeCircuit === 'function') {
          return await circuits.executeCircuit(circuitId, payload);
        }
      }
    } catch (error) {
      LoggerUtil.error('[CatalystCircuits] execute failed', {
        circuitId,
        error: error.message
      });
      return {
        executionId: `exec-error-${Date.now()}`,
        circuitId,
        status: 'FAILED',
        error: error.message
      };
    }

    return {
      executionId: `exec-${Date.now()}`,
      circuitId,
      status: 'RUNNING',
      payload,
      _offline: true
    };
  }

  /**
   * New FIR workflow:
   * New FIR → AI Analysis → Prediction → Generate Report → Notify Officer → Dashboard Refresh
   * @param {object} firRecord
   * @param {object} [handlers] - optional local step runners when Circuits offline
   * @returns {Promise<object>}
   */
  async runNewFIRWorkflow(firRecord, handlers = {}) {
    const input = {
      firNumber: firRecord.firNumber || firRecord.FIRNumber,
      district: firRecord.district || firRecord.District,
      crimeType: firRecord.crimeType || firRecord.CrimeType
    };

    const circuitResult = await this.executeCircuit(KCIPCircuits.NEW_FIR_WORKFLOW, input);
    const localSteps = [];

    const run = async (name, fn) => {
      if (typeof fn !== 'function') {
        localSteps.push({ name, status: 'SKIPPED' });
        return null;
      }
      try {
        const data = await fn(input);
        localSteps.push({ name, status: 'SUCCESS', data });
        return data;
      } catch (error) {
        localSteps.push({ name, status: 'FAILED', error: error.message });
        return null;
      }
    };

    await run('AI_ANALYSIS', handlers.aiAnalysis);
    await run('PREDICTION', handlers.prediction);
    await run('GENERATE_REPORT', handlers.generateReport);
    await run('NOTIFY_OFFICER', handlers.notifyOfficer);
    await run('DASHBOARD_REFRESH', handlers.dashboardRefresh);

    return {
      circuit: circuitResult,
      localSteps,
      workflow: KCIPCircuits.NEW_FIR_WORKFLOW
    };
  }
}
