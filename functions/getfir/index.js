/**
 * Catalyst Basic I/O — get FIR
 */
const { createBasicIOHandler } = require('../shared/cjsBridge.cjs');

module.exports = createBasicIOHandler(async ({ payload, app }) => {
  const { composeBackend } = await import('../shared/compose.js');
  const { controllers } = await composeBackend(app);
  return controllers.fir.get(payload);
}, { functionName: 'getfir' });
