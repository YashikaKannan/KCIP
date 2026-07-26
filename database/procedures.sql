-- =============================================================================
-- KCIP — Karnataka Crime Intelligence Platform
-- Phase 2: Database Design — Reusable Procedure Templates
-- File: procedures.sql
-- Platform: Zoho Catalyst Data Store (MySQL 8.0 compatible DDL)
--
-- TODO: Zoho Catalyst Data Store does not support database-level procedures.
--       - Port the procedural logic shown in these templates into
--         Catalyst Serverless Functions (Java, Node.js, or Python).
--       - Utilize Catalyst SDK transactions for ACID execution.
-- =============================================================================

DELIMITER $$

-- =============================================================================
-- PROCEDURE 1: sp_RegisterNewFIR
-- Purpose: Atomically inserts a new FIR along with its initial complainant,
--          victim, accused, and occurrence time record.
-- =============================================================================
CREATE PROCEDURE sp_RegisterNewFIR(
    IN p_CrimeNo VARCHAR(30),
    IN p_CaseNo VARCHAR(20),
    IN p_CrimeRegisteredDate DATE,
    IN p_PolicePersonID INT,
    IN p_PoliceStationID INT,
    IN p_CaseCategoryID INT,
    IN p_GravityOffenceID INT,
    IN p_CrimeMajorHeadID INT,
    IN p_CrimeMinorHeadID INT,
    IN p_BriefFacts LONGTEXT,
    IN p_OccuranceFromDate DATETIME,
    IN p_OccuranceToDate DATETIME,
    IN p_LocationDescription VARCHAR(500),
    IN p_ComplainantName VARCHAR(200),
    IN p_VictimName VARCHAR(200),
    IN p_AccusedName VARCHAR(200),
    OUT p_CaseMasterID INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- 1. Insert into core CaseMaster
    INSERT INTO `CaseMaster` (
        `CrimeNo`, `CaseNo`, `CrimeRegisteredDate`, `PolicePersonID`, 
        `PoliceStationID`, `CaseCategoryID`, `GravityOffenceID`, 
        `CrimeMajorHeadID`, `CrimeMinorHeadID`, `CaseStatusID`, `BriefFacts`
    ) VALUES (
        p_CrimeNo, p_CaseNo, p_CrimeRegisteredDate, p_PolicePersonID, 
        p_PoliceStationID, p_CaseCategoryID, p_GravityOffenceID, 
        p_CrimeMajorHeadID, p_CrimeMinorHeadID, 1, p_BriefFacts
    );

    SET p_CaseMasterID = LAST_INSERT_ID();

    -- 2. Insert Occurrence Time extension
    INSERT INTO `Inv_OccuranceTime` (
        `CaseMasterID`, `OccuranceFromDate`, `OccuranceToDate`, `LocationDescription`
    ) VALUES (
        p_CaseMasterID, p_OccuranceFromDate, p_OccuranceToDate, p_LocationDescription
    );

    -- 3. Insert Complainant details
    INSERT INTO `ComplainantDetails` (
        `CaseMasterID`, `ComplainantName`
    ) VALUES (
        p_CaseMasterID, p_ComplainantName
    );

    -- 4. Insert Victim details
    INSERT INTO `Victim` (
        `CaseMasterID`, `VictimName`
    ) VALUES (
        p_CaseMasterID, p_VictimName
    );

    -- 5. Insert Accused details
    INSERT INTO `Accused` (
        `CaseMasterID`, `AccusedName`, `PersonID`
    ) VALUES (
        p_CaseMasterID, p_AccusedName, 'A1'
    );

    COMMIT;
END$$


-- =============================================================================
-- PROCEDURE 2: sp_CalculateRepeatOffenderRisk
-- Purpose: Recalculates risk score and watchlist status for an accused person
--          based on crime volume and gravity.
-- =============================================================================
CREATE PROCEDURE sp_CalculateRepeatOffenderRisk(
    IN p_AccusedMasterID INT,
    OUT p_RiskScore DECIMAL(5,2),
    OUT p_RiskCategory VARCHAR(20)
)
BEGIN
    DECLARE v_TotalCases INT DEFAULT 0;
    DECLARE v_TotalArrests INT DEFAULT 0;
    DECLARE v_HeinousCount INT DEFAULT 0;

    -- Fetch count of cases associated with this accused person
    SELECT COUNT(*), SUM(CASE WHEN gt.LookupValue = 'Heinous' THEN 1 ELSE 0 END)
    INTO v_TotalCases, v_HeinousCount
    FROM `Accused` a
    JOIN `CaseMaster` c ON a.CaseMasterID = c.CaseMasterID
    JOIN `GravityOffence` gt ON c.GravityOffenceID = gt.GravityOffenceID
    WHERE a.AccusedMasterID = p_AccusedMasterID;

    -- Fetch total arrests
    SELECT COUNT(*) INTO v_TotalArrests
    FROM `inv_arrestsurrenderaccused` asa
    WHERE asa.AccusedMasterID = p_AccusedMasterID;

    -- Compute risk score (Weighted formula: Heinous count * 20 + general cases * 10)
    SET p_RiskScore = (v_HeinousCount * 20.0) + ((v_TotalCases - v_HeinousCount) * 10.0);
    IF p_RiskScore > 100.00 THEN
        SET p_RiskScore = 100.00;
    END IF;

    -- Classify Risk Category
    IF v_TotalCases >= 3 THEN
        SET p_RiskCategory = 'HABITUAL';
    ELSEIF p_RiskScore >= 70.00 THEN
        SET p_RiskCategory = 'HIGH';
    ELSEIF p_RiskScore >= 40.00 THEN
        SET p_RiskCategory = 'MEDIUM';
    ELSE
        SET p_RiskCategory = 'LOW';
    END IF;

    -- Save/Update RepeatOffender table
    INSERT INTO `RepeatOffender` (
        `AccusedMasterID`, `TotalCases`, `TotalArrests`, `RiskScore`, `RiskCategory`
    ) VALUES (
        p_AccusedMasterID, v_TotalCases, v_TotalArrests, p_RiskScore, p_RiskCategory
    )
    ON DUPLICATE KEY UPDATE
        `TotalCases` = v_TotalCases,
        `TotalArrests` = v_TotalArrests,
        `RiskScore` = p_RiskScore,
        `RiskCategory` = p_RiskCategory,
        `UpdatedAt` = CURRENT_TIMESTAMP;

END$$


-- =============================================================================
-- PROCEDURE 3: sp_GetCriminalNetworkGraph
-- Purpose: Returns case associations and linked criminals within N hops.
-- =============================================================================
CREATE PROCEDURE sp_GetCriminalNetworkGraph(
    IN p_CaseMasterID INT
)
BEGIN
    -- Direct connections (1-hop)
    SELECT
        SourceCaseMasterID,
        TargetCaseMasterID,
        AssociationType,
        AssociationStrength
    FROM `CrimeAssociation`
    WHERE SourceCaseMasterID = p_CaseMasterID OR TargetCaseMasterID = p_CaseMasterID;
END$$

DELIMITER ;
