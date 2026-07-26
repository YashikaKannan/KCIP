/**
 * Catalyst Basic I/O — repeat offender analysis
 */
const { createBasicIOHandler } = require('../shared/cjsBridge.cjs');

module.exports = createBasicIOHandler(async ({ payload, app }) => {
  const { composeBackend } = await import('../shared/compose.js');
  const { controllers } = await composeBackend(app);
  return controllers.accused.execute({ ...payload, action: 'repeatOffenders' });
}, { functionName: 'repeatoffender' });
