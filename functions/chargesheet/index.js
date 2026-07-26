/**
 * Catalyst Basic I/O — chargesheet
 */
const { createBasicIOHandler } = require('../shared/cjsBridge.cjs');

module.exports = createBasicIOHandler(async ({ payload, app }) => {
  const { composeBackend } = await import('../shared/compose.js');
  const { controllers } = await composeBackend(app);
  return controllers.chargesheet.execute(payload);
}, { functionName: 'chargesheet' });
