# KCIP — Catalyst Serverless Functions Layer (Phase 5)

## Overview
Phase 5 is the **Catalyst Functions integration layer** for the Karnataka Crime Intelligence Platform.
It wires the Phase 4 Backend Business Layer and Phase 3 Shared Library into **18 Zoho Catalyst Advanced I/O Serverless Functions**.

---

## Architectural Principles

```text
HTTP Request / Catalyst API Gateway
  └── functions/<name>/index.js         ← Thin orchestration layer ONLY
        ├── functions/shared/catalyst.js    ← SDK initialisation
        ├── functions/shared/validation.js  ← Payload extraction + field validation
        ├── functions/shared/logger.js      ← Structured JSON logging
        ├── backend/controllers/<Ctrl>.js   ← Business orchestration
        ├── backend/services/<Svc>.js       ← Domain logic
        └── backend/repositories/catalyst/ ← Catalyst Data Store CRUD
```

**Each function is strictly a thin orchestration handler. Zero business logic.**

---

## Folder Structure

```
functions/
├── shared/                   ← Shared utilities (all functions import from here)
│   ├── catalyst.js
│   ├── response.js
│   ├── validation.js
│   ├── logger.js
│   ├── errorHandler.js
│   ├── index.js
│   └── README.md
├── registerFIR/
├── getFIR/
├── updateFIR/
├── deleteFIR/
├── victim/
├── accused/
├── arrest/
├── chargesheet/
├── dashboard/
├── crimePrediction/
├── graphAnalysis/
├── hotspotDetection/
├── repeatOffender/
├── generateReport/
├── uploadEvidence/
├── notifications/
├── auditLogger/
└── authentication/
```

Each function folder contains:
- `index.js`             — Catalyst Advanced I/O entry point
- `package.json`         — ES Module, Node 20, `zcatalyst-sdk-node` dependency
- `catalyst-config.json` — Runtime, memory, timeout, environment placeholders
- `README.md`            — Full per-function documentation

---

## Function Registry

| # | Function           | HTTP | Responsibility                            |
|---|--------------------|------|-------------------------------------------|
| 1  | `registerFIR`     | POST | Register a new FIR                       |
| 2  | `getFIR`          | GET  | Retrieve FIR details                     |
| 3  | `updateFIR`       | PUT  | Update FIR status / details              |
| 4  | `deleteFIR`       | DEL  | Archive or delete an FIR                 |
| 5  | `victim`          | POST | Manage victim profiles                   |
| 6  | `accused`         | POST | Manage accused profiles                  |
| 7  | `arrest`          | POST | Record arrest events                     |
| 8  | `chargesheet`     | POST | File legal chargesheets                  |
| 9  | `dashboard`       | GET  | District crime metrics                   |
| 10 | `crimePrediction` | POST | AI crime spike prediction                |
| 11 | `graphAnalysis`   | POST | Crime network graph                      |
| 12 | `hotspotDetection`| POST | Geospatial hotspot clustering            |
| 13 | `repeatOffender`  | GET  | Recidivism scoring                       |
| 14 | `generateReport`  | POST | PDF / CSV report generation              |
| 15 | `uploadEvidence`  | POST | Evidence file upload                     |
| 16 | `notifications`   | POST | Officer notification delivery            |
| 17 | `auditLogger`     | POST | Immutable audit trail entries            |
| 18 | `authentication`  | POST | Officer authentication                   |

---

## Deployment

```bash
# Deploy all functions
catalyst deploy --only functions

# Deploy a single function
catalyst deploy --only functions/registerFIR
```

---

## Environment Variables

Configure these in the **Catalyst Console → Functions → Environment Variables**:

| Variable       | Description                    |
|----------------|--------------------------------|
| `LOG_LEVEL`    | `DEBUG`, `INFO`, `WARN`, `ERROR` |
| `APP_ENV`      | `development`, `production`    |
| `PROJECT_NAME` | `KCIP`                         |
