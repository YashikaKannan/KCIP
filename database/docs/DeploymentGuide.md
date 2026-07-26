# Database Deployment Guide

This guide details the steps to deploy the KCIP database layers to Zoho Catalyst Data Store or a traditional MySQL/PostgreSQL environment.

## 1. Zoho Catalyst Data Store Deployment

Zoho Catalyst Data Store schema is defined in `database/datastore-schema.json`.

### Steps:
1. Log in to the Zoho Catalyst Console.
2. Navigate to **Data Store** under the **Develop** menu.
3. Import the `datastore-schema.json` file to automatically create all matching tables and columns, or define them manually following the structures in `schema.sql` and `intelligence_tables.sql`.
4. Configure table relationships in the Catalyst UI to set up foreign keys.
5. Create Catalyst Serverless Functions to handle cascading deletions, complex check constraints, and unique checks.

### Seed Data Import:
1. Export the sample CSV files located in `database/sample_data/` (e.g. `lookup_districts.csv`, `cases.csv`, `predictions.csv`).
2. Use the **Import Data** feature in the Catalyst Console for each corresponding table to load the initial lookup and sample dataset.

## 2. Standalone Relational Deployment (MySQL/PostgreSQL)

If deploying to a traditional relational database engine (for local testing, staging, or alternative production):

### Execution Order:
Run the SQL files in the following sequence:
1. `schema.sql` (Creates operational tables)
2. `intelligence_tables.sql` (Creates intelligence tables)
3. `constraints.sql` (Applies primary/foreign keys and checks)
4. `indexes.sql` (Creates indexes)
5. `views.sql` (Creates reporting views)
6. `triggers.sql` (Applies audit and cache triggers)
7. `procedures.sql` (Creates stored procedure templates)
8. `seed.sql` (Loads test data)

### Example Bash Script:
```bash
mysql -u root -p kcip_db < database/schema.sql
mysql -u root -p kcip_db < database/intelligence_tables.sql
mysql -u root -p kcip_db < database/constraints.sql
mysql -u root -p kcip_db < database/indexes.sql
mysql -u root -p kcip_db < database/views.sql
mysql -u root -p kcip_db < database/triggers.sql
mysql -u root -p kcip_db < database/procedures.sql
mysql -u root -p kcip_db < database/seed.sql
```
