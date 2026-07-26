/**
 * Catalyst Basic I/O — generatePDF / reports
 */
const { createBasicIOHandler } = require('../shared/cjsBridge.cjs');

module.exports = createBasicIOHandler(async ({ payload, app }) => {
  const { composeBackend } = await import('../shared/compose.js');
  const { controllers } = await composeBackend(app);
  return controllers.report.execute({
    reportType: payload.reportType || payload.type || 'DAILY',
    format: payload.format || 'PDF',
    ...payload
  });
}, { functionName: 'generatereport' });
