# KCIP Database Layer

This directory contains the database design, schema definitions, seed data, and intelligence-layer enhancements for the **Karnataka Crime Intelligence Platform (KCIP)**.

## Directory Structure
- `schema.sql`: Core operational schema mirroring the official `Police_FIR_ER_Diagram.pdf`.
- `intelligence_tables.sql`: Advanced analytical/AI tables extending the operational schema.
- `seed.sql`: Lookup master data and initial operational/intelligence test records.
- `indexes.sql`: Recommended indexing strategy for performance under high-volume queries.
- `constraints.sql`: Referential and check constraints.
- `views.sql`: Analytical and reporting views.
- `procedures.sql`: SQL template placeholders for complex transactions.
- `triggers.sql`: Event-driven trigger definitions (for data synchronization and auditing).
- `sample_data/`: Segmented mock dataset.
  - `lookup/`: Master lookup CSVs.
  - `operational/`: Operational test data CSVs.
  - `intelligence/`: AI/ML generated test records.
- `migrations/`: Future database schema migration scripts.
- `docs/`: In-depth documentation of the database design.
  - `OperationalSchema.md`
  - `IntelligenceSchema.md`
  - `Relationships.md`
  - `IndexStrategy.md`
  - `DeploymentGuide.md`

## Zoho Catalyst Data Store Compatibility
Zoho Catalyst's native Data Store uses a custom relational-like model configured via the console or `datastore-schema.json`. It does not support native SQL DDL commands like `CREATE TABLE`, `CREATE VIEW`, triggers, or stored procedures.
- **Tables & Columns**: Map to Catalyst Datastore tables.
- **Foreign Keys & Constraints**: Implemented via Catalyst's column-level relationships or handled at the application layer in **Catalyst Serverless Functions**.
- **Triggers**: Replaced by **Catalyst Signals** and **Catalyst Circuits** triggered on insert/update events.
- **Procedures & Views**: Replaced by API logic inside **Catalyst serverless functions** or cached tables.
- **Indexes**: Handled automatically by Catalyst's search indexers, but documented here for alternative relational deployments.
