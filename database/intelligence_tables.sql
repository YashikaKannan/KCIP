-- =============================================================================
-- KCIP — Karnataka Crime Intelligence Platform
-- Phase 2: Database Design — Intelligence Layer Tables
-- File: intelligence_tables.sql
-- Platform: Zoho Catalyst Data Store (MySQL 8.0 compatible)
-- Encoding: utf8mb4  |  Engine: InnoDB
--
-- PURPOSE:
--   This file creates the INTELLIGENCE LAYER that EXTENDS (not modifies) the
--   operational schema defined in schema.sql. All tables here reference
--   operational tables via foreign keys but never alter them.
--
-- Intelligence Tables:
--   1. CrimePrediction       — AI-generated risk predictions
--   2. CrimeHotspot          — Geographic crime concentration zones
--   3. CrimeAssociation      — Case-to-case linkage graph
--   4. RepeatOffender        — Habitual/repeat offender profiling
--   5. MOProfile             — Modus Operandi profiling per accused
--   6. DashboardCache        — Pre-computed dashboard metric cache
--   7. AuditLog              — Full audit trail of all data changes
--   8. AIAlert               — System/AI-generated actionable alerts
--
-- PREREQUISITE: schema.sql must be executed first.
-- Generated: 2026-07-26
-- =============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- =============================================================================
-- TABLE 1: CrimePrediction
-- Purpose: Stores AI/ML generated crime predictions at district or unit level.
--          Supports hotspot prediction, recurrence analysis, seasonal trends
--          and pattern-based forecasting. Each prediction carries a risk level,
--          confidence score and a validity window.
-- References: District, Unit, CrimeHead, Employee (validator), CaseMaster
-- =============================================================================
CREATE TABLE IF NOT EXISTS `CrimePrediction` (
    `PredictionID`     INT             NOT NULL AUTO_INCREMENT  COMMENT 'Primary key — unique identifier for each prediction record',
    `CaseMasterID`     INT             NULL                     COMMENT 'FK → CaseMaster.CaseMasterID — optional link to a specific triggering case',
    `DistrictID`       INT             NOT NULL                 COMMENT 'FK → District.DistrictID — district this prediction applies to',
    `UnitID`           INT             NOT NULL                 COMMENT 'FK → Unit.UnitID — police station/unit this prediction targets',
    `CrimeHeadID`      INT             NULL                     COMMENT 'FK → CrimeHead.CrimeHeadID — crime type being predicted (NULL = all types)',
    `PredictionDate`   DATE            NOT NULL                 COMMENT 'Date for which the prediction is generated',
    `PredictionType`   ENUM('HOTSPOT','RECURRENCE','SEASONAL','PATTERN') NOT NULL COMMENT 'Category of prediction algorithm used',
    `RiskLevel`        ENUM('LOW','MEDIUM','HIGH','CRITICAL')   NOT NULL COMMENT 'Assessed risk level: LOW / MEDIUM / HIGH / CRITICAL',
    `ConfidenceScore`  DECIMAL(5,2)    NULL                     COMMENT 'Model confidence score: 0.00 to 100.00 percent',
    `PredictionWindow` INT             NULL                     COMMENT 'Number of days into the future this prediction covers',
    `ModelVersion`     VARCHAR(50)     NULL                     COMMENT 'Version identifier of the ML model that generated this prediction',
    `ModelParameters`  JSON            NULL                     COMMENT 'JSON blob of model hyperparameters and input features used',
    `PredictionStatus` ENUM('PENDING','ACTIVE','EXPIRED','VALIDATED','REJECTED') NOT NULL DEFAULT 'PENDING' COMMENT 'Lifecycle status of the prediction',
    `ValidationNotes`  TEXT            NULL                     COMMENT 'Officer notes when validating or rejecting a prediction',
    `ValidatedBy`      INT             NULL                     COMMENT 'FK → Employee.EmployeeID — officer who validated/rejected this prediction',
    `ValidatedAt`      DATETIME        NULL                     COMMENT 'Timestamp when the prediction was validated or rejected',
    `CreatedAt`        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
    `UpdatedAt`        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Record last updated timestamp',
    PRIMARY KEY (`PredictionID`),
    CONSTRAINT `fk_pred_case`
        FOREIGN KEY (`CaseMasterID`) REFERENCES `CaseMaster` (`CaseMasterID`)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT `fk_pred_district`
        FOREIGN KEY (`DistrictID`) REFERENCES `District` (`DistrictID`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `fk_pred_unit`
        FOREIGN KEY (`UnitID`) REFERENCES `Unit` (`UnitID`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `fk_pred_crimehead`
        FOREIGN KEY (`CrimeHeadID`) REFERENCES `CrimeHead` (`CrimeHeadID`)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT `fk_pred_validator`
        FOREIGN KEY (`ValidatedBy`) REFERENCES `Employee` (`EmployeeID`)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT `chk_pred_confidence`
        CHECK (`ConfidenceScore` IS NULL OR (`ConfidenceScore` >= 0 AND `ConfidenceScore` <= 100))
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Intelligence Layer: AI/ML crime predictions with risk scoring and validation';

-- =============================================================================
-- TABLE 2: CrimeHotspot
-- Purpose: Defines geographic zones with elevated crime concentration.
--          Each hotspot has a centre coordinate, radius, and boundary polygon.
--          Used to power the map-based crime hotspot dashboard and patrols.
-- References: District, Unit, CrimeHead
-- =============================================================================
CREATE TABLE IF NOT EXISTS `CrimeHotspot` (
    `HotspotID`          INT             NOT NULL AUTO_INCREMENT COMMENT 'Primary key — unique identifier for each hotspot',
    `DistrictID`         INT             NOT NULL               COMMENT 'FK → District.DistrictID — district the hotspot is located in',
    `UnitID`             INT             NOT NULL               COMMENT 'FK → Unit.UnitID — police station jurisdiction of the hotspot',
    `CrimeHeadID`        INT             NULL                   COMMENT 'FK → CrimeHead.CrimeHeadID — dominant crime type in this hotspot (NULL = mixed)',
    `HotspotName`        VARCHAR(200)    NOT NULL               COMMENT 'Human-readable name or description for the hotspot',
    `CenterLatitude`     DECIMAL(10,8)   NOT NULL               COMMENT 'GPS latitude of the hotspot centre point',
    `CenterLongitude`    DECIMAL(11,8)   NOT NULL               COMMENT 'GPS longitude of the hotspot centre point',
    `RadiusMeters`       INT             NOT NULL DEFAULT 500   COMMENT 'Radius of the hotspot zone in metres (default 500m)',
    `BoundaryGeoJSON`    JSON            NULL                   COMMENT 'GeoJSON polygon defining the precise hotspot boundary',
    `CrimeCount`         INT             NOT NULL DEFAULT 0     COMMENT 'Total number of crimes recorded in this hotspot zone',
    `RiskLevel`          ENUM('LOW','MEDIUM','HIGH','CRITICAL') NOT NULL COMMENT 'Risk level classification of this hotspot',
    `HotspotStatus`      ENUM('ACTIVE','INACTIVE','MONITORING') NOT NULL DEFAULT 'ACTIVE' COMMENT 'Current operational status of the hotspot',
    `AnalysisPeriodFrom` DATE            NOT NULL               COMMENT 'Start date of the analysis period used to define this hotspot',
    `AnalysisPeriodTo`   DATE            NOT NULL               COMMENT 'End date of the analysis period used to define this hotspot',
    `LastUpdated`        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    `CreatedAt`          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
    PRIMARY KEY (`HotspotID`),
    CONSTRAINT `fk_hotspot_district`
        FOREIGN KEY (`DistrictID`) REFERENCES `District` (`DistrictID`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `fk_hotspot_unit`
        FOREIGN KEY (`UnitID`) REFERENCES `Unit` (`UnitID`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `fk_hotspot_crimehead`
        FOREIGN KEY (`CrimeHeadID`) REFERENCES `CrimeHead` (`CrimeHeadID`)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Intelligence Layer: Geographic crime hotspot zones with risk and boundary data';

-- =============================================================================
-- TABLE 3: CrimeAssociation
-- Purpose: Graph-like table linking related FIR cases together.
--          Enables crime network analysis: same accused, same MO, same location,
--          linked networks, or same victim connections between cases.
--          Unique constraint prevents duplicate association pairs.
-- References: CaseMaster (source and target)
-- =============================================================================
CREATE TABLE IF NOT EXISTS `CrimeAssociation` (
    `AssociationID`       INT             NOT NULL AUTO_INCREMENT COMMENT 'Primary key — unique identifier for this case association',
    `SourceCaseMasterID`  INT             NOT NULL               COMMENT 'FK → CaseMaster.CaseMasterID — the source/originating case in the link',
    `TargetCaseMasterID`  INT             NOT NULL               COMMENT 'FK → CaseMaster.CaseMasterID — the target/related case in the link',
    `AssociationType`     ENUM('SAME_ACCUSED','SAME_LOCATION','SAME_MO','LINKED_NETWORK','SAME_VICTIM') NOT NULL COMMENT 'Nature of the association between the two cases',
    `AssociationStrength` DECIMAL(5,2)    NULL                   COMMENT 'Strength of the association: 0.00 (weak) to 100.00 (definitive)',
    `AssociationNotes`    TEXT            NULL                   COMMENT 'Analyst notes describing the basis for this association',
    `DetectedBy`          ENUM('SYSTEM','MANUAL','AI') NOT NULL DEFAULT 'SYSTEM' COMMENT 'How the association was detected',
    `CreatedAt`           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
    PRIMARY KEY (`AssociationID`),
    UNIQUE KEY `uq_crime_association` (`SourceCaseMasterID`, `TargetCaseMasterID`, `AssociationType`),
    CONSTRAINT `fk_assoc_source`
        FOREIGN KEY (`SourceCaseMasterID`) REFERENCES `CaseMaster` (`CaseMasterID`)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `fk_assoc_target`
        FOREIGN KEY (`TargetCaseMasterID`) REFERENCES `CaseMaster` (`CaseMasterID`)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `chk_assoc_different_cases`
        CHECK (`SourceCaseMasterID` <> `TargetCaseMasterID`),
    CONSTRAINT `chk_assoc_strength`
        CHECK (`AssociationStrength` IS NULL OR (`AssociationStrength` >= 0 AND `AssociationStrength` <= 100))
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Intelligence Layer: Case-to-case relationship graph for crime network analysis';

-- =============================================================================
-- TABLE 4: RepeatOffender
-- Purpose: Tracks accused persons with multiple offences.
--          Provides aggregate statistics (total cases, arrests), risk scoring,
--          and watchlist management for habitual criminals.
-- References: Accused, CrimeHead, Employee (watchlist officer)
-- =============================================================================
CREATE TABLE IF NOT EXISTS `RepeatOffender` (
    `RepeatOffenderID`   INT             NOT NULL AUTO_INCREMENT COMMENT 'Primary key — unique identifier for the repeat offender record',
    `AccusedMasterID`    INT             NOT NULL               COMMENT 'FK → Accused.AccusedMasterID — the accused person being profiled',
    `TotalCases`         INT             NOT NULL DEFAULT 0     COMMENT 'Total number of FIR cases this person has been accused in',
    `TotalArrests`       INT             NOT NULL DEFAULT 0     COMMENT 'Total number of arrests/surrenders recorded for this person',
    `FirstOffenseDate`   DATE            NULL                   COMMENT 'Date of the earliest known offence',
    `LastOffenseDate`    DATE            NULL                   COMMENT 'Date of the most recent known offence',
    `PrimaryMO`          VARCHAR(500)    NULL                   COMMENT 'Short summary of this offender's primary modus operandi',
    `DominantCrimeHeadID` INT            NULL                   COMMENT 'FK → CrimeHead.CrimeHeadID — the most frequent crime type committed',
    `RiskScore`          DECIMAL(5,2)    NULL                   COMMENT 'Computed risk score: 0.00 (low risk) to 100.00 (extreme risk)',
    `RiskCategory`       ENUM('LOW','MEDIUM','HIGH','HABITUAL') NOT NULL DEFAULT 'LOW' COMMENT 'Risk category based on offence history and score',
    `IsActiveOffender`   BIT(1)          NOT NULL DEFAULT b'1'  COMMENT 'Flag: 1=currently active offender, 0=inactive/reformed',
    `WatchlistStatus`    ENUM('NONE','WATCH','ALERT','WANTED')  NOT NULL DEFAULT 'NONE' COMMENT 'Watchlist tier: NONE / WATCH / ALERT / WANTED',
    `WatchlistAddedBy`   INT             NULL                   COMMENT 'FK → Employee.EmployeeID — officer who added to watchlist',
    `WatchlistAddedAt`   DATETIME        NULL                   COMMENT 'Timestamp when added to watchlist',
    `Notes`              TEXT            NULL                   COMMENT 'Additional analyst notes on this offender',
    `CreatedAt`          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
    `UpdatedAt`          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Record last updated timestamp',
    PRIMARY KEY (`RepeatOffenderID`),
    UNIQUE KEY `uq_repeatoffender_accused` (`AccusedMasterID`),
    CONSTRAINT `fk_ro_accused`
        FOREIGN KEY (`AccusedMasterID`) REFERENCES `Accused` (`AccusedMasterID`)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `fk_ro_crimehead`
        FOREIGN KEY (`DominantCrimeHeadID`) REFERENCES `CrimeHead` (`CrimeHeadID`)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT `fk_ro_watchlist_officer`
        FOREIGN KEY (`WatchlistAddedBy`) REFERENCES `Employee` (`EmployeeID`)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT `chk_ro_riskscore`
        CHECK (`RiskScore` IS NULL OR (`RiskScore` >= 0 AND `RiskScore` <= 100))
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Intelligence Layer: Repeat/habitual offender profiles with risk scoring and watchlist';

-- =============================================================================
-- TABLE 5: MOProfile (Modus Operandi Profile)
-- Purpose: Detailed MO profile for an accused person capturing:
--          preferred time/day, typical methods, location types, tools,
--          target profiles and geographic range. Enables pattern matching
--          across unsolved cases.
-- References: Accused, CrimeHead
-- =============================================================================
CREATE TABLE IF NOT EXISTS `MOProfile` (
    `MOProfileID`               INT           NOT NULL AUTO_INCREMENT COMMENT 'Primary key — unique MO profile identifier',
    `AccusedMasterID`           INT           NOT NULL               COMMENT 'FK → Accused.AccusedMasterID — accused person this MO belongs to',
    `CrimeHeadID`               INT           NULL                   COMMENT 'FK → CrimeHead.CrimeHeadID — crime type this MO relates to',
    `PreferredTimeOfDay`        ENUM('DAWN','MORNING','AFTERNOON','EVENING','NIGHT','MIDNIGHT') NULL COMMENT 'Typical time of day when crimes are committed',
    `PreferredDayOfWeek`        SET('MON','TUE','WED','THU','FRI','SAT','SUN') NULL COMMENT 'Typical days of the week (multi-select)',
    `TypicalMethod`             VARCHAR(500)  NULL                   COMMENT 'Description of typical methods used during the crime',
    `TypicalLocation`           ENUM('RESIDENTIAL','COMMERCIAL','HIGHWAY','PUBLIC_PLACE','RURAL','INDUSTRIAL') NULL COMMENT 'Type of location where crimes typically occur',
    `ToolsUsed`                 VARCHAR(300)  NULL                   COMMENT 'Typical tools or weapons used (e.g., knife, vehicle)',
    `TargetProfile`             VARCHAR(500)  NULL                   COMMENT 'Description of typical target or victim profile',
    `GeographicRange`           DECIMAL(10,2) NULL                   COMMENT 'Typical operational radius in kilometres',
    `AverageIncidentDurationMins` INT         NULL                   COMMENT 'Average duration of incidents in minutes',
    `PatternConfidence`         DECIMAL(5,2)  NULL                   COMMENT 'Confidence score for this MO pattern: 0.00 to 100.00',
    `LinkedCaseCount`           INT           NOT NULL DEFAULT 0     COMMENT 'Number of cases where this MO was identified',
    `CreatedAt`                 DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
    `UpdatedAt`                 DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Record last updated timestamp',
    PRIMARY KEY (`MOProfileID`),
    CONSTRAINT `fk_mo_accused`
        FOREIGN KEY (`AccusedMasterID`) REFERENCES `Accused` (`AccusedMasterID`)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `fk_mo_crimehead`
        FOREIGN KEY (`CrimeHeadID`) REFERENCES `CrimeHead` (`CrimeHeadID`)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT `chk_mo_confidence`
        CHECK (`PatternConfidence` IS NULL OR (`PatternConfidence` >= 0 AND `PatternConfidence` <= 100))
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Intelligence Layer: Modus Operandi profiles for accused persons';

-- =============================================================================
-- TABLE 6: DashboardCache
-- Purpose: Pre-computed cache for dashboard metrics and KPI aggregations.
--          Reduces repeated heavy JOIN queries on operational tables.
--          Scoped at GLOBAL, DISTRICT, UNIT or USER level.
--          Cache is invalidated by triggers on CaseMaster and other core tables.
-- =============================================================================
CREATE TABLE IF NOT EXISTS `DashboardCache` (
    `CacheID`       INT          NOT NULL AUTO_INCREMENT COMMENT 'Primary key — unique cache entry identifier',
    `CacheKey`      VARCHAR(255) NOT NULL               COMMENT 'Unique cache key (e.g., dashboard_district_5_2026-07)',
    `CacheScope`    ENUM('GLOBAL','DISTRICT','UNIT','USER') NOT NULL COMMENT 'Scope level: GLOBAL / DISTRICT / UNIT / USER',
    `ScopeID`       INT          NULL                   COMMENT 'Scoping value: DistrictID or UnitID or EmployeeID depending on CacheScope',
    `CacheData`     JSON         NOT NULL               COMMENT 'Pre-computed JSON payload of dashboard metrics',
    `GeneratedAt`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when this cache entry was generated',
    `ExpiresAt`     DATETIME     NOT NULL               COMMENT 'Timestamp when this cache entry expires and should be regenerated',
    `HitCount`      INT          NOT NULL DEFAULT 0     COMMENT 'Number of times this cache entry has been served',
    `LastAccessed`  DATETIME     NULL                   COMMENT 'Timestamp of the last cache hit',
    `IsValid`       BIT(1)       NOT NULL DEFAULT b'1'  COMMENT 'Flag: 1=cache is valid and fresh, 0=cache is stale/invalidated',
    PRIMARY KEY (`CacheID`),
    UNIQUE KEY `uq_dashcache_key` (`CacheKey`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Intelligence Layer: Pre-computed dashboard metric cache for performance';

-- =============================================================================
-- TABLE 7: AuditLog
-- Purpose: Complete immutable audit trail for all data changes across the system.
--          Captures INSERT, UPDATE, DELETE, SELECT, LOGIN, LOGOUT, EXPORT events.
--          Uses BIGINT PK for high-volume write scenarios.
--          OldValue/NewValue stored as JSON for schema flexibility.
--          ChangedByKGID is denormalized to preserve audit integrity even if
--          the Employee record is later modified.
-- References: Employee (ChangedBy, ReversedBy)
-- =============================================================================
CREATE TABLE IF NOT EXISTS `AuditLog` (
    `AuditID`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'Primary key — BIGINT for high-volume audit entries',
    `TableName`        VARCHAR(100) NOT NULL               COMMENT 'Name of the database table that was affected',
    `RecordID`         VARCHAR(50)  NOT NULL               COMMENT 'Primary key value of the affected record (stored as string)',
    `OperationType`    ENUM('INSERT','UPDATE','DELETE','SELECT','LOGIN','LOGOUT','EXPORT') NOT NULL COMMENT 'Type of operation performed',
    `OldValue`         JSON         NULL                   COMMENT 'JSON snapshot of the record before the change (NULL for INSERT)',
    `NewValue`         JSON         NULL                   COMMENT 'JSON snapshot of the record after the change (NULL for DELETE)',
    `ChangedBy`        INT          NULL                   COMMENT 'FK → Employee.EmployeeID — employee who made the change',
    `ChangedByKGID`    VARCHAR(50)  NULL                   COMMENT 'Denormalized KGID for audit integrity (preserved even if Employee changes)',
    `ChangeTimestamp`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Precise timestamp of the change',
    `IPAddress`        VARCHAR(45)  NULL                   COMMENT 'IP address of the client that made the change (IPv4 or IPv6)',
    `UserAgent`        VARCHAR(500) NULL                   COMMENT 'Browser/client user agent string',
    `SessionID`        VARCHAR(255) NULL                   COMMENT 'Session identifier for correlating related audit events',
    `ChangeReason`     VARCHAR(500) NULL                   COMMENT 'Optional reason provided by the operator for the change',
    `IsReversible`     BIT(1)       NOT NULL DEFAULT b'1'  COMMENT 'Flag: 1=this change can be reversed, 0=irreversible',
    `ReversedAt`       DATETIME     NULL                   COMMENT 'Timestamp when this change was reversed (NULL if not reversed)',
    `ReversedBy`       INT          NULL                   COMMENT 'FK → Employee.EmployeeID — officer who reversed this change',
    PRIMARY KEY (`AuditID`),
    CONSTRAINT `fk_audit_changedby`
        FOREIGN KEY (`ChangedBy`) REFERENCES `Employee` (`EmployeeID`)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT `fk_audit_reversedby`
        FOREIGN KEY (`ReversedBy`) REFERENCES `Employee` (`EmployeeID`)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Intelligence Layer: Immutable audit trail for all system data changes';

-- =============================================================================
-- TABLE 8: AIAlert
-- Purpose: System-generated or AI-generated actionable alerts for police officers.
--          Covers hotspot surges, repeat offender activity, prediction breaches,
--          SLA violations, pattern detections and data anomalies.
--          Alerts flow through a lifecycle: OPEN → ACKNOWLEDGED → IN_PROGRESS → RESOLVED.
-- References: CaseMaster, CrimeHotspot, CrimePrediction, District, Unit, Employee
-- =============================================================================
CREATE TABLE IF NOT EXISTS `AIAlert` (
    `AlertID`              INT      NOT NULL AUTO_INCREMENT COMMENT 'Primary key — unique identifier for each alert',
    `AlertType`            ENUM('HOTSPOT_SURGE','REPEAT_OFFENDER','PREDICTION_BREACH','PATTERN_DETECTED','MISSING_FILING','SLA_BREACH','DATA_ANOMALY') NOT NULL COMMENT 'Type/category of the alert',
    `AlertSeverity`        ENUM('INFO','WARNING','CRITICAL','EMERGENCY') NOT NULL DEFAULT 'INFO' COMMENT 'Severity level of the alert',
    `AlertTitle`           VARCHAR(300) NOT NULL              COMMENT 'Short descriptive title of the alert',
    `AlertDescription`     TEXT         NOT NULL              COMMENT 'Full description of the alert with context and recommended action',
    `RelatedCaseMasterID`  INT          NULL                  COMMENT 'FK → CaseMaster.CaseMasterID — related case (if applicable)',
    `RelatedHotspotID`     INT          NULL                  COMMENT 'FK → CrimeHotspot.HotspotID — related hotspot (if applicable)',
    `RelatedPredictionID`  INT          NULL                  COMMENT 'FK → CrimePrediction.PredictionID — related prediction (if applicable)',
    `RelatedDistrictID`    INT          NULL                  COMMENT 'FK → District.DistrictID — district this alert pertains to',
    `RelatedUnitID`        INT          NULL                  COMMENT 'FK → Unit.UnitID — unit this alert pertains to',
    `AlertStatus`          ENUM('OPEN','ACKNOWLEDGED','IN_PROGRESS','RESOLVED','DISMISSED') NOT NULL DEFAULT 'OPEN' COMMENT 'Current lifecycle status of the alert',
    `AssignedTo`           INT          NULL                  COMMENT 'FK → Employee.EmployeeID — officer assigned to act on this alert',
    `AcknowledgedAt`       DATETIME     NULL                  COMMENT 'Timestamp when the alert was acknowledged',
    `ResolvedAt`           DATETIME     NULL                  COMMENT 'Timestamp when the alert was resolved or dismissed',
    `ResolutionNotes`      TEXT         NULL                  COMMENT 'Notes describing how the alert was resolved',
    `AutoGenerated`        BIT(1)       NOT NULL DEFAULT b'1' COMMENT 'Flag: 1=auto-generated by system/AI, 0=manually created',
    `CreatedAt`            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
    `UpdatedAt`            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Record last updated timestamp',
    PRIMARY KEY (`AlertID`),
    CONSTRAINT `fk_alert_case`
        FOREIGN KEY (`RelatedCaseMasterID`) REFERENCES `CaseMaster` (`CaseMasterID`)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT `fk_alert_hotspot`
        FOREIGN KEY (`RelatedHotspotID`) REFERENCES `CrimeHotspot` (`HotspotID`)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT `fk_alert_prediction`
        FOREIGN KEY (`RelatedPredictionID`) REFERENCES `CrimePrediction` (`PredictionID`)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT `fk_alert_district`
        FOREIGN KEY (`RelatedDistrictID`) REFERENCES `District` (`DistrictID`)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT `fk_alert_unit`
        FOREIGN KEY (`RelatedUnitID`) REFERENCES `Unit` (`UnitID`)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT `fk_alert_assignee`
        FOREIGN KEY (`AssignedTo`) REFERENCES `Employee` (`EmployeeID`)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Intelligence Layer: AI and system-generated actionable alerts for officers';

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- END OF INTELLIGENCE LAYER SCHEMA
-- Total tables: 8 (extends schema.sql without modifying any operational tables)
-- =============================================================================
