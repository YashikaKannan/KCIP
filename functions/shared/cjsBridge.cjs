/**
 * CommonJS bridge so Basic I/O functions can load ESM shared helpers.
 * Catalyst function runtimes expect module.exports handlers.
 */
function createBasicIOHandler(handler, options = {}) {
  const functionName = options.functionName || 'kcip-function';

  return (context, basicIO) => {
    (async () => {
      const { createBasicIOHandler: esmFactory } = await import('./basicIOHelper.js');
      // Re-enter through ESM factory body by invoking handler with collected context
      const { initCatalyst } = await import('./catalyst.js');
      const { createLogger } = await import('./logger.js');
      const { collectArguments, writeJson } = await import('./basicIOHelper.js');

      const logger = createLogger(functionName);
      const app = initCatalyst({ context, basicIO });
      const payload = collectArguments(basicIO, options.argumentKeys || []);

      logger.info('Function invoked', { keys: Object.keys(payload) });
      const result = await handler({ context, basicIO, payload, app, logger });
      writeJson(basicIO, result);
    })()
      .catch(async (error) => {
        try {
          const { writeJson } = await import('./basicIOHelper.js');
          writeJson(basicIO, {
            success: false,
            statusCode: 500,
            errorCode: 'UNHANDLED',
            message: error.message,
            timestamp: new Date().toISOString()
          });
        } catch {
          try { basicIO.write(JSON.stringify({ success: false, message: error.message })); } catch { /* ignore */ }
        }
      })
      .finally(() => {
        try { context.close(); } catch { /* ignore */ }
      });
  };
}

module.exports = { createBasicIOHandler };
