# KCIP Backend Business Layer (Phase 4)

## Purpose
The **KCIP Backend Business Layer** provides the complete, framework-independent business rules, data access repository abstractions, domain entities, validators, controllers, and utilities for the Karnataka Crime Intelligence Platform (KCIP).

Built strictly adhering to **Clean Architecture**, **SOLID Principles**, the **Repository Pattern**, and **Service Layer Pattern**, this layer is completely decoupled from HTTP frameworks (Express, FastAPI) and Catalyst SDKs, making it immediately reusable by any Zoho Catalyst Function or AppSail service in Phase 5.

---

## Directory Overview

```
backend/
├── config/        # Backend parameters (appConfig, serviceConfig, loggerConfig, featureFlags, etc.)
├── controllers/   # Controllers coordinating validators, services, and response builders
├── services/      # Service layer containing core crime intelligence business logic
├── repositories/  # Abstract Repository interface definitions for Phase 5 Data Store queries
├── models/        # Business domain entity representations (NOT DB schemas)
├── validators/    # Backend payload verification classes returning { isValid, errors }
├── middleware/    # Reusable pure middleware helpers (Validation, AuthZ, Logging, Error)
├── utils/         # Core backend utilities (logger, response, errorHandler, mapper, audit)
├── index.js       # Master barrel export
└── README.md      # Backend Architecture documentation
```

---

## Architectural Control & Flow Rules

### 1. Request Lifecycle Flow
```text
Catalyst Function (Phase 5)
  └── Controller (Phase 4)
        ├── Validation Middleware / Validator
        └── Service (Phase 4 Business Logic)
              ├── Shared Library Helpers / DTOs
              └── Repository (Phase 4 Abstract Interface -> Phase 5 Data Store)
```

### 2. Dependency Rules
- **Allowed**: Controller -> Service -> Repository
- **Allowed**: Service -> Shared Library (`../shared/index.js`)
- **Not Allowed**: Repository -> Service or Controller -> Repository
- **Framework Independence**: Zero imports of Express, HTTP server, or Catalyst SDK in Phase 4.

---

## Integration Strategy

### Catalyst Functions (Phase 5)
Catalyst backend functions import Controllers and Services directly:
```javascript
import { FIRController, FIRService, FIRRepository } from '../backend/index.js';

const firRepo = new FIRRepository(); // Injected with Catalyst Data Store in Phase 5
const firService = new FIRService(firRepo);
const firController = new FIRController(firService);

export async function main(req, res) {
  const result = await firController.execute(req.body);
  return result;
}
```
