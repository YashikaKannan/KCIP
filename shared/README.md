# KCIP Shared Library (Phase 3 Final Architecture)

## Overview
The **KCIP Shared Library** is the enterprise reusable foundational layer for the Karnataka Crime Intelligence Platform. It implements strict **Clean Architecture**, **SOLID Principles**, and **DRY** guidelines without framework or SDK dependencies.

---

## Directory Architecture

```
shared/
├── constants/     # Static immutable constants (Roles, Permissions, Districts, PoliceRanks)
├── enums/         # Finite state enumerations (CasePriority, UserStatus, EvidenceStatus, etc.)
├── config/        # Generic application parameters (appConfig, environment, api, pagination, etc.)
├── dto/           # Data Transfer Objects defining API request/response structures
├── helpers/       # Pure reusable utility functions (Date, Geo, Formatter, RiskScore, Logger)
├── interfaces/    # Method contract declarations for backend services and repositories
├── validators/    # Payload validation functions returning { isValid, errors }
├── schemas/       # Object structure placeholder definitions
├── types/         # Entity JSDoc definitions, defaults, and examples
├── errors/        # Custom error hierarchy extending AppError
├── mappers/       # Pure data transformation helpers (toDTO, toEntity)
├── docs/          # Architectural, coding standard, and import guides
├── tests/         # Unit test suites organized by subfolder
├── index.js       # Master barrel export
└── README.md      # Architecture documentation
```
