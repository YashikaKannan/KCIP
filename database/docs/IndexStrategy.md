# Indexing Strategy

This document outlines the indexing strategy for optimizing search queries, analytics performance, and graph traversals in KCIP.

## Operational Index Optimizations

To handle high-volume police registry queries:
- **Unique Lookup Indexing**: Added unique indices on `CaseMaster(CrimeNo)` and `Employee(KGID)`.
- **Search Optimization**: Indexes created on `CaseMaster(CaseNo)` and `CaseMaster(CrimeRegisteredDate)` to facilitate rapid date-range and case-specific queries.
- **Join Optimization**: Foreign key columns (`PoliceStationID`, `DistrictID`, `EmployeeID`, etc.) are indexed to ensure quick join speeds.

## Intelligence Index Optimizations

For low-latency AI predictions, mapping dashboards, and network graph operations:
- **Composite Predictor Index**: The multi-column index `idx_prediction_query` on `CrimePrediction(DistrictID, UnitID, PredictionDate, RiskLevel)` provides sub-second filtering for district dashboard views.
- **Graph Linkage Search**: The composite index `idx_assoc_graph` on `CrimeAssociation(SourceCaseMasterID, TargetCaseMasterID, AssociationType)` optimizes BFS/DFS graph traversals when tracing criminal syndicates.
- **Audit Tracking Index**: Composite indexing on `AuditLog(TableName, RecordID)` and `AuditLog(ChangeTimestamp)` supports fast generation of change-history reports.

## Zoho Catalyst Search Index Implementation
In Zoho Catalyst Data Store, columns marked as primary or relationships are indexed by default. Full-text search and complex querying are optimized using Catalyst's search indexers. Composite and custom non-unique indexes defined in `indexes.sql` should be implemented via logical filters in API query builders, or configured as custom indexed columns inside the Catalyst Console.
