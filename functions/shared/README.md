# functions/shared — Catalyst Function Shared Utilities

## Purpose
Centralised, reusable utilities shared across **all 18 Catalyst Serverless Functions**.
Zero business logic lives here — only pure orchestration helpers.

---

## Module Overview

| File              | Responsibility                                                  |
|-------------------|-----------------------------------------------------------------|
| `catalyst.js`     | Safe Catalyst SDK initialisation (with offline fallback mock)   |
| `response.js`     | Standardised HTTP JSON response helpers (200, 201, 400…500)     |
| `logger.js`       | Structured JSON-compatible console logger                        |
| `validation.js`   | Request context extraction and field-level validation helpers    |
| `errorHandler.js` | Centralised error-to-HTTP response mapping                       |
| `index.js`        | Barrel export for all utilities                                  |

---

## Usage in a Function

```js
import { initCatalyst, sendCreated, createLogger, extractPayload, handleError } from '../shared/index.js';

const logger = createLogger('registerFIR');

export default async (req, res) => {
  try {
    const catalystApp = initCatalyst(req);
    const payload     = extractPayload(req);
    logger.info('Registering FIR', { payload });
    // ... orchestrate controller ...
    return sendCreated(res, result);
  } catch (err) {
    return handleError(res, err, logger, 'registerFIR');
  }
};
```

---

## Design Rules

- No business logic.
- No Catalyst Data Store queries.
- No authentication implementation.
- No AI / ML calls.
- Single Responsibility per module.
- All exports documented with JSDoc.
