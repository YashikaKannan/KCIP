/**
 * @file catalyst.js
 * @description Safe Zoho Catalyst SDK initialisation with offline-fallback mock for local testing
 * @module KCIP/Functions/Shared
 * @author KCIP Engineering Team — Phase 5 Catalyst Integration
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

/** @type {import('zcatalyst-sdk-node').App} */
let _sdk = null;

try {
  const mod = await import('zcatalyst-sdk-node');
  _sdk = mod.default ?? mod;
} catch {
  // Offline / local environment — use a transparent mock
  _sdk = {
    /**
     * @param {object} req - Catalyst HTTP request object
     * @returns {CatalystAppMock}
     */
    initialize: (_req) => ({
      datastore: () => null,
      zql:       () => null,
      cache:     () => null,
      signals:   () => null,
      circuits:  () => null,
      stratus:   () => null,
      nosql:     () => null,
      auth:      () => ({
        getCurrentUser: async () => ({
          user_id:   'usr-offline',
          email:     'officer@ksp.gov.in',
          role_name: 'INVESTIGATION_OFFICER'
        })
      })
    })
  };
}

/**
 * Initialise the Catalyst SDK for a given Catalyst function request.
 * Falls back gracefully when running outside the Catalyst runtime.
 *
 * @param {object} req - Catalyst Advanced I/O request object
 * @returns {object} Catalyst App instance (real or mock)
 */
export function initCatalyst(req) {
  return _sdk.initialize(req);
}

export default _sdk;
