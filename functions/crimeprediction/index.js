/**
 * Catalyst Basic I/O — getPredictions
 */
const { createBasicIOHandler } = require('../shared/cjsBridge.cjs');

module.exports = createBasicIOHandler(async ({ payload, app }) => {
  const { composeBackend } = await import('../shared/compose.js');
  const { controllers } = await composeBackend(app);
  return controllers.prediction.execute({
    district: payload.district,
    type: payload.type || payload.predictionType
  });
}, { functionName: 'crimeprediction' });
