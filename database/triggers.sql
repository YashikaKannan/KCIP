-- =============================================================================
-- KCIP — Karnataka Crime Intelligence Platform
-- Phase 2: Database Design — Database Triggers
-- File: triggers.sql
-- Platform: Zoho Catalyst Data Store (MySQL 8.0 compatible DDL)
--
-- TODO: Zoho Catalyst Data Store does not support database-level triggers.
--       - Port these event-driven trigger blocks to Catalyst Signals.
--       - A Catalyst Signal should trigger on Data Store write events
--         and direct control flow to Catalyst Functions/Circuits.
-- =============================================================================

DELIMITER $$

-- =============================================================================
-- TRIGGER 1: trg_AuditCaseMasterInsert
-- Purpose: Automatically inserts an entry into AuditLog when a new FIR is registered.
-- =============================================================================
CREATE TRIGGER trg_AuditCaseMasterInsert
AFTER INSERT ON `CaseMaster`
FOR EACH ROW
BEGIN
    INSERT INTO `AuditLog` (
        `TableName`,
        `RecordID`,
        `OperationType`,
        `NewValue`,
        `ChangedBy`,
        `ChangedByKGID`,
        `ChangeTimestamp`
    ) VALUES (
        'CaseMaster',
        CAST(NEW.CaseMasterID AS CHAR),
        'INSERT',
        JSON_OBJECT(
            'CrimeNo', NEW.CrimeNo,
            'CaseNo', NEW.CaseNo,
            'CrimeRegisteredDate', NEW.CrimeRegisteredDate,
            'PoliceStationID', NEW.PoliceStationID,
            'CaseCategoryID', NEW.CaseCategoryID,
            'CaseStatusID', NEW.CaseStatusID
        ),
        NEW.PolicePersonID,
        (SELECT KGID FROM `Employee` WHERE EmployeeID = NEW.PolicePersonID),
        CURRENT_TIMESTAMP
    );
END$$


-- =============================================================================
-- TRIGGER 2: trg_AuditCaseMasterUpdate
-- Purpose: Automatically records the historical changes in AuditLog when
--          an FIR is modified.
-- =============================================================================
CREATE TRIGGER trg_AuditCaseMasterUpdate
AFTER UPDATE ON `CaseMaster`
FOR EACH ROW
BEGIN
    INSERT INTO `AuditLog` (
        `TableName`,
        `RecordID`,
        `OperationType`,
        `OldValue`,
        `NewValue`,
        `ChangedBy`,
        `ChangedByKGID`,
        `ChangeTimestamp`
    ) VALUES (
        'CaseMaster',
        CAST(NEW.CaseMasterID AS CHAR),
        'UPDATE',
        JSON_OBJECT(
            'CrimeNo', OLD.CrimeNo,
            'CaseNo', OLD.CaseNo,
            'CrimeRegisteredDate', OLD.CrimeRegisteredDate,
            'PoliceStationID', OLD.PoliceStationID,
            'CaseCategoryID', OLD.CaseCategoryID,
            'CaseStatusID', OLD.CaseStatusID
        ),
        JSON_OBJECT(
            'CrimeNo', NEW.CrimeNo,
            'CaseNo', NEW.CaseNo,
            'CrimeRegisteredDate', NEW.CrimeRegisteredDate,
            'PoliceStationID', NEW.PoliceStationID,
            'CaseCategoryID', NEW.CaseCategoryID,
            'CaseStatusID', NEW.CaseStatusID
        ),
        NEW.PolicePersonID,
        (SELECT KGID FROM `Employee` WHERE EmployeeID = NEW.PolicePersonID),
        CURRENT_TIMESTAMP
    );
END$$


-- =============================================================================
-- TRIGGER 3: trg_InvalidateDashboardCache
-- Purpose: Automatically invalidates the pre-computed dashboard cache
--          whenever a new FIR is added or modified.
-- =============================================================================
CREATE TRIGGER trg_InvalidateDashboardCache
AFTER INSERT ON `CaseMaster`
FOR EACH ROW
BEGIN
    -- Set all cache keys matching the district/station scope to stale
    UPDATE `DashboardCache`
    SET `IsValid` = b'0',
        `LastAccessed` = CURRENT_TIMESTAMP
    WHERE `CacheScope` IN ('GLOBAL', 'DISTRICT')
       OR (`CacheScope` = 'UNIT' AND `ScopeID` = NEW.PoliceStationID);
END$$

DELIMITER ;
