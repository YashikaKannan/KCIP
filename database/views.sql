-- =============================================================================
-- KCIP — Karnataka Crime Intelligence Platform
-- Phase 2: Database Design — Reporting & Analytical Views
-- File: views.sql
-- Platform: Zoho Catalyst Data Store (MySQL 8.0 compatible DDL)
--
-- TODO: Zoho Catalyst Data Store does not support database-level VIEWs.
--       - Implement these views as SELECT query structures inside
--         Catalyst Serverless Functions.
--       - For heavy queries, store the computed payloads in the DashboardCache
--         table to avoid high datastore read operations.
-- =============================================================================

-- =============================================================================
-- VIEW 1: vw_DashboardSummary
-- Purpose: Summary metrics for statewide dashboard.
-- =============================================================================
CREATE OR REPLACE VIEW `vw_DashboardSummary` AS
SELECT
    COUNT(c.CaseMasterID) AS TotalCases,
    SUM(CASE WHEN g.LookupValue = 'Heinous' THEN 1 ELSE 0 END) AS HeinousCases,
    SUM(CASE WHEN cs.CaseStatusName = 'Under Investigation' THEN 1 ELSE 0 END) AS PendingInvestigation,
    SUM(CASE WHEN cs.CaseStatusName = 'Charge Sheeted' THEN 1 ELSE 0 END) AS ChargeSheetedCases,
    COUNT(DISTINCT c.PoliceStationID) AS ActivePoliceStations
FROM `CaseMaster` c
JOIN `GravityOffence` g ON c.GravityOffenceID = g.GravityOffenceID
JOIN `CaseStatusMaster` cs ON c.CaseStatusID = cs.CaseStatusID;


-- =============================================================================
-- VIEW 2: vw_DistrictCrimeReport
-- Purpose: District-wise aggregate crime breakdown.
-- =============================================================================
CREATE OR REPLACE VIEW `vw_DistrictCrimeReport` AS
SELECT
    d.DistrictID,
    d.DistrictName,
    COUNT(c.CaseMasterID) AS CaseCount,
    SUM(CASE WHEN g.LookupValue = 'Heinous' THEN 1 ELSE 0 END) AS HeinousCount,
    SUM(CASE WHEN g.LookupValue = 'Non-Heinous' THEN 1 ELSE 0 END) AS NonHeinousCount,
    SUM(CASE WHEN cs.CaseStatusName = 'Charge Sheeted' THEN 1 ELSE 0 END) AS SolvedCount,
    ROUND((SUM(CASE WHEN cs.CaseStatusName = 'Charge Sheeted' THEN 1 ELSE 0 END) / COUNT(c.CaseMasterID)) * 100, 2) AS DetectionRate
FROM `CaseMaster` c
JOIN `Unit` u ON c.PoliceStationID = u.UnitID
JOIN `District` d ON u.DistrictID = d.DistrictID
JOIN `GravityOffence` g ON c.GravityOffenceID = g.GravityOffenceID
JOIN `CaseStatusMaster` cs ON c.CaseStatusID = cs.CaseStatusID
GROUP BY d.DistrictID, d.DistrictName;


-- =============================================================================
-- VIEW 3: vw_OfficerProductivity
-- Purpose: Tracks performance metrics of Investigating Officers.
-- =============================================================================
CREATE OR REPLACE VIEW `vw_OfficerProductivity` AS
SELECT
    e.EmployeeID,
    e.KGID,
    CONCAT(e.FirstName) AS OfficerName,
    r.RankName,
    u.UnitName,
    COUNT(c.CaseMasterID) AS AssignedCases,
    SUM(CASE WHEN cs.CaseStatusName = 'Charge Sheeted' THEN 1 ELSE 0 END) AS SolvedCases,
    SUM(CASE WHEN cs.CaseStatusName = 'Under Investigation' THEN 1 ELSE 0 END) AS ActiveInvestigations,
    ROUND((SUM(CASE WHEN cs.CaseStatusName = 'Charge Sheeted' THEN 1 ELSE 0 END) / COUNT(c.CaseMasterID)) * 100, 2) AS SuccessRate
FROM `Employee` e
JOIN `Rank` r ON e.RankID = r.RankID
JOIN `Unit` u ON e.UnitID = u.UnitID
LEFT JOIN `CaseMaster` c ON c.PolicePersonID = e.EmployeeID
LEFT JOIN `CaseStatusMaster` cs ON c.CaseStatusID = cs.CaseStatusID
GROUP BY e.EmployeeID, e.KGID, e.FirstName, r.RankName, u.UnitName;


-- =============================================================================
-- VIEW 4: vw_CrimeStatistics
-- Purpose: Aggregated breakdown by major and minor heads.
-- =============================================================================
CREATE OR REPLACE VIEW `vw_CrimeStatistics` AS
SELECT
    ch.CrimeGroupName AS MajorCrimeGroup,
    csh.CrimeHeadName AS MinorCrimeHead,
    COUNT(c.CaseMasterID) AS OffenceCount,
    YEAR(c.CrimeRegisteredDate) AS StatisticalYear,
    MONTH(c.CrimeRegisteredDate) AS StatisticalMonth
FROM `CaseMaster` c
JOIN `CrimeHead` ch ON c.CrimeMajorHeadID = ch.CrimeHeadID
JOIN `CrimeSubHead` csh ON c.CrimeMinorHeadID = csh.CrimeSubHeadID
GROUP BY ch.CrimeGroupName, csh.CrimeHeadName, YEAR(c.CrimeRegisteredDate), MONTH(c.CrimeRegisteredDate);


-- =============================================================================
-- VIEW 5: vw_HotspotReport
-- Purpose: Reporting on geographic crime hotspots.
-- =============================================================================
CREATE OR REPLACE VIEW `vw_HotspotReport` AS
SELECT
    h.HotspotID,
    h.HotspotName,
    d.DistrictName,
    u.UnitName,
    ch.CrimeGroupName AS MajorCrimeType,
    h.RadiusMeters,
    h.CrimeCount,
    h.RiskLevel,
    h.HotspotStatus,
    h.AnalysisPeriodFrom,
    h.AnalysisPeriodTo
FROM `CrimeHotspot` h
JOIN `District` d ON h.DistrictID = d.DistrictID
JOIN `Unit` u ON h.UnitID = u.UnitID
LEFT JOIN `CrimeHead` ch ON h.CrimeHeadID = ch.CrimeHeadID;


-- =============================================================================
-- VIEW 6: vw_PredictionReport
-- Purpose: Actionable ML crime forecasting reports.
-- =============================================================================
CREATE OR REPLACE VIEW `vw_PredictionReport` AS
SELECT
    p.PredictionID,
    d.DistrictName,
    u.UnitName,
    ch.CrimeGroupName AS CrimeGroupPredicted,
    p.PredictionDate,
    p.PredictionType,
    p.RiskLevel,
    p.ConfidenceScore,
    p.PredictionWindow,
    p.PredictionStatus,
    CONCAT(e.FirstName) AS ValidatedByOfficer,
    p.ValidatedAt
FROM `CrimePrediction` p
JOIN `District` d ON p.DistrictID = d.DistrictID
JOIN `Unit` u ON p.UnitID = u.UnitID
LEFT JOIN `CrimeHead` ch ON p.CrimeHeadID = ch.CrimeHeadID
LEFT JOIN `Employee` e ON p.ValidatedBy = e.EmployeeID;


-- =============================================================================
-- VIEW 7: vw_RepeatOffenderWatchlist
-- Purpose: Active watchlist report for repeat offenders.
-- =============================================================================
CREATE OR REPLACE VIEW `vw_RepeatOffenderWatchlist` AS
SELECT
    ro.RepeatOffenderID,
    a.AccusedName,
    a.AgeYear,
    ro.TotalCases,
    ro.TotalArrests,
    ch.CrimeGroupName AS DominantCrimeType,
    ro.RiskScore,
    ro.RiskCategory,
    ro.WatchlistStatus,
    ro.LastOffenseDate,
    CONCAT(e.FirstName) AS AssignedWatchlistOfficer
FROM `RepeatOffender` ro
JOIN `Accused` a ON ro.AccusedMasterID = a.AccusedMasterID
LEFT JOIN `CrimeHead` ch ON ro.DominantCrimeHeadID = ch.CrimeHeadID
LEFT JOIN `Employee` e ON ro.WatchlistAddedBy = e.EmployeeID
WHERE ro.IsActiveOffender = b'1';


-- =============================================================================
-- VIEW 8: vw_AuditReport
-- Purpose: Tracking user logins, modifications, and security violations.
-- =============================================================================
CREATE OR REPLACE VIEW `vw_AuditReport` AS
SELECT
    al.AuditID,
    al.TableName,
    al.RecordID,
    al.OperationType,
    al.ChangedByKGID,
    al.ChangeTimestamp,
    al.IPAddress,
    al.ChangeReason,
    al.IsReversible,
    al.ReversedAt
FROM `AuditLog` al
ORDER BY al.ChangeTimestamp DESC;
