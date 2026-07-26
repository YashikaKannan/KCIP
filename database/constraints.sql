-- =============================================================================
-- KCIP — Karnataka Crime Intelligence Platform
-- Phase 2: Database Design — Integrity Constraints
-- File: constraints.sql
-- Platform: Zoho Catalyst Data Store (MySQL 8.0 compatible DDL)
--
-- TODO: Zoho Catalyst Data Store does not support inline/outline SQL constraints,
--       ON DELETE/ON UPDATE cascade operations, or CHECK constraints.
--       - Implement foreign key relationships via the Catalyst Console (Table Relations).
--       - Implement check constraints, uniqueness logic, and cascading deletions
--         in Catalyst Serverless Functions (Java/Node.js/Python SDK).
-- =============================================================================

-- =============================================================================
-- 1. Primary & Unique Keys (Entity Integrity)
-- =============================================================================

-- Operational Schema
ALTER TABLE `State` ADD PRIMARY KEY (`StateID`);
ALTER TABLE `District` ADD PRIMARY KEY (`DistrictID`);
ALTER TABLE `UnitType` ADD PRIMARY KEY (`UnitTypeID`);
ALTER TABLE `Unit` ADD PRIMARY KEY (`UnitID`);
ALTER TABLE `Rank` ADD PRIMARY KEY (`RankID`);
ALTER TABLE `Designation` ADD PRIMARY KEY (`DesignationID`);
ALTER TABLE `Employee` ADD PRIMARY KEY (`EmployeeID`), ADD UNIQUE KEY `uq_employee_kgid` (`KGID`);
ALTER TABLE `Court` ADD PRIMARY KEY (`CourtID`);
ALTER TABLE `CaseCategory` ADD PRIMARY KEY (`CaseCategoryID`);
ALTER TABLE `GravityOffence` ADD PRIMARY KEY (`GravityOffenceID`);
ALTER TABLE `CrimeHead` ADD PRIMARY KEY (`CrimeHeadID`);
ALTER TABLE `CrimeSubHead` ADD PRIMARY KEY (`CrimeSubHeadID`);
ALTER TABLE `Act` ADD PRIMARY KEY (`ActCode`);
ALTER TABLE `Section` ADD PRIMARY KEY (`ActCode`, `SectionCode`);
ALTER TABLE `CrimeHeadActSection` ADD PRIMARY KEY (`CrimeHeadID`, `ActCode`, `SectionCode`);
ALTER TABLE `CaseStatusMaster` ADD PRIMARY KEY (`CaseStatusID`);
ALTER TABLE `OccupationMaster` ADD PRIMARY KEY (`OccupationID`);
ALTER TABLE `ReligionMaster` ADD PRIMARY KEY (`ReligionID`);
ALTER TABLE `CasteMaster` ADD PRIMARY KEY (`caste_master_id`);
ALTER TABLE `CaseMaster` ADD PRIMARY KEY (`CaseMasterID`), ADD UNIQUE KEY `uq_casemaster_crimeno` (`CrimeNo`);
ALTER TABLE `Inv_OccuranceTime` ADD PRIMARY KEY (`OccuranceTimeID`), ADD UNIQUE KEY `uq_inv_occurancetime_case` (`CaseMasterID`);
ALTER TABLE `ComplainantDetails` ADD PRIMARY KEY (`ComplainantID`);
ALTER TABLE `ActSectionAssociation` ADD PRIMARY KEY (`CaseMasterID`, `ActID`, `SectionID`);
ALTER TABLE `Victim` ADD PRIMARY KEY (`VictimMasterID`);
ALTER TABLE `Accused` ADD PRIMARY KEY (`AccusedMasterID`);
ALTER TABLE `ArrestSurrender` ADD PRIMARY KEY (`ArrestSurrenderID`);
ALTER TABLE `inv_arrestsurrenderaccused` ADD PRIMARY KEY (`ArrestSurrenderID`, `AccusedMasterID`);
ALTER TABLE `ChargesheetDetails` ADD PRIMARY KEY (`CSID`);

-- Intelligence Schema
ALTER TABLE `CrimePrediction` ADD PRIMARY KEY (`PredictionID`);
ALTER TABLE `CrimeHotspot` ADD PRIMARY KEY (`HotspotID`);
ALTER TABLE `CrimeAssociation` ADD PRIMARY KEY (`AssociationID`), ADD UNIQUE KEY `uq_crime_association` (`SourceCaseMasterID`, `TargetCaseMasterID`, `AssociationType`);
ALTER TABLE `RepeatOffender` ADD PRIMARY KEY (`RepeatOffenderID`), ADD UNIQUE KEY `uq_repeatoffender_accused` (`AccusedMasterID`);
ALTER TABLE `MOProfile` ADD PRIMARY KEY (`MOProfileID`);
ALTER TABLE `DashboardCache` ADD PRIMARY KEY (`CacheID`), ADD UNIQUE KEY `uq_dashcache_key` (`CacheKey`);
ALTER TABLE `AuditLog` ADD PRIMARY KEY (`AuditID`);
ALTER TABLE `AIAlert` ADD PRIMARY KEY (`AlertID`);


-- =============================================================================
-- 2. Foreign Keys (Referential Integrity) & Cascade Rules
-- =============================================================================

-- District -> State
ALTER TABLE `District` ADD CONSTRAINT `fk_district_state`
    FOREIGN KEY (`StateID`) REFERENCES `State` (`StateID`) ON UPDATE CASCADE ON DELETE RESTRICT;

-- Unit -> UnitType, State, District
ALTER TABLE `Unit`
    ADD CONSTRAINT `fk_unit_unittype` FOREIGN KEY (`TypeID`) REFERENCES `UnitType` (`UnitTypeID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    ADD CONSTRAINT `fk_unit_state` FOREIGN KEY (`StateID`) REFERENCES `State` (`StateID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    ADD CONSTRAINT `fk_unit_district` FOREIGN KEY (`DistrictID`) REFERENCES `District` (`DistrictID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    ADD CONSTRAINT `fk_unit_parent` FOREIGN KEY (`ParentUnit`) REFERENCES `Unit` (`UnitID`) ON UPDATE CASCADE ON DELETE SET NULL;

-- Employee -> District, Unit, Rank, Designation
ALTER TABLE `Employee`
    ADD CONSTRAINT `fk_employee_district` FOREIGN KEY (`DistrictID`) REFERENCES `District` (`DistrictID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    ADD CONSTRAINT `fk_employee_unit` FOREIGN KEY (`UnitID`) REFERENCES `Unit` (`UnitID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    ADD CONSTRAINT `fk_employee_rank` FOREIGN KEY (`RankID`) REFERENCES `Rank` (`RankID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    ADD CONSTRAINT `fk_employee_designation` FOREIGN KEY (`DesignationID`) REFERENCES `Designation` (`DesignationID`) ON UPDATE CASCADE ON DELETE RESTRICT;

-- Court -> District, State
ALTER TABLE `Court`
    ADD CONSTRAINT `fk_court_district` FOREIGN KEY (`DistrictID`) REFERENCES `District` (`DistrictID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    ADD CONSTRAINT `fk_court_state` FOREIGN KEY (`StateID`) REFERENCES `State` (`StateID`) ON UPDATE CASCADE ON DELETE RESTRICT;

-- CrimeSubHead -> CrimeHead
ALTER TABLE `CrimeSubHead` ADD CONSTRAINT `fk_crimesubhead_crimehead`
    FOREIGN KEY (`CrimeHeadID`) REFERENCES `CrimeHead` (`CrimeHeadID`) ON UPDATE CASCADE ON DELETE RESTRICT;

-- Section -> Act
ALTER TABLE `Section` ADD CONSTRAINT `fk_section_act`
    FOREIGN KEY (`ActCode`) REFERENCES `Act` (`ActCode`) ON UPDATE CASCADE ON DELETE RESTRICT;

-- CaseMaster (FIR Hub)
ALTER TABLE `CaseMaster`
    ADD CONSTRAINT `fk_casemaster_employee` FOREIGN KEY (`PolicePersonID`) REFERENCES `Employee` (`EmployeeID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    ADD CONSTRAINT `fk_casemaster_unit` FOREIGN KEY (`PoliceStationID`) REFERENCES `Unit` (`UnitID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    ADD CONSTRAINT `fk_casemaster_casecategory` FOREIGN KEY (`CaseCategoryID`) REFERENCES `CaseCategory` (`CaseCategoryID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    ADD CONSTRAINT `fk_casemaster_gravityoffence` FOREIGN KEY (`GravityOffenceID`) REFERENCES `GravityOffence` (`GravityOffenceID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    ADD CONSTRAINT `fk_casemaster_crimehead` FOREIGN KEY (`CrimeMajorHeadID`) REFERENCES `CrimeHead` (`CrimeHeadID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    ADD CONSTRAINT `fk_casemaster_crimesubhead` FOREIGN KEY (`CrimeMinorHeadID`) REFERENCES `CrimeSubHead` (`CrimeSubHeadID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    ADD CONSTRAINT `fk_casemaster_casestatus` FOREIGN KEY (`CaseStatusID`) REFERENCES `CaseStatusMaster` (`CaseStatusID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    ADD CONSTRAINT `fk_casemaster_court` FOREIGN KEY (`CourtID`) REFERENCES `Court` (`CourtID`) ON UPDATE CASCADE ON DELETE SET NULL;


-- =============================================================================
-- 3. Check Constraints (Domain Integrity)
-- =============================================================================

-- Chargesheet cstype code validation
ALTER TABLE `ChargesheetDetails` ADD CONSTRAINT `chk_chargesheet_cstype`
    CHECK (`cstype` IN ('A', 'B', 'C'));

-- ML Model Confidence Scores constraint (0% - 100%)
ALTER TABLE `CrimePrediction` ADD CONSTRAINT `chk_pred_confidence`
    CHECK (`ConfidenceScore` IS NULL OR (`ConfidenceScore` >= 0.00 AND `ConfidenceScore` <= 100.00));

ALTER TABLE `MOProfile` ADD CONSTRAINT `chk_mo_confidence`
    CHECK (`PatternConfidence` IS NULL OR (`PatternConfidence` >= 0.00 AND `PatternConfidence` <= 100.00));

ALTER TABLE `RepeatOffender` ADD CONSTRAINT `chk_ro_riskscore`
    CHECK (`RiskScore` IS NULL OR (`RiskScore` >= 0.00 AND `RiskScore` <= 100.00));

-- Association Strength constraint (0% - 100%)
ALTER TABLE `CrimeAssociation` ADD CONSTRAINT `chk_assoc_strength`
    CHECK (`AssociationStrength` IS NULL OR (`AssociationStrength` >= 0.00 AND `AssociationStrength` <= 100.00));

-- Prevent self-loop in case association graph
ALTER TABLE `CrimeAssociation` ADD CONSTRAINT `chk_assoc_different_cases`
    CHECK (`SourceCaseMasterID` <> `TargetCaseMasterID`);
