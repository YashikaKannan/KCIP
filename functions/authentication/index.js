/**
 * @file index.js
 * @description Catalyst Basic I/O — Authentication (login / logout / currentUser)
 */
const { createBasicIOHandler } = require('../shared/cjsBridge.cjs');

module.exports = createBasicIOHandler(async ({ payload, app }) => {
  const { composeBackend } = await import('../shared/compose.js');
  const { controllers } = await composeBackend(app);
  const action = String(payload.action || 'login').toLowerCase();

  if (action === 'logout') return controllers.auth.logout(payload);
  if (action === 'current' || action === 'me' || action === 'currentuser') {
    return controllers.auth.currentUser(payload);
  }
  return controllers.auth.login(payload);
}, { functionName: 'authentication' });
