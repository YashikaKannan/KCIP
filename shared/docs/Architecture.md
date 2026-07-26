# KCIP Shared Library Architecture

## Overview
The Shared Library (`shared/`) serves as the single source of truth for constants, enums, configs, DTOs, helpers, interfaces, validators, schemas, types, errors, and mappers across the Karnataka Crime Intelligence Platform (KCIP).

## Key Architectural Rules
1. **Clean Architecture**: Decoupled modules with zero external framework dependencies (no Catalyst SDK, no DB queries, no UI components).
2. **SOLID Principles**: Single Responsibility classes and modules.
3. **DRY**: Reusable data contracts and utilities shared across Catalyst Functions, AppSail microservices, QuickML AI models, and Frontend.
