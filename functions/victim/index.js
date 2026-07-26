/**
 * Catalyst Basic I/O — victims
 */
const { createBasicIOHandler } = require('../shared/cjsBridge.cjs');

module.exports = createBasicIOHandler(async ({ payload, app }) => {
  const { composeBackend } = await import('../shared/compose.js');
  const { controllers, services } = await composeBackend(app);
  if (payload.action === 'listByFIR') {
    const data = await services.victimService.getVictimsByFIR(payload.firNumber);
    return { success: true, statusCode: 200, message: 'Success', data, timestamp: new Date().toISOString() };
  }
  return controllers.victim.execute(payload);
}, { functionName: 'victim' });
