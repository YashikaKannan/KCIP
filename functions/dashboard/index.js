/**
 * Catalyst Basic I/O — getDashboard
 */
const { createBasicIOHandler } = require('../shared/cjsBridge.cjs');

module.exports = createBasicIOHandler(async ({ payload, app }) => {
  const { composeBackend } = await import('../shared/compose.js');
  const { controllers } = await composeBackend(app);

  if (payload.action === 'map' || payload.action === 'crimeMap') {
    return controllers.analytics.getCrimeMap(payload);
  }
  if (payload.action === 'categories') {
    return controllers.analytics.getCategories(payload);
  }
  if (payload.action === 'officers') {
    return controllers.analytics.getOfficerStatistics(payload);
  }
  if (payload.action === 'trends') {
    return controllers.analytics.execute(payload);
  }
  return controllers.dashboard.execute(payload);
}, { functionName: 'dashboard' });
