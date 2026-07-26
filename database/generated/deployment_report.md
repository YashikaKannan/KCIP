# Database Deployment Report

**Generation Timestamp**: 2026-07-26 17:59:58

## Summary
- **Total Tables**: 36
- **Operational Tables (schema.sql)**: 28
- **Intelligence Tables (intelligence_tables.sql)**: 8
- **Total Columns**: 257

## Tables Generated
- **State** (Operational Layer) — 4 columns
- **District** (Operational Layer) — 4 columns
- **UnitType** (Operational Layer) — 5 columns
- **Unit** (Operational Layer) — 8 columns
- **Rank** (Operational Layer) — 4 columns
- **Designation** (Operational Layer) — 4 columns
- **Employee** (Operational Layer) — 12 columns
- **Court** (Operational Layer) — 5 columns
- **CaseCategory** (Operational Layer) — 2 columns
- **GravityOffence** (Operational Layer) — 2 columns
- **CrimeHead** (Operational Layer) — 3 columns
- **CrimeSubHead** (Operational Layer) — 4 columns
- **Act** (Operational Layer) — 4 columns
- **Section** (Operational Layer) — 4 columns
- **CrimeHeadActSection** (Operational Layer) — 3 columns
- **CaseStatusMaster** (Operational Layer) — 2 columns
- **OccupationMaster** (Operational Layer) — 2 columns
- **ReligionMaster** (Operational Layer) — 2 columns
- **CasteMaster** (Operational Layer) — 2 columns
- **CaseMaster** (Operational Layer) — 20 columns
- **Inv_OccuranceTime** (Operational Layer) — 8 columns
- **ComplainantDetails** (Operational Layer) — 8 columns
- **ActSectionAssociation** (Operational Layer) — 5 columns
- **Victim** (Operational Layer) — 6 columns
- **Accused** (Operational Layer) — 6 columns
- **ArrestSurrender** (Operational Layer) — 12 columns
- **inv_arrestsurrenderaccused** (Operational Layer) — 2 columns
- **ChargesheetDetails** (Operational Layer) — 6 columns
- **CrimePrediction** (Intelligence Layer) — 18 columns
- **CrimeHotspot** (Intelligence Layer) — 16 columns
- **CrimeAssociation** (Intelligence Layer) — 8 columns
- **RepeatOffender** (Intelligence Layer) — 7 columns
- **MOProfile** (Intelligence Layer) — 15 columns
- **DashboardCache** (Intelligence Layer) — 10 columns
- **AuditLog** (Intelligence Layer) — 16 columns
- **AIAlert** (Intelligence Layer) — 18 columns

## Relationships
- `District.StateID` references `State(StateID)`
- `Unit.TypeID` references `UnitType(UnitTypeID)`
- `Unit.ParentUnit` references `Unit(UnitID)`
- `Unit.StateID` references `State(StateID)`
- `Unit.DistrictID` references `District(DistrictID)`
- `Employee.DistrictID` references `District(DistrictID)`
- `Employee.UnitID` references `Unit(UnitID)`
- `Employee.RankID` references `Rank(RankID)`
- `Employee.DesignationID` references `Designation(DesignationID)`
- `Court.DistrictID` references `District(DistrictID)`
- `Court.StateID` references `State(StateID)`
- `CrimeSubHead.CrimeHeadID` references `CrimeHead(CrimeHeadID)`
- `Section.ActCode` references `Act(ActCode)`
- `CrimeHeadActSection.CrimeHeadID` references `CrimeHead(CrimeHeadID)`
- `CrimeHeadActSection.ActCode` references `Act(ActCode)`
- `CaseMaster.PolicePersonID` references `Employee(EmployeeID)`
- `CaseMaster.PoliceStationID` references `Unit(UnitID)`
- `CaseMaster.CaseCategoryID` references `CaseCategory(CaseCategoryID)`
- `CaseMaster.GravityOffenceID` references `GravityOffence(GravityOffenceID)`
- `CaseMaster.CrimeMajorHeadID` references `CrimeHead(CrimeHeadID)`
- `CaseMaster.CrimeMinorHeadID` references `CrimeSubHead(CrimeSubHeadID)`
- `CaseMaster.CaseStatusID` references `CaseStatusMaster(CaseStatusID)`
- `CaseMaster.CourtID` references `Court(CourtID)`
- `Inv_OccuranceTime.CaseMasterID` references `CaseMaster(CaseMasterID)`
- `ComplainantDetails.CaseMasterID` references `CaseMaster(CaseMasterID)`
- `ComplainantDetails.OccupationID` references `OccupationMaster(OccupationID)`
- `ComplainantDetails.ReligionID` references `ReligionMaster(ReligionID)`
- `ComplainantDetails.CasteID` references `CasteMaster(caste_master_id)`
- `ActSectionAssociation.CaseMasterID` references `CaseMaster(CaseMasterID)`
- `ActSectionAssociation.ActID` references `Act(ActCode)`
- `Victim.CaseMasterID` references `CaseMaster(CaseMasterID)`
- `Accused.CaseMasterID` references `CaseMaster(CaseMasterID)`
- `ArrestSurrender.CaseMasterID` references `CaseMaster(CaseMasterID)`
- `ArrestSurrender.ArrestSurrenderStateId` references `State(StateID)`
- `ArrestSurrender.ArrestSurrenderDistrictId` references `District(DistrictID)`
- `ArrestSurrender.PoliceStationID` references `Unit(UnitID)`
- `ArrestSurrender.IOID` references `Employee(EmployeeID)`
- `ArrestSurrender.CourtID` references `Court(CourtID)`
- `ArrestSurrender.AccusedMasterID` references `Accused(AccusedMasterID)`
- `inv_arrestsurrenderaccused.ArrestSurrenderID` references `ArrestSurrender(ArrestSurrenderID)`
- `inv_arrestsurrenderaccused.AccusedMasterID` references `Accused(AccusedMasterID)`
- `ChargesheetDetails.CaseMasterID` references `CaseMaster(CaseMasterID)`
- `ChargesheetDetails.PolicePersonID` references `Employee(EmployeeID)`
- `CrimePrediction.CaseMasterID` references `CaseMaster(CaseMasterID)`
- `CrimePrediction.DistrictID` references `District(DistrictID)`
- `CrimePrediction.UnitID` references `Unit(UnitID)`
- `CrimePrediction.CrimeHeadID` references `CrimeHead(CrimeHeadID)`
- `CrimePrediction.ValidatedBy` references `Employee(EmployeeID)`
- `CrimeHotspot.DistrictID` references `District(DistrictID)`
- `CrimeHotspot.UnitID` references `Unit(UnitID)`
- `CrimeHotspot.CrimeHeadID` references `CrimeHead(CrimeHeadID)`
- `CrimeAssociation.SourceCaseMasterID` references `CaseMaster(CaseMasterID)`
- `CrimeAssociation.TargetCaseMasterID` references `CaseMaster(CaseMasterID)`
- `MOProfile.AccusedMasterID` references `Accused(AccusedMasterID)`
- `MOProfile.CrimeHeadID` references `CrimeHead(CrimeHeadID)`
- `AuditLog.ChangedBy` references `Employee(EmployeeID)`
- `AuditLog.ReversedBy` references `Employee(EmployeeID)`
- `AIAlert.RelatedCaseMasterID` references `CaseMaster(CaseMasterID)`
- `AIAlert.RelatedHotspotID` references `CrimeHotspot(HotspotID)`
- `AIAlert.RelatedPredictionID` references `CrimePrediction(PredictionID)`
- `AIAlert.RelatedDistrictID` references `District(DistrictID)`
- `AIAlert.RelatedUnitID` references `Unit(UnitID)`
- `AIAlert.AssignedTo` references `Employee(EmployeeID)`

## Warnings & Unsupported SQL Features
Zoho Catalyst Data Store does not support:
- **Foreign Keys / Referential Actions** (`ON DELETE`, `ON UPDATE`). Configured at API level or manually via console relations.
- **Check Constraints** (`CHECK (cstype IN ('A', 'B', 'C'))`). Must be validated inside Serverless Functions.
- **Triggers** (`CREATE TRIGGER`). Handled using Catalyst Signals.
- **Stored Procedures** (`CREATE PROCEDURE`). Handled using serverless APIs.
- **Views** (`CREATE VIEW`). Handled using custom search indexers or API cache aggregations.

## Catalyst Compatibility Notes
- Column types are mapped to `VarChar`, `Int`, `BigInt`, `Double`, `Text`, `DateTime`, and `Boolean`.
- Composite primary keys are mapped to table relation mappings or unique composite indices managed in Java/Python.
