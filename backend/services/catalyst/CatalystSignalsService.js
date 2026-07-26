/**
 * @file CatalystSignalsService.js
 * @description Zoho Catalyst Signals Event Bus Adapter — FIR-driven pipeline
 * @author KCIP Engineering Team - Phase 5 Catalyst Integration
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

import { LoggerUtil } from '../../utils/logger.js';

/** Canonical KCIP signal names */
export const KCIPSignals = Object.freeze({
  FIR_INSERTED: 'KCIP_FIR_INSERTED',
  PREDICTION_READY: 'KCIP_PREDICTION_READY',
  HOTSPOT_UPDATED: 'KCIP_HOTSPOT_UPDATED',
  NETWORK_UPDATED: 'KCIP_NETWORK_UPDATED',
  DASHBOARD_REFRESH: 'KCIP_DASHBOARD_REFRESH',
  NOTIFICATION_SEND: 'KCIP_NOTIFICATION_SEND'
});

export class CatalystSignalsService {
  constructor(catalystApp = null) {
    this.catalystApp = catalystApp;
  }

  setCatalystApp(catalystApp) {
    this.catalystApp = catalystApp;
  }

  /**
   * Raise a Catalyst Signal (or log offline).
   * @param {string} signalName
   * @param {object} [payload]
   * @returns {Promise<object>}
   */
  async raiseSignal(signalName, payload = {}) {
    LoggerUtil.info(`[CatalystSignals] Raising Signal: ${signalName}`, {
      keys: Object.keys(payload)
    });

    try {
      if (this.catalystApp && typeof this.catalystApp.signals === 'function') {
        const signals = this.catalystApp.signals();
        if (signals && typeof signals.raiseSignal === 'function') {
          const result = await signals.raiseSignal(signalName, payload);
          return { success: true, signalName, result };
        }
      }
    } catch (error) {
      LoggerUtil.error('[CatalystSignals] raiseSignal failed', {
        signalName,
        error: error.message
      });
      return { success: false, signalName, error: error.message };
    }

    return { success: true, signalName, payload, _offline: true };
  }

  /**
   * FIR inserted pipeline:
   * FIR → Prediction → Hotspot → Crime Network → Dashboard → Notification
   * @param {object} firRecord
   * @param {object} [handlers] - optional in-process handlers when Signals bus is offline
   * @returns {Promise<object>}
   */
  async onFIRInserted(firRecord, handlers = {}) {
    const basePayload = {
      firNumber: firRecord.firNumber || firRecord.FIRNumber,
      district: firRecord.district || firRecord.District,
      crimeType: firRecord.crimeType || firRecord.CrimeType,
      policeStation: firRecord.policeStation || firRecord.PoliceStation,
      timestamp: new Date().toISOString()
    };

    const steps = [];

    steps.push(await this.raiseSignal(KCIPSignals.FIR_INSERTED, basePayload));

    if (typeof handlers.runPrediction === 'function') {
      try {
        const prediction = await handlers.runPrediction(basePayload);
        steps.push(await this.raiseSignal(KCIPSignals.PREDICTION_READY, { ...basePayload, prediction }));
      } catch (error) {
        LoggerUtil.warn('[CatalystSignals] prediction handler failed', { error: error.message });
        steps.push({ step: 'prediction', success: false, error: error.message });
      }
    } else {
      steps.push(await this.raiseSignal(KCIPSignals.PREDICTION_READY, basePayload));
    }

    if (typeof handlers.runHotspot === 'function') {
      try {
        const hotspots = await handlers.runHotspot(basePayload);
        steps.push(await this.raiseSignal(KCIPSignals.HOTSPOT_UPDATED, { ...basePayload, hotspots }));
      } catch (error) {
        steps.push({ step: 'hotspot', success: false, error: error.message });
      }
    } else {
      steps.push(await this.raiseSignal(KCIPSignals.HOTSPOT_UPDATED, basePayload));
    }

    if (typeof handlers.runNetwork === 'function') {
      try {
        const network = await handlers.runNetwork(basePayload);
        steps.push(await this.raiseSignal(KCIPSignals.NETWORK_UPDATED, { ...basePayload, network }));
      } catch (error) {
        steps.push({ step: 'network', success: false, error: error.message });
      }
    } else {
      steps.push(await this.raiseSignal(KCIPSignals.NETWORK_UPDATED, basePayload));
    }

    steps.push(await this.raiseSignal(KCIPSignals.DASHBOARD_REFRESH, {
      district: basePayload.district
    }));

    steps.push(await this.raiseSignal(KCIPSignals.NOTIFICATION_SEND, {
      ...basePayload,
      title: 'New FIR Registered',
      message: `FIR ${basePayload.firNumber} registered in ${basePayload.district}`
    }));

    if (typeof handlers.sendNotification === 'function') {
      try {
        await handlers.sendNotification({
          recipientId: handlers.notifyRecipientId || 'SCRB',
          title: 'New FIR Registered',
          message: `FIR ${basePayload.firNumber} registered in ${basePayload.district}`
        });
      } catch (error) {
        LoggerUtil.warn('[CatalystSignals] notification handler failed', { error: error.message });
      }
    }

    return { success: true, pipeline: 'FIR_INSERTED', steps };
  }
}
