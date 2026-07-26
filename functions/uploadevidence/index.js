/**
 * Catalyst Basic I/O — uploadEvidence (Stratus)
 */
const { createBasicIOHandler } = require('../shared/cjsBridge.cjs');

module.exports = createBasicIOHandler(async ({ payload, app }) => {
  const { CatalystStratusService } = await import('../../backend/services/catalyst/CatalystStratusService.js');
  const stratus = new CatalystStratusService(app);
  const data = await stratus.uploadEvidence(payload);
  return {
    success: true,
    statusCode: 201,
    message: 'Evidence uploaded successfully',
    data,
    timestamp: new Date().toISOString()
  };
}, { functionName: 'uploadevidence' });
