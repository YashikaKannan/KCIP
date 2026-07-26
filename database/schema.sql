-- =============================================================================
-- KCIP — Karnataka Crime Intelligence Platform
-- Phase 2: Database Design — Operational Schema
-- File: schema.sql
-- Source of Truth: Police_FIR_ER_Diagram.pdf
-- Platform: Zoho Catalyst Data Store (MySQL 8.0 compatible)
-- Encoding: utf8mb4
-- Engine: InnoDB
--
-- IMPORTANT:
--   This file faithfully mirrors the ER Diagram.
--   Do NOT modify table names, column names, or relationships.
--   All operational tables are created here in strict dependency order.
--
-- Dependency Order:
--   1.  State
--   2.  District
--   3.  UnitType
--   4.  Unit
--   5.  Rank
--   6.  Designation
--   7.  Employee
--   8.  Court
--   9.  CaseCategory
--   10. GravityOffence
--   11. CrimeHead
--   12. CrimeSubHead
--   13. Act
--   14. Section
--   15. CrimeHeadActSection
--   16. CaseStatusMaster
--   17. OccupationMaster
--   18. ReligionMaster
--   19. CasteMaster
--   20. CaseMaster
--   21. Inv_OccuranceTime
--   22. ComplainantDetails
--   23. ActSectionAssociation
--   24. Victim
--   25. Accused
--   26. ArrestSurrender
--   27. inv_arrestsurrenderaccused
--   28. ChargesheetDetails
--
-- Generated: 2026-07-26
-- Author: KCIP Database Architecture Team
-- =============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- =============================================================================
-- TABLE 1: State
-- Purpose: Master list of states/union territories.
--          Referenced by District, Court, Unit, ArrestSurrender.
-- =============================================================================
CREATE TABLE IF NOT EXISTS `State` (
    `StateID`       INT          NOT NULL AUTO_INCREMENT COMMENT 'Primary key — unique identifier for the state',
    `StateName`     VARCHAR(100) NOT NULL               COMMENT 'Name of the state (e.g., Karnataka, Kerala)',
    `NationalityID` INT          NULL                   COMMENT 'Nationality reference ID (for multi-nationality support)',
    `Active`        BIT(1)       NOT NULL DEFAULT b'1'  COMMENT 'Record active flag: 1=Active, 0=Inactive',
    PRIMARY KEY (`StateID`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Master table of Indian states and union territories';

-- =============================================================================
-- TABLE 2: District
-- Purpose: Master list of districts within a state.
--          Referenced by Court, Unit, Employee, ArrestSurrender.
-- =============================================================================
CREATE TABLE IF NOT EXISTS `District` (
    `DistrictID`   INT          NOT NULL AUTO_INCREMENT COMMENT 'Primary key — unique identifier for the district',
    `DistrictName` VARCHAR(100) NOT NULL               COMMENT 'Name of the district (e.g., Bengaluru Urban, Mysuru)',
    `StateID`      INT          NOT NULL               COMMENT 'FK → State.StateID — state this district belongs to',
    `Active`       BIT(1)       NOT NULL DEFAULT b'1'  COMMENT 'Record active flag: 1=Active, 0=Inactive',
    PRIMARY KEY (`DistrictID`),
    CONSTRAINT `fk_district_state`
        FOREIGN KEY (`StateID`) REFERENCES `State` (`StateID`)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Master table of districts within each state';

-- =============================================================================
-- TABLE 3: UnitType
-- Purpose: Defines types/categories of police units (Police Station, Circle,
--          Sub-Division, District HQ, Range, State HQ).
--          Referenced by Unit.TypeID.
-- =============================================================================
CREATE TABLE IF NOT EXISTS `UnitType` (
    `UnitTypeID`   INT          NOT NULL AUTO_INCREMENT COMMENT 'Primary key — unique identifier for the unit type',
    `UnitTypeName` VARCHAR(100) NOT NULL               COMMENT 'Name of the unit type (e.g., Police Station, Circle Office)',
    `CityDistState` VARCHAR(50) NULL                   COMMENT 'Operational level: City / District / State',
    `Hierarchy`    INT          NULL                   COMMENT 'Hierarchy level (lower number = higher authority)',
    `Active`       BIT(1)       NOT NULL DEFAULT b'1'  COMMENT 'Record active flag: 1=Active, 0=Inactive',
    PRIMARY KEY (`UnitTypeID`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Master table defining types/categories of police organisational units';

-- =============================================================================
-- TABLE 4: Unit
-- Purpose: Represents any police organisational unit (station, circle, district
--          headquarters etc). Supports hierarchy via self-reference ParentUnit.
--          Referenced by CaseMaster.PoliceStationID, Employee.UnitID,
--          ArrestSurrender.PoliceStationID.
-- =============================================================================
CREATE TABLE IF NOT EXISTS `Unit` (
    `UnitID`        INT          NOT NULL AUTO_INCREMENT COMMENT 'Primary key — unique identifier for the police unit',
    `UnitName`      VARCHAR(150) NOT NULL               COMMENT 'Name of the unit or police station',
    `TypeID`        INT          NOT NULL               COMMENT 'FK → UnitType.UnitTypeID — type/category of this unit',
    `ParentUnit`    INT          NULL                   COMMENT 'FK → Unit.UnitID (self-reference) — parent unit for hierarchy',
    `NationalityID` INT          NULL                   COMMENT 'Nationality reference ID',
    `StateID`       INT          NOT NULL               COMMENT 'FK → State.StateID — state the unit belongs to',
    `DistrictID`    INT          NOT NULL               COMMENT 'FK → District.DistrictID — district the unit belongs to',
    `Active`        BIT(1)       NOT NULL DEFAULT b'1'  COMMENT 'Record active flag: 1=Active, 0=Inactive',
    PRIMARY KEY (`UnitID`),
    CONSTRAINT `fk_unit_unittype`
        FOREIGN KEY (`TypeID`) REFERENCES `UnitType` (`UnitTypeID`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `fk_unit_parent`
        FOREIGN KEY (`ParentUnit`) REFERENCES `Unit` (`UnitID`)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT `fk_unit_state`
        FOREIGN KEY (`StateID`) REFERENCES `State` (`StateID`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `fk_unit_district`
        FOREIGN KEY (`DistrictID`) REFERENCES `District` (`DistrictID`)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Master table of police organisational units with hierarchical support';

-- =============================================================================
-- TABLE 5: Rank
-- Purpose: Master list of police ranks (Constable → DGP).
--          Referenced by Employee.RankID.
-- =============================================================================
CREATE TABLE IF NOT EXISTS `Rank` (
    `RankID`    INT          NOT NULL AUTO_INCREMENT COMMENT 'Primary key — unique identifier for the rank',
    `RankName`  VARCHAR(100) NOT NULL               COMMENT 'Name of the police rank (e.g., Constable, Inspector, DSP)',
    `Hierarchy` INT          NULL                   COMMENT 'Rank hierarchy level (lower number = higher rank)',
    `Active`    BIT(1)       NOT NULL DEFAULT b'1'  COMMENT 'Record active flag: 1=Active, 0=Inactive',
    PRIMARY KEY (`RankID`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Master table of police ranks with hierarchy levels';

-- =============================================================================
-- TABLE 6: Designation
-- Purpose: Master list of functional designations (SHO, IO, Crime Branch Officer).
--          Referenced by Employee.DesignationID.
-- =============================================================================
CREATE TABLE IF NOT EXISTS `Designation` (
    `DesignationID`   INT          NOT NULL AUTO_INCREMENT COMMENT 'Primary key — unique identifier for the designation',
    `DesignationName` VARCHAR(100) NOT NULL               COMMENT 'Name of the designation (e.g., Investigating Officer, SHO)',
    `Active`          BIT(1)       NOT NULL DEFAULT b'1'  COMMENT 'Record active flag: 1=Active, 0=Inactive',
    `SortOrder`       INT          NULL                   COMMENT 'Display sort order for dropdowns and reports',
    PRIMARY KEY (`DesignationID`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Master table of functional police designations';

-- =============================================================================
-- TABLE 7: Employee
-- Purpose: Stores details of all Karnataka Police employees.
--          Referenced by CaseMaster.PolicePersonID, ArrestSurrender.IOID,
--          ChargesheetDetails.PolicePersonID.
-- =============================================================================
CREATE TABLE IF NOT EXISTS `Employee` (
    `EmployeeID`           INT          NOT NULL AUTO_INCREMENT COMMENT 'Primary key — unique identifier for the police employee',
    `DistrictID`           INT          NOT NULL               COMMENT 'FK → District.DistrictID — district the employee is posted in',
    `UnitID`               INT          NOT NULL               COMMENT 'FK → Unit.UnitID — unit/police station the employee is assigned to',
    `RankID`               INT          NOT NULL               COMMENT 'FK → Rank.RankID — current rank of the employee',
    `DesignationID`        INT          NOT NULL               COMMENT 'FK → Designation.DesignationID — current designation',
    `KGID`                 VARCHAR(50)  NOT NULL               COMMENT 'Karnataka Government ID — unique government employee number',
    `FirstName`            VARCHAR(100) NOT NULL               COMMENT 'First name of the employee',
    `EmployeeDOB`          DATE         NULL                   COMMENT 'Date of birth of the employee',
    `GenderID`             INT          NULL                   COMMENT 'Gender of the employee (lookup value)',
    `BloodGroupID`         INT          NULL                   COMMENT 'Blood group of the employee (lookup value)',
    `PhysicallyChallenged` BIT(1)       NOT NULL DEFAULT b'0'  COMMENT 'Flag: 1=Physically challenged, 0=Not',
    `AppointmentDate`      DATE         NULL                   COMMENT 'Date of appointment to government service',
    PRIMARY KEY (`EmployeeID`),
    UNIQUE KEY `uq_employee_kgid` (`KGID`),
    CONSTRAINT `fk_employee_district`
        FOREIGN KEY (`DistrictID`) REFERENCES `District` (`DistrictID`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `fk_employee_unit`
        FOREIGN KEY (`UnitID`) REFERENCES `Unit` (`UnitID`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `fk_employee_rank`
        FOREIGN KEY (`RankID`) REFERENCES `Rank` (`RankID`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `fk_employee_designation`
        FOREIGN KEY (`DesignationID`) REFERENCES `Designation` (`DesignationID`)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Master table of Karnataka Police employees';

-- =============================================================================
-- TABLE 8: Court
-- Purpose: Master list of courts where cases are tried.
--          Referenced by CaseMaster.CourtID, ArrestSurrender.CourtID.
-- =============================================================================
CREATE TABLE IF NOT EXISTS `Court` (
    `CourtID`    INT          NOT NULL AUTO_INCREMENT COMMENT 'Primary key — unique identifier for the court',
    `CourtName`  VARCHAR(200) NOT NULL               COMMENT 'Full name of the court',
    `DistrictID` INT          NOT NULL               COMMENT 'FK → District.DistrictID — district where the court is located',
    `StateID`    INT          NOT NULL               COMMENT 'FK → State.StateID — state where the court is located',
    `Active`     BIT(1)       NOT NULL DEFAULT b'1'  COMMENT 'Record active flag: 1=Active, 0=Inactive',
    PRIMARY KEY (`CourtID`),
    CONSTRAINT `fk_court_district`
        FOREIGN KEY (`DistrictID`) REFERENCES `District` (`DistrictID`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `fk_court_state`
        FOREIGN KEY (`StateID`) REFERENCES `State` (`StateID`)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Master table of courts where criminal cases are tried';

-- =============================================================================
-- TABLE 9: CaseCategory
-- Purpose: Lookup table for case categories.
--          FIR format: 1 digit category code embedded in CrimeNo.
--          FIR=1, UDR=3, Zero FIR=8, PAR=4
--          Referenced by CaseMaster.CaseCategoryID.
-- =============================================================================
CREATE TABLE IF NOT EXISTS `CaseCategory` (
    `CaseCategoryID` INT          NOT NULL AUTO_INCREMENT COMMENT 'Primary key — unique identifier for the case category',
    `LookupValue`    VARCHAR(100) NOT NULL               COMMENT 'Category name (e.g., FIR, UDR, PAR, Zero FIR)',
    PRIMARY KEY (`CaseCategoryID`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Lookup table for case categories — code embedded in CrimeNo';

-- =============================================================================
-- TABLE 10: GravityOffence
-- Purpose: Lookup table for offence gravity levels (Heinous, Non-Heinous etc).
--          Referenced by CaseMaster.GravityOffenceID.
-- =============================================================================
CREATE TABLE IF NOT EXISTS `GravityOffence` (
    `GravityOffenceID` INT          NOT NULL AUTO_INCREMENT COMMENT 'Primary key — unique identifier for the gravity level',
    `LookupValue`      VARCHAR(100) NOT NULL               COMMENT 'Gravity description (e.g., Heinous, Non-Heinous, Petty)',
    PRIMARY KEY (`GravityOffenceID`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Lookup table for offence gravity levels';

-- =============================================================================
-- TABLE 11: CrimeHead
-- Purpose: Major crime classification head (e.g., Crimes Against Body,
--          Crimes Against Property). Top level of 2-tier crime classification.
--          Referenced by CaseMaster.CrimeMajorHeadID, CrimeSubHead.CrimeHeadID.
-- =============================================================================
CREATE TABLE IF NOT EXISTS `CrimeHead` (
    `CrimeHeadID`    INT          NOT NULL AUTO_INCREMENT COMMENT 'Primary key — unique identifier for the major crime head',
    `CrimeGroupName` VARCHAR(200) NOT NULL               COMMENT 'Name of the crime group/major head (e.g., Crimes Against Body)',
    `Active`         BIT(1)       NOT NULL DEFAULT b'1'  COMMENT 'Record active flag: 1=Active, 0=Inactive',
    PRIMARY KEY (`CrimeHeadID`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Major crime classification heads — top tier of 2-level crime taxonomy';

-- =============================================================================
-- TABLE 12: CrimeSubHead
-- Purpose: Minor crime classification under a major CrimeHead
--          (e.g., Murder under Crimes Against Body).
--          Referenced by CaseMaster.CrimeMinorHeadID.
-- =============================================================================
CREATE TABLE IF NOT EXISTS `CrimeSubHead` (
    `CrimeSubHeadID` INT          NOT NULL AUTO_INCREMENT COMMENT 'Primary key — unique identifier for the crime sub-head',
    `CrimeHeadID`    INT          NOT NULL               COMMENT 'FK → CrimeHead.CrimeHeadID — parent major crime head',
    `CrimeHeadName`  VARCHAR(200) NOT NULL               COMMENT 'Name of this crime sub-head (e.g., Murder, Robbery)',
    `SeqID`          INT          NULL                   COMMENT 'Display/sort sequence number for ordering sub-heads',
    PRIMARY KEY (`CrimeSubHeadID`),
    CONSTRAINT `fk_crimesubhead_crimehead`
        FOREIGN KEY (`CrimeHeadID`) REFERENCES `CrimeHead` (`CrimeHeadID`)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Minor crime classification — second tier under CrimeHead';

-- =============================================================================
-- TABLE 13: Act
-- Purpose: Master list of legal acts (IPC, NDPS, POCSO etc).
--          ActCode is a VARCHAR PK (e.g., 'IPC', 'NDPS').
--          Referenced by Section.ActCode, CrimeHeadActSection.ActCode,
--          ActSectionAssociation.ActID.
-- =============================================================================
CREATE TABLE IF NOT EXISTS `Act` (
    `ActCode`        VARCHAR(50)  NOT NULL COMMENT 'Primary key — unique code for the legal act (e.g., IPC, NDPS)',
    `ActDescription` VARCHAR(500) NULL     COMMENT 'Full official name/description of the act',
    `ShortName`      VARCHAR(100) NULL     COMMENT 'Abbreviated/common name of the act',
    `Active`         BIT(1)       NOT NULL DEFAULT b'1' COMMENT 'Record active flag: 1=Active, 0=Inactive',
    PRIMARY KEY (`ActCode`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Master table of legal acts under which FIR charges are framed';

-- =============================================================================
-- TABLE 14: Section
-- Purpose: Individual sections within a legal Act (e.g., IPC 302, IPC 376).
--          Composite PK on (ActCode, SectionCode).
--          Referenced by ActSectionAssociation.SectionID.
-- =============================================================================
CREATE TABLE IF NOT EXISTS `Section` (
    `ActCode`            VARCHAR(50)  NOT NULL COMMENT 'FK → Act.ActCode — parent act this section belongs to',
    `SectionCode`        VARCHAR(50)  NOT NULL COMMENT 'Section number/code (e.g., 302, 307, 498A)',
    `SectionDescription` VARCHAR(500) NULL     COMMENT 'Full description of the section',
    `Active`             BIT(1)       NOT NULL DEFAULT b'1' COMMENT 'Record active flag: 1=Active, 0=Inactive',
    PRIMARY KEY (`ActCode`, `SectionCode`),
    CONSTRAINT `fk_section_act`
        FOREIGN KEY (`ActCode`) REFERENCES `Act` (`ActCode`)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Individual sections within legal Acts — composite PK (ActCode, SectionCode)';

-- =============================================================================
-- TABLE 15: CrimeHeadActSection
-- Purpose: Maps CrimeHead to Act and Section codes.
--          Allows a crime head to be associated with multiple act-sections.
--          Composite PK on (CrimeHeadID, ActCode, SectionCode).
-- =============================================================================
CREATE TABLE IF NOT EXISTS `CrimeHeadActSection` (
    `CrimeHeadID`  INT         NOT NULL COMMENT 'FK → CrimeHead.CrimeHeadID — crime head this mapping belongs to',
    `ActCode`      VARCHAR(50) NOT NULL COMMENT 'FK → Act.ActCode — legal act linked to this crime head',
    `SectionCode`  VARCHAR(100) NOT NULL COMMENT 'Section code from the act applicable to this crime head',
    PRIMARY KEY (`CrimeHeadID`, `ActCode`, `SectionCode`),
    CONSTRAINT `fk_chas_crimehead`
        FOREIGN KEY (`CrimeHeadID`) REFERENCES `CrimeHead` (`CrimeHeadID`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `fk_chas_act`
        FOREIGN KEY (`ActCode`) REFERENCES `Act` (`ActCode`)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Junction table mapping CrimeHead to applicable Act and Section codes';

-- =============================================================================
-- TABLE 16: CaseStatusMaster
-- Purpose: Lookup table for case status workflow states.
--          Referenced by CaseMaster.CaseStatusID.
-- =============================================================================
CREATE TABLE IF NOT EXISTS `CaseStatusMaster` (
    `CaseStatusID`   INT          NOT NULL AUTO_INCREMENT COMMENT 'Primary key — unique identifier for each case status',
    `CaseStatusName` VARCHAR(100) NOT NULL               COMMENT 'Status name (e.g., Under Investigation, Charge Sheeted, Closed)',
    PRIMARY KEY (`CaseStatusID`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Lookup table for FIR/case workflow status stages';

-- =============================================================================
-- TABLE 17: OccupationMaster
-- Purpose: Lookup table for complainant occupations.
--          Referenced by ComplainantDetails.OccupationID.
-- =============================================================================
CREATE TABLE IF NOT EXISTS `OccupationMaster` (
    `OccupationID`   INT          NOT NULL AUTO_INCREMENT COMMENT 'Primary key — unique identifier for each occupation',
    `OccupationName` VARCHAR(150) NOT NULL               COMMENT 'Name of the occupation (e.g., Farmer, Government Employee)',
    PRIMARY KEY (`OccupationID`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Lookup table for complainant occupations';

-- =============================================================================
-- TABLE 18: ReligionMaster
-- Purpose: Lookup table for complainant religion.
--          Referenced by ComplainantDetails.ReligionID.
-- =============================================================================
CREATE TABLE IF NOT EXISTS `ReligionMaster` (
    `ReligionID`   INT          NOT NULL AUTO_INCREMENT COMMENT 'Primary key — unique identifier for each religion',
    `ReligionName` VARCHAR(100) NOT NULL               COMMENT 'Name of the religion (e.g., Hindu, Muslim, Christian)',
    PRIMARY KEY (`ReligionID`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Lookup table for religions of complainants';

-- =============================================================================
-- TABLE 19: CasteMaster
-- Purpose: Lookup table for complainant caste.
--          Note: Column names use snake_case as per ER Diagram.
--          Referenced by ComplainantDetails.CasteID.
-- =============================================================================
CREATE TABLE IF NOT EXISTS `CasteMaster` (
    `caste_master_id`   INT          NOT NULL AUTO_INCREMENT COMMENT 'Primary key — unique identifier for each caste',
    `caste_master_name` VARCHAR(150) NOT NULL               COMMENT 'Name of the caste',
    PRIMARY KEY (`caste_master_id`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Lookup table for caste of complainants';

-- =============================================================================
-- TABLE 20: CaseMaster
-- Purpose: Central table of the FIR system. Every registered FIR/UDR/PAR/Zero FIR
--          is a row in this table. Acts as the hub for all case-related entities.
--
-- CrimeNo Format:
--   [1 digit CaseCategoryCode]
--   [4 digit DistrictID]
--   [4 digit PoliceStationID (UnitID)]
--   [4 digit Year]
--   [5 digit Running Serial Number]
--   Example: FIR → 104430006202600001
--            UDR → 304430006202600001
--
-- CaseNo Format (last 9 digits of CrimeNo):
--   [4 digit Year][5 digit Running Serial] → e.g., 202600001
-- =============================================================================
CREATE TABLE IF NOT EXISTS `CaseMaster` (
    `CaseMasterID`       INT          NOT NULL AUTO_INCREMENT  COMMENT 'Primary key — unique identifier for each FIR/case',
    `CrimeNo`            VARCHAR(30)  NOT NULL                 COMMENT 'Crime Number: [1-CatCode][4-DistrictID][4-UnitID][4-Year][5-Serial]',
    `CaseNo`             VARCHAR(20)  NOT NULL                 COMMENT 'Case Number: last 9 digits of CrimeNo (YYYY + 5-digit serial)',
    `CrimeRegisteredDate` DATE        NOT NULL                 COMMENT 'Date when the FIR was officially registered',
    `PolicePersonID`     INT          NOT NULL                 COMMENT 'FK → Employee.EmployeeID — officer who registered the FIR',
    `PoliceStationID`    INT          NOT NULL                 COMMENT 'FK → Unit.UnitID — police station where FIR is registered',
    `CaseCategoryID`     INT          NOT NULL                 COMMENT 'FK → CaseCategory.CaseCategoryID — category of the case',
    `GravityOffenceID`   INT          NOT NULL                 COMMENT 'FK → GravityOffence.GravityOffenceID — gravity level of offence',
    `CrimeMajorHeadID`   INT          NOT NULL                 COMMENT 'FK → CrimeHead.CrimeHeadID — major crime head classification',
    `CrimeMinorHeadID`   INT          NOT NULL                 COMMENT 'FK → CrimeSubHead.CrimeSubHeadID — minor crime sub-head',
    `CaseStatusID`       INT          NOT NULL                 COMMENT 'FK → CaseStatusMaster.CaseStatusID — current status of the case',
    `CourtID`            INT          NULL                     COMMENT 'FK → Court.CourtID — court where the case is being heard (NULL if not yet filed)',
    `IncidentFromDate`   DATETIME     NULL                     COMMENT 'Start date and time of the incident',
    `IncidentToDate`     DATETIME     NULL                     COMMENT 'End date and time of the incident',
    `InfoReceivedPSDate` DATETIME     NULL                     COMMENT 'Date and time when police station received information',
    `latitude`           DECIMAL(10,8) NULL                    COMMENT 'GPS latitude coordinate of the incident location',
    `longitude`          DECIMAL(11,8) NULL                    COMMENT 'GPS longitude coordinate of the incident location',
    `BriefFacts`         LONGTEXT     NULL                     COMMENT 'Summary of the case facts (free-form narrative)',
    `CreatedAt`          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
    `UpdatedAt`          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Record last updated timestamp',
    PRIMARY KEY (`CaseMasterID`),
    UNIQUE KEY `uq_casemaster_crimeno` (`CrimeNo`),
    CONSTRAINT `fk_casemaster_employee`
        FOREIGN KEY (`PolicePersonID`) REFERENCES `Employee` (`EmployeeID`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `fk_casemaster_unit`
        FOREIGN KEY (`PoliceStationID`) REFERENCES `Unit` (`UnitID`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `fk_casemaster_casecategory`
        FOREIGN KEY (`CaseCategoryID`) REFERENCES `CaseCategory` (`CaseCategoryID`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `fk_casemaster_gravityoffence`
        FOREIGN KEY (`GravityOffenceID`) REFERENCES `GravityOffence` (`GravityOffenceID`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `fk_casemaster_crimehead`
        FOREIGN KEY (`CrimeMajorHeadID`) REFERENCES `CrimeHead` (`CrimeHeadID`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `fk_casemaster_crimesubhead`
        FOREIGN KEY (`CrimeMinorHeadID`) REFERENCES `CrimeSubHead` (`CrimeSubHeadID`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `fk_casemaster_casestatus`
        FOREIGN KEY (`CaseStatusID`) REFERENCES `CaseStatusMaster` (`CaseStatusID`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `fk_casemaster_court`
        FOREIGN KEY (`CourtID`) REFERENCES `Court` (`CourtID`)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Central FIR table — hub entity for all case-related records';

-- =============================================================================
-- TABLE 21: Inv_OccuranceTime
-- Purpose: One-to-One extension of CaseMaster capturing precise occurrence time
--          and location details of the incident.
--          Relationship: One CaseMaster → One Inv_OccuranceTime (UNIQUE FK).
-- =============================================================================
CREATE TABLE IF NOT EXISTS `Inv_OccuranceTime` (
    `OccuranceTimeID`     INT           NOT NULL AUTO_INCREMENT COMMENT 'Primary key — unique identifier',
    `CaseMasterID`        INT           NOT NULL                COMMENT 'FK → CaseMaster.CaseMasterID — UNIQUE: one record per case',
    `OccuranceFromDate`   DATETIME      NULL                    COMMENT 'Start date and time of occurrence',
    `OccuranceToDate`     DATETIME      NULL                    COMMENT 'End date and time of occurrence',
    `LocationDescription` VARCHAR(500)  NULL                    COMMENT 'Human-readable description of the occurrence location',
    `Latitude`            DECIMAL(10,8) NULL                    COMMENT 'GPS latitude of occurrence location',
    `Longitude`           DECIMAL(11,8) NULL                    COMMENT 'GPS longitude of occurrence location',
    `CreatedAt`           DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
    PRIMARY KEY (`OccuranceTimeID`),
    UNIQUE KEY `uq_inv_occurancetime_case` (`CaseMasterID`),
    CONSTRAINT `fk_inv_occurancetime_case`
        FOREIGN KEY (`CaseMasterID`) REFERENCES `CaseMaster` (`CaseMasterID`)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='One-to-One extension of CaseMaster: precise occurrence time and location';

-- =============================================================================
-- TABLE 22: ComplainantDetails
-- Purpose: Details of the complainant(s) who filed the FIR.
--          One CaseMaster can have multiple complainants (One-to-Many).
-- =============================================================================
CREATE TABLE IF NOT EXISTS `ComplainantDetails` (
    `ComplainantID`   INT          NOT NULL AUTO_INCREMENT COMMENT 'Primary key — unique identifier for the complainant',
    `CaseMasterID`    INT          NOT NULL               COMMENT 'FK → CaseMaster.CaseMasterID — FIR this complainant belongs to',
    `ComplainantName` VARCHAR(200) NOT NULL               COMMENT 'Full name of the complainant',
    `AgeYear`         INT          NULL                   COMMENT 'Age of the complainant in years',
    `OccupationID`    INT          NULL                   COMMENT 'FK → OccupationMaster.OccupationID — occupation of the complainant',
    `ReligionID`      INT          NULL                   COMMENT 'FK → ReligionMaster.ReligionID — religion of the complainant',
    `CasteID`         INT          NULL                   COMMENT 'FK → CasteMaster.caste_master_id — caste of the complainant',
    `GenderID`        INT          NULL                   COMMENT 'Gender of the complainant (lookup value: M/F/T)',
    PRIMARY KEY (`ComplainantID`),
    CONSTRAINT `fk_complainant_case`
        FOREIGN KEY (`CaseMasterID`) REFERENCES `CaseMaster` (`CaseMasterID`)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `fk_complainant_occupation`
        FOREIGN KEY (`OccupationID`) REFERENCES `OccupationMaster` (`OccupationID`)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT `fk_complainant_religion`
        FOREIGN KEY (`ReligionID`) REFERENCES `ReligionMaster` (`ReligionID`)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT `fk_complainant_caste`
        FOREIGN KEY (`CasteID`) REFERENCES `CasteMaster` (`caste_master_id`)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Complainant details for each FIR — One CaseMaster to Many Complainants';

-- =============================================================================
-- TABLE 23: ActSectionAssociation
-- Purpose: Associates specific Act-Section combinations with a FIR case.
--          One FIR can invoke multiple act-sections.
--          Composite PK on (CaseMasterID, ActID, SectionID).
-- =============================================================================
CREATE TABLE IF NOT EXISTS `ActSectionAssociation` (
    `CaseMasterID`  INT         NOT NULL COMMENT 'FK → CaseMaster.CaseMasterID — FIR this act-section applies to',
    `ActID`         VARCHAR(50) NOT NULL COMMENT 'FK → Act.ActCode — legal act under which charges are framed',
    `SectionID`     VARCHAR(50) NOT NULL COMMENT 'FK → Section.SectionCode — specific section of the act invoked',
    `ActOrderID`    INT         NULL     COMMENT 'Display/print order of the act within the case',
    `SectionOrderID` INT        NULL     COMMENT 'Display/print order of the section under the act',
    PRIMARY KEY (`CaseMasterID`, `ActID`, `SectionID`),
    CONSTRAINT `fk_actsection_case`
        FOREIGN KEY (`CaseMasterID`) REFERENCES `CaseMaster` (`CaseMasterID`)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `fk_actsection_act`
        FOREIGN KEY (`ActID`) REFERENCES `Act` (`ActCode`)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Associates Act-Section combinations with FIR cases — composite PK';

-- =============================================================================
-- TABLE 24: Victim
-- Purpose: Records victim(s) of each FIR case.
--          One CaseMaster can have multiple victims (One-to-Many).
-- =============================================================================
CREATE TABLE IF NOT EXISTS `Victim` (
    `VictimMasterID` INT          NOT NULL AUTO_INCREMENT COMMENT 'Primary key — unique identifier for each victim',
    `CaseMasterID`   INT          NOT NULL               COMMENT 'FK → CaseMaster.CaseMasterID — FIR this victim belongs to',
    `VictimName`     VARCHAR(200) NOT NULL               COMMENT 'Full name of the victim',
    `AgeYear`        INT          NULL                   COMMENT 'Age of the victim in years',
    `GenderID`       INT          NULL                   COMMENT 'Gender of the victim (lookup value: M/F/T)',
    `VictimPolice`   BIT(1)       NOT NULL DEFAULT b'0'  COMMENT 'Flag: 1=Victim is a police officer, 0=Not a police officer',
    PRIMARY KEY (`VictimMasterID`),
    CONSTRAINT `fk_victim_case`
        FOREIGN KEY (`CaseMasterID`) REFERENCES `CaseMaster` (`CaseMasterID`)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Victim details for each FIR — One CaseMaster to Many Victims';

-- =============================================================================
-- TABLE 25: Accused
-- Purpose: Records accused person(s) in each FIR case.
--          PersonID provides human-readable sorting (A1, A2, A3...).
--          One CaseMaster can have multiple accused (One-to-Many).
-- =============================================================================
CREATE TABLE IF NOT EXISTS `Accused` (
    `AccusedMasterID` INT          NOT NULL AUTO_INCREMENT COMMENT 'Primary key — unique identifier for each accused person',
    `CaseMasterID`    INT          NOT NULL               COMMENT 'FK → CaseMaster.CaseMasterID — FIR this accused is linked to',
    `AccusedName`     VARCHAR(200) NOT NULL               COMMENT 'Full name of the accused',
    `AgeYear`         INT          NULL                   COMMENT 'Age of the accused',
    `GenderID`        INT          NULL                   COMMENT 'Gender of the accused (M/F/T)',
    `PersonID`        VARCHAR(10)  NULL                   COMMENT 'Accused sorting identifier: A1, A2, A3 etc.',
    PRIMARY KEY (`AccusedMasterID`),
    CONSTRAINT `fk_accused_case`
        FOREIGN KEY (`CaseMasterID`) REFERENCES `CaseMaster` (`CaseMasterID`)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Accused persons for each FIR — One CaseMaster to Many Accused';

-- =============================================================================
-- TABLE 26: ArrestSurrender
-- Purpose: Records each arrest or voluntary surrender event linked to an FIR.
--          One FIR can have multiple arrest/surrender events (One-to-Many).
--          Links to the investigating officer, court, and district of arrest.
-- =============================================================================
CREATE TABLE IF NOT EXISTS `ArrestSurrender` (
    `ArrestSurrenderID`       INT    NOT NULL AUTO_INCREMENT COMMENT 'Primary key — unique identifier for each arrest/surrender event',
    `CaseMasterID`            INT    NOT NULL               COMMENT 'FK → CaseMaster.CaseMasterID — FIR linked to this arrest/surrender',
    `ArrestSurrenderTypeID`   INT    NOT NULL               COMMENT 'Type: arrest or voluntary surrender (lookup value)',
    `ArrestSurrenderDate`     DATE   NOT NULL               COMMENT 'Date of arrest or surrender',
    `ArrestSurrenderStateId`  INT    NULL                   COMMENT 'FK → State.StateID — state where arrest/surrender occurred',
    `ArrestSurrenderDistrictId` INT  NULL                   COMMENT 'FK → District.DistrictID — district where arrest/surrender occurred',
    `PoliceStationID`         INT    NULL                   COMMENT 'FK → Unit.UnitID — police station handling the arrest',
    `IOID`                    INT    NULL                   COMMENT 'FK → Employee.EmployeeID — Investigating Officer who made the arrest',
    `CourtID`                 INT    NULL                   COMMENT 'FK → Court.CourtID — court before which accused was produced',
    `AccusedMasterID`         INT    NOT NULL               COMMENT 'FK → Accused.AccusedMasterID — accused person linked to this event',
    `IsAccused`               BIT(1) NOT NULL DEFAULT b'1'  COMMENT 'Flag: 1=primary accused in the case, 0=not primary',
    `IsComplainantAccused`    BIT(1) NOT NULL DEFAULT b'0'  COMMENT 'Flag: 1=complainant is also listed as accused',
    PRIMARY KEY (`ArrestSurrenderID`),
    CONSTRAINT `fk_arrest_case`
        FOREIGN KEY (`CaseMasterID`) REFERENCES `CaseMaster` (`CaseMasterID`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `fk_arrest_state`
        FOREIGN KEY (`ArrestSurrenderStateId`) REFERENCES `State` (`StateID`)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT `fk_arrest_district`
        FOREIGN KEY (`ArrestSurrenderDistrictId`) REFERENCES `District` (`DistrictID`)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT `fk_arrest_unit`
        FOREIGN KEY (`PoliceStationID`) REFERENCES `Unit` (`UnitID`)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT `fk_arrest_io`
        FOREIGN KEY (`IOID`) REFERENCES `Employee` (`EmployeeID`)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT `fk_arrest_court`
        FOREIGN KEY (`CourtID`) REFERENCES `Court` (`CourtID`)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT `fk_arrest_accused`
        FOREIGN KEY (`AccusedMasterID`) REFERENCES `Accused` (`AccusedMasterID`)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Arrest and voluntary surrender events for FIR cases';

-- =============================================================================
-- TABLE 27: inv_arrestsurrenderaccused
-- Purpose: Junction table linking ArrestSurrender events to multiple Accused.
--          One ArrestSurrender event can link to multiple accused persons.
--          Composite PK on (ArrestSurrenderID, AccusedMasterID).
-- =============================================================================
CREATE TABLE IF NOT EXISTS `inv_arrestsurrenderaccused` (
    `ArrestSurrenderID` INT NOT NULL COMMENT 'FK → ArrestSurrender.ArrestSurrenderID — arrest/surrender event',
    `AccusedMasterID`   INT NOT NULL COMMENT 'FK → Accused.AccusedMasterID — accused linked to this arrest event',
    PRIMARY KEY (`ArrestSurrenderID`, `AccusedMasterID`),
    CONSTRAINT `fk_inv_asa_arrestsurrender`
        FOREIGN KEY (`ArrestSurrenderID`) REFERENCES `ArrestSurrender` (`ArrestSurrenderID`)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `fk_inv_asa_accused`
        FOREIGN KEY (`AccusedMasterID`) REFERENCES `Accused` (`AccusedMasterID`)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Junction table: links ArrestSurrender events to multiple Accused persons';

-- =============================================================================
-- TABLE 28: ChargesheetDetails
-- Purpose: Records chargesheet or final report details for an FIR.
--          cstype: A=Chargesheet, B=False Case, C=Undetected.
--          Referenced as final disposition of the investigation phase.
-- =============================================================================
CREATE TABLE IF NOT EXISTS `ChargesheetDetails` (
    `CSID`           INT      NOT NULL AUTO_INCREMENT COMMENT 'Primary key — unique identifier for the chargesheet',
    `CaseMasterID`   INT      NOT NULL               COMMENT 'FK → CaseMaster.CaseMasterID — FIR this chargesheet belongs to',
    `csdate`         DATETIME NOT NULL               COMMENT 'Date and time the chargesheet was filed',
    `cstype`         CHAR(1)  NOT NULL               COMMENT 'Final report type: A=Chargesheet, B=False Case, C=Undetected',
    `PolicePersonID` INT      NOT NULL               COMMENT 'FK → Employee.EmployeeID — officer who filed the chargesheet',
    `CreatedAt`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
    PRIMARY KEY (`CSID`),
    CONSTRAINT `chk_chargesheet_cstype`
        CHECK (`cstype` IN ('A', 'B', 'C')),
    CONSTRAINT `fk_chargesheet_case`
        FOREIGN KEY (`CaseMasterID`) REFERENCES `CaseMaster` (`CaseMasterID`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `fk_chargesheet_employee`
        FOREIGN KEY (`PolicePersonID`) REFERENCES `Employee` (`EmployeeID`)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Chargesheet and final report details for investigated FIR cases';

-- =============================================================================
-- Re-enable foreign key checks
-- =============================================================================
SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- END OF OPERATIONAL SCHEMA
-- Total tables: 28 (faithfully mirrors Police_FIR_ER_Diagram.pdf)
-- =============================================================================
