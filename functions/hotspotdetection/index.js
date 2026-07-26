/**
 * Catalyst Basic I/O — getHotspots
 */
const { createBasicIOHandler } = require('../shared/cjsBridge.cjs');

module.exports = createBasicIOHandler(async ({ payload, app }) => {
  const { composeBackend } = await import('../shared/compose.js');
  const { controllers } = await composeBackend(app);
  return controllers.hotspot.execute(payload);
}, { functionName: 'hotspotdetection' });
