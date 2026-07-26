/**
 * Catalyst Basic I/O — getCrimeNetwork
 */
const { createBasicIOHandler } = require('../shared/cjsBridge.cjs');

module.exports = createBasicIOHandler(async ({ payload, app }) => {
  const { composeBackend } = await import('../shared/compose.js');
  const { controllers } = await composeBackend(app);
  return controllers.graph.execute({
    rootNodeId: payload.rootNodeId || payload.id || payload.firNumber,
    depth: payload.depth ? Number(payload.depth) : 2
  });
}, { functionName: 'graphanalysis' });
