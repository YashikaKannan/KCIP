-- =============================================================================
-- KCIP — Karnataka Crime Intelligence Platform
-- Phase 2: Database Design — Indexing Strategy
-- File: indexes.sql
-- Platform: Zoho Catalyst Data Store (MySQL 8.0 compatible DDL)
--
-- TODO: Zoho Catalyst Data Store handles search indexation automatically on text
--       and primary columns. It does not support native CREATE INDEX DDL commands.
--       Use this file as a schema optimization blueprint if deploying KCIP
--       to a standalone relational database (e.g., PostgreSQL, MySQL).
-- =============================================================================

-- =============================================================================
-- 1. Operational Layer Indexes
-- =============================================================================

-- Crime Number and Case Number (High selectivity lookup)
CREATE UNIQUE INDEX `idx_casemaster_crimeno` ON `CaseMaster` (`CrimeNo`);
CREATE INDEX `idx_casemaster_caseno` ON `CaseMaster` (`CaseNo`);

-- District-wise and Police Station (Unit) filters for dashboard routing
CREATE INDEX `idx_casemaster_unit` ON `CaseMaster` (`PoliceStationID`);
CREATE INDEX `idx_district_state` ON `District` (`StateID`);
CREATE INDEX `idx_unit_district` ON `Unit` (`DistrictID`);
CREATE INDEX `idx_unit_state` ON `Unit` (`StateID`);

-- Employee posting lookups (KGID, Unit, District)
CREATE UNIQUE INDEX `idx_employee_kgid` ON `Employee` (`KGID`);
CREATE INDEX `idx_employee_unit` ON `Employee` (`UnitID`);
CREATE INDEX `idx_employee_district` ON `Employee` (`DistrictID`);

-- Crime classification categories & status
CREATE INDEX `idx_casemaster_status` ON `CaseMaster` (`CaseStatusID`);
CREATE INDEX `idx_casemaster_major_head` ON `CaseMaster` (`CrimeMajorHeadID`);
CREATE INDEX `idx_casemaster_minor_head` ON `CaseMaster` (`CrimeMinorHeadID`);
CREATE INDEX `idx_casemaster_reg_date` ON `CaseMaster` (`CrimeRegisteredDate`);

-- Geographic coordinates for mapping and geospatial queries
CREATE INDEX `idx_casemaster_geo` ON `CaseMaster` (`latitude`, `longitude`);

-- Person/Accused association and sorting
CREATE INDEX `idx_accused_case` ON `CaseMaster` (`CaseMasterID`);
CREATE INDEX `idx_complainant_case` ON `ComplainantDetails` (`CaseMasterID`);
CREATE INDEX `idx_victim_case` ON `Victim` (`CaseMasterID`);

-- Arrest and Surrender lookups
CREATE INDEX `idx_arrest_case` ON `ArrestSurrender` (`CaseMasterID`);
CREATE INDEX `idx_arrest_accused` ON `ArrestSurrender` (`AccusedMasterID`);

-- Chargesheet lookups
CREATE INDEX `idx_chargesheet_case` ON `ChargesheetDetails` (`CaseMasterID`);


-- =============================================================================
-- 2. Intelligence Layer Indexes
-- =============================================================================

-- CrimePrediction: Optimize predictive queries by district, unit, date, and risk
CREATE INDEX `idx_prediction_query` ON `CrimePrediction` (`DistrictID`, `UnitID`, `PredictionDate`, `RiskLevel`);
CREATE INDEX `idx_prediction_status` ON `CrimePrediction` (`PredictionStatus`);

-- CrimeHotspot: Optimize geospatial dashboard queries by unit and risk level
CREATE INDEX `idx_hotspot_unit` ON `CrimeHotspot` (`UnitID`, `RiskLevel`);
CREATE INDEX `idx_hotspot_geo` ON `CrimeHotspot` (`CenterLatitude`, `CenterLongitude`);

-- CrimeAssociation: Optimize graph-traversal queries (Case-to-Case links)
CREATE INDEX `idx_assoc_graph` ON `CrimeAssociation` (`SourceCaseMasterID`, `TargetCaseMasterID`, `AssociationType`);

-- RepeatOffender: Watchlist checks & habitual risk analysis
CREATE INDEX `idx_ro_accused` ON `RepeatOffender` (`AccusedMasterID`, `RiskCategory`);
CREATE INDEX `idx_ro_watchlist` ON `RepeatOffender` (`WatchlistStatus`);

-- MOProfile: Modus Operandi matching engine
CREATE INDEX `idx_mo_accused_head` ON `MOProfile` (`AccusedMasterID`, `CrimeHeadID`);

-- DashboardCache: Rapid retrieval of dashboard key value pairs
CREATE UNIQUE INDEX `idx_dashcache_key` ON `DashboardCache` (`CacheKey`);

-- AuditLog: High volume log analysis and change tracking
CREATE INDEX `idx_audit_timestamp` ON `AuditLog` (`ChangeTimestamp`);
CREATE INDEX `idx_audit_table_record` ON `AuditLog` (`TableName`, `RecordID`);
CREATE INDEX `idx_audit_user` ON `AuditLog` (`ChangedByKGID`);

-- AIAlert: Smart notification routing and unresolved alert tracking
CREATE INDEX `idx_alert_assignee_status` ON `AIAlert` (`AssignedTo`, `AlertStatus`);
CREATE INDEX `idx_alert_type_severity` ON `AIAlert` (`AlertType`, `AlertSeverity`);
