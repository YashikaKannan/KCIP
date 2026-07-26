# Intelligence Schema Documentation

The Intelligence Layer of KCIP operates alongside the operational data layer, providing analytical capabilities, ML forecasting, and relationship network analysis without modifying historical police records.

## Intelligence Tables & Features

### 1. CrimePrediction
- **Purpose**: Holds ML predictions of crime risks.
- **ML Integration**: Connects to `QuickML` or custom models. Stores features, risk categories, confidence metrics, and human validation tracking.

### 2. CrimeHotspot
- **Purpose**: Defines geographical clusters where crime density exceeds standard baselines.
- **Features**: Radius-based search circles and full polygon bounding coordinate geometry stored via `BoundaryGeoJSON`.

### 3. CrimeAssociation
- **Purpose**: Case-to-case linkage graph mapping criminal syndicates and MO overlaps.
- **Graph Compatibility**: Designed to model nodes (cases) and edges (relationships) compatible with visual libraries like `Cytoscape.js` and graph libraries like `NetworkX`.

### 4. RepeatOffender
- **Purpose**: Accumulates habitual criminal histories, risk index levels, and active watchlist tiers.
- **Watchlist Tiers**: `NONE` $\rightarrow$ `WATCH` $\rightarrow$ `ALERT` $\rightarrow$ `WANTED`.

### 5. MOProfile (Modus Operandi)
- **Purpose**: Profiles accused behaviors (preferred time, day, weapons, patterns).
- **Match Engine**: powers similarity matching systems to link unsolved cases to known offender MOs.

### 6. DashboardCache
- **Purpose**: Pre-computed metrics store avoiding expensive relational counts/joins.
- **Cache Strategy**: Auto-invalidated using event-driven microservices.

### 7. AuditLog
- **Purpose**: Immutable ledger capturing all database operations.
- **Audit Integrity**: Denormalizes key identifiers (like `ChangedByKGID`) to prevent loss of audit history if original employee records change.

### 8. AIAlert
- **Purpose**: Distributes system alerts (SLA breaches, hotspot spikes, repeat offender activity) directly to assignees.
