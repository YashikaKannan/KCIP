/**
 * @file basicIOHelper.js
 * @description Helpers for Zoho Catalyst Basic I/O functions
 * @module KCIP/Functions/Shared
 * @author KCIP Engineering Team — Phase 5 Catalyst Integration
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

/**
 * Collect all named arguments from BasicIO into a plain object.
 * Known keys can be passed; unknown keys are best-effort via common names.
 * @param {object} basicIO
 * @param {string[]} [keys]
 * @returns {object}
 */
export function collectArguments(basicIO, keys = []) {
  const payload = {};
  const defaultKeys = [
    'action', 'username', 'password', 'token', 'role',
    'firNumber', 'id', 'district', 'policeStation', 'crimeType',
    'complainantName', 'incidentDate', 'status', 'ipcSections',
    'name', 'age', 'gender', 'contactNumber', 'statement',
    'alias', 'riskLevel', 'accusedId', 'arrestId', 'arrestDate',
    'arrestingOfficer', 'detentionLocation', 'courtName',
    'chargesheetNumber', 'filingDate', 'type', 'predictionType',
    'rootNodeId', 'depth', 'radiusKm', 'reportType', 'format',
    'recipientId', 'title', 'message', 'notificationId',
    'startDate', 'endDate', 'generatedBy', 'fileName', 'fileType',
    'fileContent', 'bucketName', 'latitude', 'longitude', 'severity',
    'payload'
  ];

  const allKeys = [...new Set([...defaultKeys, ...keys])];
  for (const key of allKeys) {
    try {
      const value = basicIO.getArgument(key);
      if (value !== undefined && value !== null && value !== '') {
        payload[key] = value;
      }
    } catch {
      // ignore missing arg
    }
  }

  // Support JSON-encoded payload blob
  if (typeof payload.payload === 'string') {
    try {
      const parsed = JSON.parse(payload.payload);
      Object.assign(payload, parsed);
      delete payload.payload;
    } catch {
      // keep raw
    }
  }

  return payload;
}

/**
 * Write a JSON response body via BasicIO and never throw.
 * @param {object} basicIO
 * @param {object} result
 */
export function writeJson(basicIO, result) {
  try {
    const body = typeof result === 'string' ? result : JSON.stringify(result ?? {});
    basicIO.write(body);
  } catch (error) {
    try {
      basicIO.write(JSON.stringify({
        success: false,
        statusCode: 500,
        errorCode: 'RESPONSE_WRITE_FAILED',
        message: error.message,
        timestamp: new Date().toISOString()
      }));
    } catch {
      // last resort — swallow
    }
  }
}

/**
 * Wrap an async BasicIO handler so context.close() always runs.
 * @param {Function} handler - async (context, basicIO, payload, app) => result
 * @param {object} options
 * @returns {Function} Catalyst BasicIO export
 */
export function createBasicIOHandler(handler, options = {}) {
  const functionName = options.functionName || 'kcip-function';

  return (context, basicIO) => {
    (async () => {
      let result;
      try {
        const { initCatalyst } = await import('./catalyst.js');
        const { createLogger } = await import('./logger.js');
        const logger = createLogger(functionName);
        const app = initCatalyst({ context, basicIO });
        const payload = collectArguments(basicIO, options.argumentKeys || []);

        logger.info('Function invoked', { keys: Object.keys(payload) });
        result = await handler({ context, basicIO, payload, app, logger });
      } catch (error) {
        result = {
          success: false,
          statusCode: error.statusCode || 500,
          errorCode: error.code || error.errorCode || 'INTERNAL_ERROR',
          message: error.message || 'Unexpected error',
          timestamp: new Date().toISOString()
        };
      }

      writeJson(basicIO, result);
    })()
      .catch((error) => {
        writeJson(basicIO, {
          success: false,
          statusCode: 500,
          errorCode: 'UNHANDLED',
          message: error.message,
          timestamp: new Date().toISOString()
        });
      })
      .finally(() => {
        try {
          context.close();
        } catch {
          // ignore
        }
      });
  };
}
