-- =============================================================================
-- KCIP — Karnataka Crime Intelligence Platform
-- Phase 2: Database Design — Seed Master & Sample Data
-- File: seed.sql
-- Platform: Zoho Catalyst Data Store (MySQL 8.0 compatible DDL)
--
-- TODO: Zoho Catalyst Data Store does not support executing SQL scripts directly.
--       To load this seed data, use the Catalyst Console to import CSV files,
--       or run a bootstrap script using the Catalyst Serverless SDK.
-- =============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Seed State
INSERT INTO `State` (`StateID`, `StateName`, `NationalityID`, `Active`) VALUES
(1, 'Karnataka', 1, b'1'),
(2, 'Tamil Nadu', 1, b'1'),
(3, 'Maharashtra', 1, b'1');

-- 2. Seed District (Karnataka Districts)
INSERT INTO `District` (`DistrictID`, `DistrictName`, `StateID`, `Active`) VALUES
(1, 'Bengaluru City', 1, b'1'),
(2, 'Mysuru City', 1, b'1'),
(3, 'Mangaluru City', 1, b'1'),
(4, 'Belagavi District', 1, b'1'),
(5, 'Hubballi-Dharwad City', 1, b'1');

-- 3. Seed UnitType
INSERT INTO `UnitType` (`UnitTypeID`, `UnitTypeName`, `CityDistState`, `Hierarchy`, `Active`) VALUES
(1, 'State Headquarters', 'State', 1, b'1'),
(2, 'Range Office', 'District', 2, b'1'),
(3, 'District Headquarters', 'District', 3, b'1'),
(4, 'Circle Office', 'City', 4, b'1'),
(5, 'Police Station', 'City', 5, b'1');

-- 4. Seed Unit (Police Stations & Offices)
INSERT INTO `Unit` (`UnitID`, `UnitName`, `TypeID`, `ParentUnit`, `NationalityID`, `StateID`, `DistrictID`, `Active`) VALUES
(1, 'Vidhana Soudha PS', 5, NULL, 1, 1, 1, b'1'),
(2, 'Koramangala PS', 5, NULL, 1, 1, 1, b'1'),
(3, 'Lashkar PS', 5, NULL, 1, 1, 2, b'1'),
(4, 'Mangaluru Town PS', 5, NULL, 1, 1, 3, b'1'),
(5, 'SCRB Bengaluru', 1, NULL, 1, 1, 1, b'1');

-- 5. Seed Rank
INSERT INTO `Rank` (`RankID`, `RankName`, `Hierarchy`, `Active`) VALUES
(1, 'Director General of Police (DGP)', 1, b'1'),
(2, 'Superintendent of Police (SP)', 10, b'1'),
(3, 'Deputy Superintendent of Police (DSP)', 15, b'1'),
(4, 'Police Inspector (PI)', 20, b'1'),
(5, 'Sub-Inspector of Police (PSI)', 25, b'1'),
(6, 'Assistant Sub-Inspector (ASI)', 30, b'1'),
(7, 'Head Constable (HC)', 35, b'1'),
(8, 'Police Constable (PC)', 40, b'1');

-- 6. Seed Designation
INSERT INTO `Designation` (`DesignationID`, `DesignationName`, `Active`, `SortOrder`) VALUES
(1, 'Station House Officer (SHO)', b'1', 1),
(2, 'Investigating Officer (IO)', b'1', 2),
(3, 'Crime Branch Officer', b'1', 3),
(4, 'Law & Order Officer', b'1', 4);

-- 7. Seed Employee (Sample Officers)
INSERT INTO `Employee` (`EmployeeID`, `DistrictID`, `UnitID`, `RankID`, `DesignationID`, `KGID`, `FirstName`, `EmployeeDOB`, `GenderID`, `BloodGroupID`, `PhysicallyChallenged`, `AppointmentDate`) VALUES
(1, 1, 1, 4, 1, 'KGID90871', 'Ramesh', '1980-05-15', 1, 1, b'0', '2005-08-10'),
(2, 1, 2, 5, 2, 'KGID90872', 'Suresh', '1985-11-22', 1, 2, b'0', '2010-04-12'),
(3, 2, 3, 5, 2, 'KGID90873', 'Anitha', '1990-07-30', 2, 1, b'0', '2015-06-01');

-- 8. Seed Court
INSERT INTO `Court` (`CourtID`, `CourtName`, `DistrictID`, `StateID`, `Active`) VALUES
(1, 'City Civil and Sessions Court Bengaluru', 1, 1, b'1'),
(2, 'JMFC I Court Mysuru', 2, 1, b'1'),
(3, 'High Court of Karnataka', 1, 1, b'1');

-- 9. Seed CaseCategory
INSERT INTO `CaseCategory` (`CaseCategoryID`, `LookupValue`) VALUES
(1, 'FIR'),
(2, 'UDR'),
(3, 'PAR'),
(4, 'Zero FIR');

-- 10. Seed GravityOffence
INSERT INTO `GravityOffence` (`GravityOffenceID`, `LookupValue`) VALUES
(1, 'Heinous'),
(2, 'Non-Heinous'),
(3, 'Petty');

-- 11. Seed CrimeHead
INSERT INTO `CrimeHead` (`CrimeHeadID`, `CrimeGroupName`, `Active`) VALUES
(1, 'Homicide/Murder', b'1'),
(2, 'Theft & Robbery', b'1'),
(3, 'Crimes Against Women', b'1'),
(4, 'Cybercrime', b'1'),
(5, 'Narcotics (NDPS)', b'1');

-- 12. Seed CrimeSubHead
INSERT INTO `CrimeSubHead` (`CrimeSubHeadID`, `CrimeHeadID`, `CrimeHeadName`, `SeqID`) VALUES
(1, 1, 'Murder for Gain', 1),
(2, 1, 'Murder due to Personal Enmity', 2),
(3, 2, 'Chain Snatching', 1),
(4, 2, 'House Breaking by Night', 2),
(5, 3, 'Dowry Harassment', 1),
(6, 4, 'Phishing & Financial Fraud', 1),
(7, 5, 'Commercial Quantity Possession', 1);

-- 13. Seed Act
INSERT INTO `Act` (`ActCode`, `ActDescription`, `ShortName`, `Active`) VALUES
('IPC', 'Indian Penal Code 1860', 'IPC', b'1'),
('BNS', 'Bharatiya Nyaya Sanhita 2023', 'BNS', b'1'),
('NDPS', 'Narcotic Drugs and Psychotropic Substances Act 1985', 'NDPS', b'1'),
('POCSO', 'Protection of Children from Sexual Offences Act 2012', 'POCSO', b'1');

-- 14. Seed Section
INSERT INTO `Section` (`ActCode`, `SectionCode`, `SectionDescription`, `Active`) VALUES
('IPC', '302', 'Punishment for Murder', b'1'),
('IPC', '379', 'Punishment for Theft', b'1'),
('IPC', '392', 'Punishment for Robbery', b'1'),
('NDPS', '20', 'Punishment for Contravention in Relation to Cannabis', b'1'),
('POCSO', '4', 'Punishment for Penetrative Sexual Assault', b'1');

-- 15. Seed CrimeHeadActSection
INSERT INTO `CrimeHeadActSection` (`CrimeHeadID`, `ActCode`, `SectionCode`) VALUES
(1, 'IPC', '302'),
(2, 'IPC', '379'),
(2, 'IPC', '392');

-- 16. Seed CaseStatusMaster
INSERT INTO `CaseStatusMaster` (`CaseStatusID`, `CaseStatusName`) VALUES
(1, 'Under Investigation'),
(2, 'Charge Sheeted'),
(3, 'Closed (Untraceable)'),
(4, 'Closed (False Case)'),
(5, 'Trial in Progress'),
(6, 'Disposed by Court');

-- 17. Seed OccupationMaster
INSERT INTO `OccupationMaster` (`OccupationID`, `OccupationName`) VALUES
(1, 'Government Employee', 'Government Employee'),
(2, 'Private Employee', 'Private Employee'),
(3, 'Farmer/Agricultural Worker', 'Farmer/Agricultural Worker'),
(4, 'Business Owner/Self-employed', 'Business Owner/Self-employed'),
(5, 'Student', 'Student'),
(6, 'Unemployed', 'Unemployed');

-- 18. Seed ReligionMaster
INSERT INTO `ReligionMaster` (`ReligionID`, `ReligionName`) VALUES
(1, 'Hinduism'),
(2, 'Islam'),
(3, 'Christianity'),
(4, 'Sikhism'),
(5, 'Others');

-- 19. Seed CasteMaster
INSERT INTO `CasteMaster` (`caste_master_id`, `caste_master_name`) VALUES
(1, 'General'),
(2, 'OBC'),
(3, 'SC'),
(4, 'ST');

-- 20. Seed CaseMaster (Sample FIRs)
INSERT INTO `CaseMaster` (`CaseMasterID`, `CrimeNo`, `CaseNo`, `CrimeRegisteredDate`, `PolicePersonID`, `PoliceStationID`, `CaseCategoryID`, `GravityOffenceID`, `CrimeMajorHeadID`, `CrimeMinorHeadID`, `CaseStatusID`, `CourtID`, `IncidentFromDate`, `IncidentToDate`, `InfoReceivedPSDate`, `latitude`, `longitude`, `BriefFacts`) VALUES
(1, '100010001202600001', '202600001', '2026-01-10', 1, 1, 1, 1, 1, 2, 1, NULL, '2026-01-09 22:00:00', '2026-01-09 23:30:00', '2026-01-10 08:00:00', 12.971598, 77.594562, 'A dispute over land property escalated, resulting in the murder of the victim by personal enmity.'),
(2, '100010002202600002', '202600002', '2026-02-15', 2, 2, 1, 2, 2, 4, 1, NULL, '2026-02-14 02:00:00', '2026-02-14 04:00:00', '2026-02-14 07:30:00', 12.935242, 77.624461, 'House break-in theft occurred during the night at Koramangala block 3. Gold ornaments worth 5 lakhs stolen.');

-- 21. Seed Inv_OccuranceTime
INSERT INTO `Inv_OccuranceTime` (`OccuranceTimeID`, `CaseMasterID`, `OccuranceFromDate`, `OccuranceToDate`, `LocationDescription`, `Latitude`, `Longitude`) VALUES
(1, 1, '2026-01-09 22:00:00', '2026-01-09 23:30:00', 'Near Cubbon Park, Main Gate Area', 12.971598, 77.594562),
(2, 2, '2026-02-14 02:00:00', '2026-02-14 04:00:00', 'Flat 402, Block B, Koramangala Apartments', 12.935242, 77.624461);

-- 22. Seed ComplainantDetails
INSERT INTO `ComplainantDetails` (`ComplainantID`, `CaseMasterID`, `ComplainantName`, `AgeYear`, `OccupationID`, `ReligionID`, `CasteID`, `GenderID`) VALUES
(1, 1, 'Venkataswamy K', 45, 3, 1, 2, 1),
(2, 2, 'Deepa Rao', 34, 2, 1, 1, 2);

-- 23. Seed ActSectionAssociation
INSERT INTO `ActSectionAssociation` (`CaseMasterID`, `ActID`, `SectionID`, `ActOrderID`, `SectionOrderID`) VALUES
(1, 'IPC', '302', 1, 1),
(2, 'IPC', '379', 1, 1);

-- 24. Seed Victim
INSERT INTO `Victim` (`VictimMasterID`, `CaseMasterID`, `VictimName`, `AgeYear`, `GenderID`, `VictimPolice`) VALUES
(1, 1, 'Anandappa K', 42, 1, b'0'),
(2, 2, 'Deepa Rao', 34, 2, b'0');

-- 25. Seed Accused
INSERT INTO `Accused` (`AccusedMasterID`, `CaseMasterID`, `AccusedName`, `AgeYear`, `GenderID`, `PersonID`) VALUES
(1, 1, 'Ranga Swami', 35, 1, 'A1'),
(2, 2, 'Shiva Kumar @ Psycho Shiva', 28, 1, 'A1');

-- 26. Seed ArrestSurrender
INSERT INTO `ArrestSurrender` (`ArrestSurrenderID`, `CaseMasterID`, `ArrestSurrenderTypeID`, `ArrestSurrenderDate`, `ArrestSurrenderStateId`, `ArrestSurrenderDistrictId`, `PoliceStationID`, `IOID`, `CourtID`, `AccusedMasterID`, `IsAccused`, `IsComplainantAccused`) VALUES
(1, 1, 1, '2026-01-12', 1, 1, 1, 1, 1, 1, b'1', b'0');

-- 27. Seed inv_arrestsurrenderaccused
INSERT INTO `inv_arrestsurrenderaccused` (`ArrestSurrenderID`, `AccusedMasterID`) VALUES
(1, 1);

-- 28. Seed ChargesheetDetails
INSERT INTO `ChargesheetDetails` (`CSID`, `CaseMasterID`, `csdate`, `cstype`, `PolicePersonID`) VALUES
(1, 1, '2026-03-10 11:00:00', 'A', 1);

-- 29. Seed CrimePrediction (Sample Intelligence Data)
INSERT INTO `CrimePrediction` (`PredictionID`, `CaseMasterID`, `DistrictID`, `UnitID`, `CrimeHeadID`, `PredictionDate`, `PredictionType`, `RiskLevel`, `ConfidenceScore`, `PredictionWindow`, `ModelVersion`, `PredictionStatus`) VALUES
(1, NULL, 1, 2, 2, '2026-07-28', 'HOTSPOT', 'HIGH', 82.50, 7, 'v1.4.2', 'ACTIVE'),
(2, NULL, 1, 1, 1, '2026-07-28', 'RECURRENCE', 'MEDIUM', 65.00, 14, 'v2.1.0', 'PENDING');

-- 30. Seed CrimeHotspot (Sample Hotspots)
INSERT INTO `CrimeHotspot` (`HotspotID`, `DistrictID`, `UnitID`, `CrimeHeadID`, `HotspotName`, `CenterLatitude`, `CenterLongitude`, `RadiusMeters`, `CrimeCount`, `RiskLevel`, `HotspotStatus`, `AnalysisPeriodFrom`, `AnalysisPeriodTo`) VALUES
(1, 1, 2, 2, 'Koramangala 3rd Block Junction', 12.935000, 77.624000, 300, 12, 'HIGH', 'ACTIVE', '2026-06-01', '2026-07-25');

-- 31. Seed CrimeAssociation
INSERT INTO `CrimeAssociation` (`AssociationID`, `SourceCaseMasterID`, `TargetCaseMasterID`, `AssociationType`, `AssociationStrength`, `AssociationNotes`, `DetectedBy`) VALUES
(1, 1, 2, 'SAME_LOCATION', 45.00, 'Geospatial proximity match under 500m window.', 'SYSTEM');

-- 32. Seed RepeatOffender
INSERT INTO `RepeatOffender` (`RepeatOffenderID`, `AccusedMasterID`, `TotalCases`, `TotalArrests`, `PrimaryMO`, `DominantCrimeHeadID`, `RiskScore`, `RiskCategory`, `WatchlistStatus`) VALUES
(1, 2, 4, 3, 'Nighttime residential break-in using specialized levers.', 2, 88.00, 'HABITUAL', 'ALERT');

-- 33. Seed MOProfile
INSERT INTO `MOProfile` (`MOProfileID`, `AccusedMasterID`, `CrimeHeadID`, `PreferredTimeOfDay`, `PreferredDayOfWeek`, `TypicalMethod`, `TypicalLocation`, `ToolsUsed`, `PatternConfidence`, `LinkedCaseCount`) VALUES
(1, 2, 2, 'NIGHT', 'SAT,SUN', 'Gaining entry through balconies and service windows.', 'RESIDENTIAL', 'Lever, Screwdriver, Gloves', 92.00, 4);

-- 34. Seed DashboardCache
INSERT INTO `DashboardCache` (`CacheID`, `CacheKey`, `CacheScope`, `ScopeID`, `CacheData`, `ExpiresAt`) VALUES
(1, 'dash_global_kpi', 'GLOBAL', NULL, '{"total_firs": 1250, "heinous_crimes": 140, "arrest_rate": 84.5, "unsolved_cases": 210}', '2026-07-26 12:00:00');

-- 35. Seed AuditLog
INSERT INTO `AuditLog` (`AuditID`, `TableName`, `RecordID`, `OperationType`, `NewValue`, `ChangedBy`, `ChangedByKGID`, `IPAddress`) VALUES
(1, 'CaseMaster', '2', 'INSERT', '{"CrimeNo": "100010002202600002", "CaseNo": "202600002"}', 2, 'KGID90872', '192.168.1.102');

-- 36. Seed AIAlert
INSERT INTO `AIAlert` (`AlertID`, `AlertType`, `AlertSeverity`, `AlertTitle`, `AlertDescription`, `RelatedCaseMasterID`, `AlertStatus`, `AssignedTo`) VALUES
(1, 'REPEAT_OFFENDER', 'CRITICAL', 'Habitual Offender Detected in Koramangala', 'Repeat offender Shiva Kumar @ Psycho Shiva is accused in the recent Koramangala house break-in case.', 2, 'OPEN', 2);

SET FOREIGN_KEY_CHECKS = 1;
