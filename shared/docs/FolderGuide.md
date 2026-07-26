# Shared Folder Responsibilities Guide

- `constants/`: Immutable lookup tables (Roles, Permissions, 31 Karnataka Districts, Police Ranks).
- `enums/`: Finite application state enumerations (CasePriority, UserStatus, EvidenceStatus, NotificationStatus, ReportStatus).
- `config/`: App-level parameters (appConfig, environment, api, pagination, dateFormats, timezone).
- `dto/`: Data Transfer Objects for request and response API payloads.
- `helpers/`: Pure reusable utilities without side-effects or DB dependencies.
- `interfaces/`: Structural contracts for services and repositories.
- `validators/`: Input verification logic returning `{ isValid, errors }`.
- `schemas/`: Generic object structure placeholders.
- `types/`: Typed entity definitions, defaults, and examples.
- `errors/`: Custom error hierarchy extending base `AppError`.
- `mappers/`: Pure data transformers between DTOs, Entities, and Schemas.
