# Operational Schema Documentation

This document describes the Operational database layer for the Karnataka Crime Intelligence Platform (KCIP). The design is built to mirror the official source of truth: `Police_FIR_ER_Diagram.pdf`.

## Core Entities & Purpose

The operational layer is composed of 28 tables organized into three key domains:

### 1. Police Organization & Geography
- **State**: Indian states and Union Territories.
- **District**: Districts mapped to each State.
- **UnitType**: Definition of organizational units (e.g., Police Station, Circle Office).
- **Unit**: The specific police station or administrative office. Mapped to State and District.
- **Rank**: Police ranks (PC to DGP) with hierarchy level.
- **Designation**: Functional police designations (e.g., SHO, IO).
- **Employee**: Active police employees with unique `KGID` (Karnataka Government ID).

### 2. Case Management (The FIR Engine)
- **Court**: Judicial courts trial cases are assigned to.
- **CaseCategory**: Lookup for case categories (e.g., FIR, UDR, PAR).
- **GravityOffence**: Case gravity tags (Heinous, Non-Heinous, Petty).
- **CrimeHead**: Major classification groups.
- **CrimeSubHead**: Minor sub-classification heads.
- **Act**: Legal acts (e.g., IPC, BNS, NDPS).
- **Section**: Individual act sections.
- **CrimeHeadActSection**: Junction mapping CrimeHeads to acts/sections.
- **CaseStatusMaster**: Status workflow stages (e.g., Under Investigation, Charge Sheeted).
- **CaseMaster**: Central entity for FIR registry.
- **Inv_OccuranceTime**: 1:1 case extension capturing exact location coordinates and date/time.

### 3. Case Actors & Outcomes
- **OccupationMaster**, **ReligionMaster**, **CasteMaster**: Demographics lookup.
- **ComplainantDetails**: Multiple complainants mapped to a single case.
- **ActSectionAssociation**: Many-to-many junction of sections applied to an FIR.
- **Victim**: Victims of a case.
- **Accused**: Accused actors associated with a case.
- **ArrestSurrender**: Registry of arrests and surrenders.
- **inv_arrestsurrenderaccused**: Junction mapping multiple accused to single arrest/surrender events.
- **ChargesheetDetails**: Final disposition records of case investigations.

## Zoho Catalyst Data Store Mapping
To deploy these tables onto Zoho Catalyst:
1. Create table definitions corresponding to each SQL table in the Catalyst Console.
2. Translate standard relational data types:
   - `INT` / `BIGINT` $\rightarrow$ `Int` / `BigInt`
   - `VARCHAR` $\rightarrow$ `VarChar`
   - `DECIMAL` $\rightarrow$ `Double`
   - `DATETIME` / `DATE` $\rightarrow$ `DateTime`
   - `BIT(1)` $\rightarrow$ `Boolean`
