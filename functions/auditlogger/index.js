/**
 * Catalyst Basic I/O — audit logger
 */
const { createBasicIOHandler } = require('../shared/cjsBridge.cjs');

module.exports = createBasicIOHandler(async ({ payload, app }) => {
  const { CatalystDataStoreRepository } = await import('../../backend/repositories/catalyst/CatalystDataStoreRepository.js');
  const { MapperUtil } = await import('../../backend/utils/mapper.js');
  const { LoggerUtil } = await import('../../backend/utils/logger.js');

  const repo = new CatalystDataStoreRepository('AuditLogs', app);
  const row = MapperUtil.toDataStore({
    logId: payload.logId || `LOG-${Date.now()}`,
    userId: payload.userId || payload.username || 'SYSTEM',
    action: payload.action || 'UNKNOWN',
    resource: payload.resource || 'UNKNOWN',
    details: typeof payload.details === 'string' ? payload.details : JSON.stringify(payload.details || payload),
    timestamp: payload.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 19)
  });

  try {
    const saved = await repo.create(row);
    LoggerUtil.info('[auditlogger] Audit entry saved', { logId: row.LogID });
    return {
      success: true,
      statusCode: 201,
      message: 'Audit log recorded',
      data: MapperUtil.fromDataStore(saved),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    LoggerUtil.error('[auditlogger] Failed', { error: error.message });
    return {
      success: false,
      statusCode: 500,
      errorCode: 'AUDIT_FAILED',
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
}, { functionName: 'auditlogger' });
