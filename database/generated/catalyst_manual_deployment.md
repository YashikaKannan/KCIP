# Zoho Catalyst Manual Data Store Deployment Guide

**Generated on**: 2026-07-26 12:12:21
Use this document as an step-by-step layout for configuring the Catalyst Console manually.

=================================================
TABLE: State
=================================================
Column Name      : StateID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique identifier for the state
-------------------------------------------------
Column Name      : StateName
  Type           : VarChar
  Max Length     : 100
  Mandatory      : Yes
  Primary Key    : No
  Description    : Name of the state (e.g., Karnataka, Kerala)
-------------------------------------------------
Column Name      : NationalityID
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : Nationality reference ID (for multi-nationality support)
-------------------------------------------------
Column Name      : Active
  Type           : Boolean
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : 1
  Description    : Record active flag: 1=Active, 0=Inactive
-------------------------------------------------

=================================================
TABLE: District
=================================================
Column Name      : DistrictID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique identifier for the district
-------------------------------------------------
Column Name      : DistrictName
  Type           : VarChar
  Max Length     : 100
  Mandatory      : Yes
  Primary Key    : No
  Description    : Name of the district (e.g., Bengaluru Urban, Mysuru)
-------------------------------------------------
Column Name      : StateID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → State.StateID — state this district belongs to
-------------------------------------------------
Column Name      : Active
  Type           : Boolean
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : 1
  Description    : Record active flag: 1=Active, 0=Inactive
-------------------------------------------------

=================================================
TABLE: UnitType
=================================================
Column Name      : UnitTypeID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique identifier for the unit type
-------------------------------------------------
Column Name      : UnitTypeName
  Type           : VarChar
  Max Length     : 100
  Mandatory      : Yes
  Primary Key    : No
  Description    : Name of the unit type (e.g., Police Station, Circle Office)
-------------------------------------------------
Column Name      : CityDistState
  Type           : VarChar
  Max Length     : 50
  Mandatory      : No
  Primary Key    : No
  Description    : Operational level: City / District / State
-------------------------------------------------
Column Name      : Hierarchy
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : Hierarchy level (lower number = higher authority)
-------------------------------------------------
Column Name      : Active
  Type           : Boolean
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : 1
  Description    : Record active flag: 1=Active, 0=Inactive
-------------------------------------------------

=================================================
TABLE: Unit
=================================================
Column Name      : UnitID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique identifier for the police unit
-------------------------------------------------
Column Name      : UnitName
  Type           : VarChar
  Max Length     : 150
  Mandatory      : Yes
  Primary Key    : No
  Description    : Name of the unit or police station
-------------------------------------------------
Column Name      : TypeID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → UnitType.UnitTypeID — type/category of this unit
-------------------------------------------------
Column Name      : ParentUnit
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : FK → Unit.UnitID (self-reference) — parent unit for hierarchy
-------------------------------------------------
Column Name      : NationalityID
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : Nationality reference ID
-------------------------------------------------
Column Name      : StateID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → State.StateID — state the unit belongs to
-------------------------------------------------
Column Name      : DistrictID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → District.DistrictID — district the unit belongs to
-------------------------------------------------
Column Name      : Active
  Type           : Boolean
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : 1
  Description    : Record active flag: 1=Active, 0=Inactive
-------------------------------------------------

=================================================
TABLE: Rank
=================================================
Column Name      : RankID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique identifier for the rank
-------------------------------------------------
Column Name      : RankName
  Type           : VarChar
  Max Length     : 100
  Mandatory      : Yes
  Primary Key    : No
  Description    : Name of the police rank (e.g., Constable, Inspector, DSP)
-------------------------------------------------
Column Name      : Hierarchy
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : Rank hierarchy level (lower number = higher rank)
-------------------------------------------------
Column Name      : Active
  Type           : Boolean
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : 1
  Description    : Record active flag: 1=Active, 0=Inactive
-------------------------------------------------

=================================================
TABLE: Designation
=================================================
Column Name      : DesignationID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique identifier for the designation
-------------------------------------------------
Column Name      : DesignationName
  Type           : VarChar
  Max Length     : 100
  Mandatory      : Yes
  Primary Key    : No
  Description    : Name of the designation (e.g., Investigating Officer, SHO)
-------------------------------------------------
Column Name      : Active
  Type           : Boolean
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : 1
  Description    : Record active flag: 1=Active, 0=Inactive
-------------------------------------------------
Column Name      : SortOrder
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : Display sort order for dropdowns and reports
-------------------------------------------------

=================================================
TABLE: Employee
=================================================
Column Name      : EmployeeID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique identifier for the police employee
-------------------------------------------------
Column Name      : DistrictID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → District.DistrictID — district the employee is posted in
-------------------------------------------------
Column Name      : UnitID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → Unit.UnitID — unit/police station the employee is assigned to
-------------------------------------------------
Column Name      : RankID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → Rank.RankID — current rank of the employee
-------------------------------------------------
Column Name      : DesignationID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → Designation.DesignationID — current designation
-------------------------------------------------
Column Name      : KGID
  Type           : VarChar
  Max Length     : 50
  Mandatory      : Yes
  Primary Key    : No
  Unique         : Yes
  Description    : Karnataka Government ID — unique government employee number
-------------------------------------------------
Column Name      : FirstName
  Type           : VarChar
  Max Length     : 100
  Mandatory      : Yes
  Primary Key    : No
  Description    : First name of the employee
-------------------------------------------------
Column Name      : EmployeeDOB
  Type           : DateTime
  Mandatory      : No
  Primary Key    : No
  Description    : Date of birth of the employee
-------------------------------------------------
Column Name      : GenderID
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : Gender of the employee (lookup value)
-------------------------------------------------
Column Name      : BloodGroupID
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : Blood group of the employee (lookup value)
-------------------------------------------------
Column Name      : PhysicallyChallenged
  Type           : Boolean
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : 0
  Description    : Flag: 1=Physically challenged, 0=Not
-------------------------------------------------
Column Name      : AppointmentDate
  Type           : DateTime
  Mandatory      : No
  Primary Key    : No
  Description    : Date of appointment to government service
-------------------------------------------------

=================================================
TABLE: Court
=================================================
Column Name      : CourtID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique identifier for the court
-------------------------------------------------
Column Name      : CourtName
  Type           : VarChar
  Max Length     : 200
  Mandatory      : Yes
  Primary Key    : No
  Description    : Full name of the court
-------------------------------------------------
Column Name      : DistrictID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → District.DistrictID — district where the court is located
-------------------------------------------------
Column Name      : StateID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → State.StateID — state where the court is located
-------------------------------------------------
Column Name      : Active
  Type           : Boolean
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : 1
  Description    : Record active flag: 1=Active, 0=Inactive
-------------------------------------------------

=================================================
TABLE: CaseCategory
=================================================
Column Name      : CaseCategoryID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique identifier for the case category
-------------------------------------------------
Column Name      : LookupValue
  Type           : VarChar
  Max Length     : 100
  Mandatory      : Yes
  Primary Key    : No
  Description    : Category name (e.g., FIR, UDR, PAR, Zero FIR)
-------------------------------------------------

=================================================
TABLE: GravityOffence
=================================================
Column Name      : GravityOffenceID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique identifier for the gravity level
-------------------------------------------------
Column Name      : LookupValue
  Type           : VarChar
  Max Length     : 100
  Mandatory      : Yes
  Primary Key    : No
  Description    : Gravity description (e.g., Heinous, Non-Heinous, Petty)
-------------------------------------------------

=================================================
TABLE: CrimeHead
=================================================
Column Name      : CrimeHeadID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique identifier for the major crime head
-------------------------------------------------
Column Name      : CrimeGroupName
  Type           : VarChar
  Max Length     : 200
  Mandatory      : Yes
  Primary Key    : No
  Description    : Name of the crime group/major head (e.g., Crimes Against Body)
-------------------------------------------------
Column Name      : Active
  Type           : Boolean
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : 1
  Description    : Record active flag: 1=Active, 0=Inactive
-------------------------------------------------

=================================================
TABLE: CrimeSubHead
=================================================
Column Name      : CrimeSubHeadID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique identifier for the crime sub-head
-------------------------------------------------
Column Name      : CrimeHeadID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → CrimeHead.CrimeHeadID — parent major crime head
-------------------------------------------------
Column Name      : CrimeHeadName
  Type           : VarChar
  Max Length     : 200
  Mandatory      : Yes
  Primary Key    : No
  Description    : Name of this crime sub-head (e.g., Murder, Robbery)
-------------------------------------------------
Column Name      : SeqID
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : Display/sort sequence number for ordering sub-heads
-------------------------------------------------

=================================================
TABLE: Act
=================================================
Column Name      : ActCode
  Type           : VarChar
  Max Length     : 50
  Mandatory      : Yes
  Primary Key    : Yes
  Unique         : Yes
  Description    : Primary key — unique code for the legal act (e.g., IPC, NDPS)
-------------------------------------------------
Column Name      : ActDescription
  Type           : VarChar
  Max Length     : 500
  Mandatory      : No
  Primary Key    : No
  Description    : Full official name/description of the act
-------------------------------------------------
Column Name      : ShortName
  Type           : VarChar
  Max Length     : 100
  Mandatory      : No
  Primary Key    : No
  Description    : Abbreviated/common name of the act
-------------------------------------------------
Column Name      : Active
  Type           : Boolean
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : 1
  Description    : Record active flag: 1=Active, 0=Inactive
-------------------------------------------------

=================================================
TABLE: Section
=================================================
Column Name      : ActCode
  Type           : VarChar
  Max Length     : 50
  Mandatory      : Yes
  Primary Key    : Yes
  Description    : FK → Act.ActCode — parent act this section belongs to
-------------------------------------------------
Column Name      : SectionCode
  Type           : VarChar
  Max Length     : 50
  Mandatory      : Yes
  Primary Key    : Yes
  Description    : Section number/code (e.g., 302, 307, 498A)
-------------------------------------------------
Column Name      : SectionDescription
  Type           : VarChar
  Max Length     : 500
  Mandatory      : No
  Primary Key    : No
  Description    : Full description of the section
-------------------------------------------------
Column Name      : Active
  Type           : Boolean
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : 1
  Description    : Record active flag: 1=Active, 0=Inactive
-------------------------------------------------

=================================================
TABLE: CrimeHeadActSection
=================================================
Column Name      : CrimeHeadID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Description    : FK → CrimeHead.CrimeHeadID — crime head this mapping belongs to
-------------------------------------------------
Column Name      : ActCode
  Type           : VarChar
  Max Length     : 50
  Mandatory      : Yes
  Primary Key    : Yes
  Description    : FK → Act.ActCode — legal act linked to this crime head
-------------------------------------------------
Column Name      : SectionCode
  Type           : VarChar
  Max Length     : 100
  Mandatory      : Yes
  Primary Key    : Yes
  Description    : Section code from the act applicable to this crime head
-------------------------------------------------

=================================================
TABLE: CaseStatusMaster
=================================================
Column Name      : CaseStatusID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique identifier for each case status
-------------------------------------------------
Column Name      : CaseStatusName
  Type           : VarChar
  Max Length     : 100
  Mandatory      : Yes
  Primary Key    : No
  Description    : Status name (e.g., Under Investigation, Charge Sheeted, Closed)
-------------------------------------------------

=================================================
TABLE: OccupationMaster
=================================================
Column Name      : OccupationID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique identifier for each occupation
-------------------------------------------------
Column Name      : OccupationName
  Type           : VarChar
  Max Length     : 150
  Mandatory      : Yes
  Primary Key    : No
  Description    : Name of the occupation (e.g., Farmer, Government Employee)
-------------------------------------------------

=================================================
TABLE: ReligionMaster
=================================================
Column Name      : ReligionID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique identifier for each religion
-------------------------------------------------
Column Name      : ReligionName
  Type           : VarChar
  Max Length     : 100
  Mandatory      : Yes
  Primary Key    : No
  Description    : Name of the religion (e.g., Hindu, Muslim, Christian)
-------------------------------------------------

=================================================
TABLE: CasteMaster
=================================================
Column Name      : caste_master_id
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique identifier for each caste
-------------------------------------------------
Column Name      : caste_master_name
  Type           : VarChar
  Max Length     : 150
  Mandatory      : Yes
  Primary Key    : No
  Description    : Name of the caste
-------------------------------------------------

=================================================
TABLE: CaseMaster
=================================================
Column Name      : CaseMasterID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique identifier for each FIR/case
-------------------------------------------------
Column Name      : CrimeNo
  Type           : VarChar
  Max Length     : 30
  Mandatory      : Yes
  Primary Key    : No
  Description    : Crime Number: [1-CatCode][4-DistrictID][4-UnitID][4-Year][5-Serial]
-------------------------------------------------
Column Name      : CaseNo
  Type           : VarChar
  Max Length     : 20
  Mandatory      : Yes
  Primary Key    : No
  Description    : Case Number: last 9 digits of CrimeNo (YYYY + 5-digit serial)
-------------------------------------------------
Column Name      : CrimeRegisteredDate
  Type           : DateTime
  Mandatory      : Yes
  Primary Key    : No
  Description    : Date when the FIR was officially registered
-------------------------------------------------
Column Name      : PolicePersonID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → Employee.EmployeeID — officer who registered the FIR
-------------------------------------------------
Column Name      : PoliceStationID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → Unit.UnitID — police station where FIR is registered
-------------------------------------------------
Column Name      : CaseCategoryID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → CaseCategory.CaseCategoryID — category of the case
-------------------------------------------------
Column Name      : GravityOffenceID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → GravityOffence.GravityOffenceID — gravity level of offence
-------------------------------------------------
Column Name      : CrimeMajorHeadID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → CrimeHead.CrimeHeadID — major crime head classification
-------------------------------------------------
Column Name      : CrimeMinorHeadID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → CrimeSubHead.CrimeSubHeadID — minor crime sub-head
-------------------------------------------------
Column Name      : CaseStatusID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → CaseStatusMaster.CaseStatusID — current status of the case
-------------------------------------------------
Column Name      : CourtID
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : FK → Court.CourtID — court where the case is being heard (NULL if not yet filed)
-------------------------------------------------
Column Name      : IncidentFromDate
  Type           : DateTime
  Mandatory      : No
  Primary Key    : No
  Description    : Start date and time of the incident
-------------------------------------------------
Column Name      : IncidentToDate
  Type           : DateTime
  Mandatory      : No
  Primary Key    : No
  Description    : End date and time of the incident
-------------------------------------------------
Column Name      : InfoReceivedPSDate
  Type           : DateTime
  Mandatory      : No
  Primary Key    : No
  Description    : Date and time when police station received information
-------------------------------------------------
Column Name      : latitude
  Type           : Double
  Mandatory      : No
  Primary Key    : No
  Description    : GPS latitude coordinate of the incident location
-------------------------------------------------
Column Name      : longitude
  Type           : Double
  Mandatory      : No
  Primary Key    : No
  Description    : GPS longitude coordinate of the incident location
-------------------------------------------------
Column Name      : BriefFacts
  Type           : Text
  Mandatory      : No
  Primary Key    : No
  Description    : Summary of the case facts (free-form narrative)
-------------------------------------------------
Column Name      : CreatedAt
  Type           : DateTime
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : CURRENT_TIMESTAMP
  Description    : Record creation timestamp
-------------------------------------------------
Column Name      : UpdatedAt
  Type           : DateTime
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : CURRENT_TIMESTAMP
  Description    : Record last updated timestamp
-------------------------------------------------

=================================================
TABLE: Inv_OccuranceTime
=================================================
Column Name      : OccuranceTimeID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique identifier
-------------------------------------------------
Column Name      : CaseMasterID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Unique         : Yes
  Description    : FK → CaseMaster.CaseMasterID — UNIQUE: one record per case
-------------------------------------------------
Column Name      : OccuranceFromDate
  Type           : DateTime
  Mandatory      : No
  Primary Key    : No
  Description    : Start date and time of occurrence
-------------------------------------------------
Column Name      : OccuranceToDate
  Type           : DateTime
  Mandatory      : No
  Primary Key    : No
  Description    : End date and time of occurrence
-------------------------------------------------
Column Name      : LocationDescription
  Type           : VarChar
  Max Length     : 500
  Mandatory      : No
  Primary Key    : No
  Description    : Human-readable description of the occurrence location
-------------------------------------------------
Column Name      : Latitude
  Type           : Double
  Mandatory      : No
  Primary Key    : No
  Description    : GPS latitude of occurrence location
-------------------------------------------------
Column Name      : Longitude
  Type           : Double
  Mandatory      : No
  Primary Key    : No
  Description    : GPS longitude of occurrence location
-------------------------------------------------
Column Name      : CreatedAt
  Type           : DateTime
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : CURRENT_TIMESTAMP
  Description    : Record creation timestamp
-------------------------------------------------

=================================================
TABLE: ComplainantDetails
=================================================
Column Name      : ComplainantID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique identifier for the complainant
-------------------------------------------------
Column Name      : CaseMasterID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → CaseMaster.CaseMasterID — FIR this complainant belongs to
-------------------------------------------------
Column Name      : ComplainantName
  Type           : VarChar
  Max Length     : 200
  Mandatory      : Yes
  Primary Key    : No
  Description    : Full name of the complainant
-------------------------------------------------
Column Name      : AgeYear
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : Age of the complainant in years
-------------------------------------------------
Column Name      : OccupationID
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : FK → OccupationMaster.OccupationID — occupation of the complainant
-------------------------------------------------
Column Name      : ReligionID
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : FK → ReligionMaster.ReligionID — religion of the complainant
-------------------------------------------------
Column Name      : CasteID
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : FK → CasteMaster.caste_master_id — caste of the complainant
-------------------------------------------------
Column Name      : GenderID
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : Gender of the complainant (lookup value: M/F/T)
-------------------------------------------------

=================================================
TABLE: ActSectionAssociation
=================================================
Column Name      : CaseMasterID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Description    : FK → CaseMaster.CaseMasterID — FIR this act-section applies to
-------------------------------------------------
Column Name      : ActID
  Type           : VarChar
  Max Length     : 50
  Mandatory      : Yes
  Primary Key    : Yes
  Description    : FK → Act.ActCode — legal act under which charges are framed
-------------------------------------------------
Column Name      : SectionID
  Type           : VarChar
  Max Length     : 50
  Mandatory      : Yes
  Primary Key    : Yes
  Description    : FK → Section.SectionCode — specific section of the act invoked
-------------------------------------------------
Column Name      : ActOrderID
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : Display/print order of the act within the case
-------------------------------------------------
Column Name      : SectionOrderID
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : Display/print order of the section under the act
-------------------------------------------------

=================================================
TABLE: Victim
=================================================
Column Name      : VictimMasterID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique identifier for each victim
-------------------------------------------------
Column Name      : CaseMasterID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → CaseMaster.CaseMasterID — FIR this victim belongs to
-------------------------------------------------
Column Name      : VictimName
  Type           : VarChar
  Max Length     : 200
  Mandatory      : Yes
  Primary Key    : No
  Description    : Full name of the victim
-------------------------------------------------
Column Name      : AgeYear
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : Age of the victim in years
-------------------------------------------------
Column Name      : GenderID
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : Gender of the victim (lookup value: M/F/T)
-------------------------------------------------
Column Name      : VictimPolice
  Type           : Boolean
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : 0
  Description    : Flag: 1=Victim is a police officer, 0=Not a police officer
-------------------------------------------------

=================================================
TABLE: Accused
=================================================
Column Name      : AccusedMasterID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique identifier for each accused person
-------------------------------------------------
Column Name      : CaseMasterID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → CaseMaster.CaseMasterID — FIR this accused is linked to
-------------------------------------------------
Column Name      : AccusedName
  Type           : VarChar
  Max Length     : 200
  Mandatory      : Yes
  Primary Key    : No
  Description    : Full name of the accused
-------------------------------------------------
Column Name      : AgeYear
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : Age of the accused
-------------------------------------------------
Column Name      : GenderID
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : Gender of the accused (M/F/T)
-------------------------------------------------
Column Name      : PersonID
  Type           : VarChar
  Max Length     : 10
  Mandatory      : No
  Primary Key    : No
  Description    : Accused sorting identifier: A1, A2, A3 etc.
-------------------------------------------------

=================================================
TABLE: ArrestSurrender
=================================================
Column Name      : ArrestSurrenderID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique identifier for each arrest/surrender event
-------------------------------------------------
Column Name      : CaseMasterID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → CaseMaster.CaseMasterID — FIR linked to this arrest/surrender
-------------------------------------------------
Column Name      : ArrestSurrenderTypeID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : Type: arrest or voluntary surrender (lookup value)
-------------------------------------------------
Column Name      : ArrestSurrenderDate
  Type           : DateTime
  Mandatory      : Yes
  Primary Key    : No
  Description    : Date of arrest or surrender
-------------------------------------------------
Column Name      : ArrestSurrenderStateId
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : FK → State.StateID — state where arrest/surrender occurred
-------------------------------------------------
Column Name      : ArrestSurrenderDistrictId
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : FK → District.DistrictID — district where arrest/surrender occurred
-------------------------------------------------
Column Name      : PoliceStationID
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : FK → Unit.UnitID — police station handling the arrest
-------------------------------------------------
Column Name      : IOID
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : FK → Employee.EmployeeID — Investigating Officer who made the arrest
-------------------------------------------------
Column Name      : CourtID
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : FK → Court.CourtID — court before which accused was produced
-------------------------------------------------
Column Name      : AccusedMasterID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → Accused.AccusedMasterID — accused person linked to this event
-------------------------------------------------
Column Name      : IsAccused
  Type           : Boolean
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : 1
  Description    : Flag: 1=primary accused in the case, 0=not primary
-------------------------------------------------
Column Name      : IsComplainantAccused
  Type           : Boolean
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : 0
  Description    : Flag: 1=complainant is also listed as accused
-------------------------------------------------

=================================================
TABLE: inv_arrestsurrenderaccused
=================================================
Column Name      : ArrestSurrenderID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Description    : FK → ArrestSurrender.ArrestSurrenderID — arrest/surrender event
-------------------------------------------------
Column Name      : AccusedMasterID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Description    : FK → Accused.AccusedMasterID — accused linked to this arrest event
-------------------------------------------------

=================================================
TABLE: ChargesheetDetails
=================================================
Column Name      : CSID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique identifier for the chargesheet
-------------------------------------------------
Column Name      : CaseMasterID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → CaseMaster.CaseMasterID — FIR this chargesheet belongs to
-------------------------------------------------
Column Name      : csdate
  Type           : DateTime
  Mandatory      : Yes
  Primary Key    : No
  Description    : Date and time the chargesheet was filed
-------------------------------------------------
Column Name      : cstype
  Type           : VarChar
  Max Length     : 1
  Mandatory      : Yes
  Primary Key    : No
  Description    : Final report type: A=Chargesheet, B=False Case, C=Undetected
-------------------------------------------------
Column Name      : PolicePersonID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → Employee.EmployeeID — officer who filed the chargesheet
-------------------------------------------------
Column Name      : CreatedAt
  Type           : DateTime
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : CURRENT_TIMESTAMP
  Description    : Record creation timestamp
-------------------------------------------------

=================================================
TABLE: CrimePrediction
=================================================
Column Name      : PredictionID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique identifier for each prediction record
-------------------------------------------------
Column Name      : CaseMasterID
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : FK → CaseMaster.CaseMasterID — optional link to a specific triggering case
-------------------------------------------------
Column Name      : DistrictID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → District.DistrictID — district this prediction applies to
-------------------------------------------------
Column Name      : UnitID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → Unit.UnitID — police station/unit this prediction targets
-------------------------------------------------
Column Name      : CrimeHeadID
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : FK → CrimeHead.CrimeHeadID — crime type being predicted (NULL = all types)
-------------------------------------------------
Column Name      : PredictionDate
  Type           : DateTime
  Mandatory      : Yes
  Primary Key    : No
  Description    : Date for which the prediction is generated
-------------------------------------------------
Column Name      : PredictionType
  Type           : VarChar
  Mandatory      : Yes
  Primary Key    : No
  Description    : Category of prediction algorithm used
-------------------------------------------------
Column Name      : RiskLevel
  Type           : VarChar
  Mandatory      : Yes
  Primary Key    : No
  Description    : Assessed risk level: LOW / MEDIUM / HIGH / CRITICAL
-------------------------------------------------
Column Name      : ConfidenceScore
  Type           : Double
  Mandatory      : No
  Primary Key    : No
  Description    : Model confidence score: 0.00 to 100.00 percent
-------------------------------------------------
Column Name      : PredictionWindow
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : Number of days into the future this prediction covers
-------------------------------------------------
Column Name      : ModelVersion
  Type           : VarChar
  Max Length     : 50
  Mandatory      : No
  Primary Key    : No
  Description    : Version identifier of the ML model that generated this prediction
-------------------------------------------------
Column Name      : ModelParameters
  Type           : Text
  Mandatory      : No
  Primary Key    : No
  Description    : JSON blob of model hyperparameters and input features used
-------------------------------------------------
Column Name      : PredictionStatus
  Type           : VarChar
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : PENDING
  Description    : Lifecycle status of the prediction
-------------------------------------------------
Column Name      : ValidationNotes
  Type           : Text
  Mandatory      : No
  Primary Key    : No
  Description    : Officer notes when validating or rejecting a prediction
-------------------------------------------------
Column Name      : ValidatedBy
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : FK → Employee.EmployeeID — officer who validated/rejected this prediction
-------------------------------------------------
Column Name      : ValidatedAt
  Type           : DateTime
  Mandatory      : No
  Primary Key    : No
  Description    : Timestamp when the prediction was validated or rejected
-------------------------------------------------
Column Name      : CreatedAt
  Type           : DateTime
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : CURRENT_TIMESTAMP
  Description    : Record creation timestamp
-------------------------------------------------
Column Name      : UpdatedAt
  Type           : DateTime
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : CURRENT_TIMESTAMP
  Description    : Record last updated timestamp
-------------------------------------------------

=================================================
TABLE: CrimeHotspot
=================================================
Column Name      : HotspotID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique identifier for each hotspot
-------------------------------------------------
Column Name      : DistrictID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → District.DistrictID — district the hotspot is located in
-------------------------------------------------
Column Name      : UnitID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → Unit.UnitID — police station jurisdiction of the hotspot
-------------------------------------------------
Column Name      : CrimeHeadID
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : FK → CrimeHead.CrimeHeadID — dominant crime type in this hotspot (NULL = mixed)
-------------------------------------------------
Column Name      : HotspotName
  Type           : VarChar
  Max Length     : 200
  Mandatory      : Yes
  Primary Key    : No
  Description    : Human-readable name or description for the hotspot
-------------------------------------------------
Column Name      : CenterLatitude
  Type           : Double
  Mandatory      : Yes
  Primary Key    : No
  Description    : GPS latitude of the hotspot centre point
-------------------------------------------------
Column Name      : CenterLongitude
  Type           : Double
  Mandatory      : Yes
  Primary Key    : No
  Description    : GPS longitude of the hotspot centre point
-------------------------------------------------
Column Name      : RadiusMeters
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : 500
  Description    : Radius of the hotspot zone in metres (default 500m)
-------------------------------------------------
Column Name      : BoundaryGeoJSON
  Type           : Text
  Mandatory      : No
  Primary Key    : No
  Description    : GeoJSON polygon defining the precise hotspot boundary
-------------------------------------------------
Column Name      : CrimeCount
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : 0
  Description    : Total number of crimes recorded in this hotspot zone
-------------------------------------------------
Column Name      : RiskLevel
  Type           : VarChar
  Mandatory      : Yes
  Primary Key    : No
  Description    : Risk level classification of this hotspot
-------------------------------------------------
Column Name      : HotspotStatus
  Type           : VarChar
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : ACTIVE
  Description    : Current operational status of the hotspot
-------------------------------------------------
Column Name      : AnalysisPeriodFrom
  Type           : DateTime
  Mandatory      : Yes
  Primary Key    : No
  Description    : Start date of the analysis period used to define this hotspot
-------------------------------------------------
Column Name      : AnalysisPeriodTo
  Type           : DateTime
  Mandatory      : Yes
  Primary Key    : No
  Description    : End date of the analysis period used to define this hotspot
-------------------------------------------------
Column Name      : LastUpdated
  Type           : DateTime
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : CURRENT_TIMESTAMP
  Description    : Last update timestamp
-------------------------------------------------
Column Name      : CreatedAt
  Type           : DateTime
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : CURRENT_TIMESTAMP
  Description    : Record creation timestamp
-------------------------------------------------

=================================================
TABLE: CrimeAssociation
=================================================
Column Name      : AssociationID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique identifier for this case association
-------------------------------------------------
Column Name      : SourceCaseMasterID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → CaseMaster.CaseMasterID — the source/originating case in the link
-------------------------------------------------
Column Name      : TargetCaseMasterID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → CaseMaster.CaseMasterID — the target/related case in the link
-------------------------------------------------
Column Name      : AssociationType
  Type           : VarChar
  Mandatory      : Yes
  Primary Key    : No
  Description    : Nature of the association between the two cases
-------------------------------------------------
Column Name      : AssociationStrength
  Type           : Double
  Mandatory      : No
  Primary Key    : No
  Description    : Strength of the association: 0.00 (weak) to 100.00 (definitive)
-------------------------------------------------
Column Name      : AssociationNotes
  Type           : Text
  Mandatory      : No
  Primary Key    : No
  Description    : Analyst notes describing the basis for this association
-------------------------------------------------
Column Name      : DetectedBy
  Type           : VarChar
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : SYSTEM
  Description    : How the association was detected
-------------------------------------------------
Column Name      : CreatedAt
  Type           : DateTime
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : CURRENT_TIMESTAMP
  Description    : Record creation timestamp
-------------------------------------------------

=================================================
TABLE: RepeatOffender
=================================================
Column Name      : RepeatOffenderID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique identifier for the repeat offender record
-------------------------------------------------
Column Name      : AccusedMasterID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → Accused.AccusedMasterID — the accused person being profiled
-------------------------------------------------
Column Name      : TotalCases
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : 0
  Description    : Total number of FIR cases this person has been accused in
-------------------------------------------------
Column Name      : TotalArrests
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : 0
  Description    : Total number of arrests/surrenders recorded for this person
-------------------------------------------------
Column Name      : FirstOffenseDate
  Type           : DateTime
  Mandatory      : No
  Primary Key    : No
  Description    : Date of the earliest known offence
-------------------------------------------------
Column Name      : LastOffenseDate
  Type           : DateTime
  Mandatory      : No
  Primary Key    : No
  Description    : Date of the most recent known offence
-------------------------------------------------
Column Name      : PrimaryMO
  Type           : VarChar
  Max Length     : 500
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : LOW
  Description    : Short summary of this offender
-------------------------------------------------

=================================================
TABLE: MOProfile
=================================================
Column Name      : MOProfileID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique MO profile identifier
-------------------------------------------------
Column Name      : AccusedMasterID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Description    : FK → Accused.AccusedMasterID — accused person this MO belongs to
-------------------------------------------------
Column Name      : CrimeHeadID
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : FK → CrimeHead.CrimeHeadID — crime type this MO relates to
-------------------------------------------------
Column Name      : PreferredTimeOfDay
  Type           : VarChar
  Mandatory      : No
  Primary Key    : No
  Description    : Typical time of day when crimes are committed
-------------------------------------------------
Column Name      : PreferredDayOfWeek
  Type           : VarChar
  Mandatory      : No
  Primary Key    : No
  Description    : Typical days of the week (multi-select)
-------------------------------------------------
Column Name      : TypicalMethod
  Type           : VarChar
  Max Length     : 500
  Mandatory      : No
  Primary Key    : No
  Description    : Description of typical methods used during the crime
-------------------------------------------------
Column Name      : TypicalLocation
  Type           : VarChar
  Mandatory      : No
  Primary Key    : No
  Description    : Type of location where crimes typically occur
-------------------------------------------------
Column Name      : ToolsUsed
  Type           : VarChar
  Max Length     : 300
  Mandatory      : No
  Primary Key    : No
  Description    : Typical tools or weapons used (e.g., knife, vehicle)
-------------------------------------------------
Column Name      : TargetProfile
  Type           : VarChar
  Max Length     : 500
  Mandatory      : No
  Primary Key    : No
  Description    : Description of typical target or victim profile
-------------------------------------------------
Column Name      : GeographicRange
  Type           : Double
  Mandatory      : No
  Primary Key    : No
  Description    : Typical operational radius in kilometres
-------------------------------------------------
Column Name      : AverageIncidentDurationMins
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : Average duration of incidents in minutes
-------------------------------------------------
Column Name      : PatternConfidence
  Type           : Double
  Mandatory      : No
  Primary Key    : No
  Description    : Confidence score for this MO pattern: 0.00 to 100.00
-------------------------------------------------
Column Name      : LinkedCaseCount
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : 0
  Description    : Number of cases where this MO was identified
-------------------------------------------------
Column Name      : CreatedAt
  Type           : DateTime
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : CURRENT_TIMESTAMP
  Description    : Record creation timestamp
-------------------------------------------------
Column Name      : UpdatedAt
  Type           : DateTime
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : CURRENT_TIMESTAMP
  Description    : Record last updated timestamp
-------------------------------------------------

=================================================
TABLE: DashboardCache
=================================================
Column Name      : CacheID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique cache entry identifier
-------------------------------------------------
Column Name      : CacheKey
  Type           : VarChar
  Max Length     : 255
  Mandatory      : Yes
  Primary Key    : No
  Unique         : Yes
  Description    : Unique cache key (e.g., dashboard_district_5_2026-07)
-------------------------------------------------
Column Name      : CacheScope
  Type           : VarChar
  Mandatory      : Yes
  Primary Key    : No
  Description    : Scope level: GLOBAL / DISTRICT / UNIT / USER
-------------------------------------------------
Column Name      : ScopeID
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : Scoping value: DistrictID or UnitID or EmployeeID depending on CacheScope
-------------------------------------------------
Column Name      : CacheData
  Type           : Text
  Mandatory      : Yes
  Primary Key    : No
  Description    : Pre-computed JSON payload of dashboard metrics
-------------------------------------------------
Column Name      : GeneratedAt
  Type           : DateTime
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : CURRENT_TIMESTAMP
  Description    : Timestamp when this cache entry was generated
-------------------------------------------------
Column Name      : ExpiresAt
  Type           : DateTime
  Mandatory      : Yes
  Primary Key    : No
  Description    : Timestamp when this cache entry expires and should be regenerated
-------------------------------------------------
Column Name      : HitCount
  Type           : Int
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : 0
  Description    : Number of times this cache entry has been served
-------------------------------------------------
Column Name      : LastAccessed
  Type           : DateTime
  Mandatory      : No
  Primary Key    : No
  Description    : Timestamp of the last cache hit
-------------------------------------------------
Column Name      : IsValid
  Type           : Boolean
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : 1
  Description    : Flag: 1=cache is valid and fresh, 0=cache is stale/invalidated
-------------------------------------------------

=================================================
TABLE: AuditLog
=================================================
Column Name      : AuditID
  Type           : BigInt
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Description    : Primary key — BIGINT for high-volume audit entries
-------------------------------------------------
Column Name      : TableName
  Type           : VarChar
  Max Length     : 100
  Mandatory      : Yes
  Primary Key    : No
  Description    : Name of the database table that was affected
-------------------------------------------------
Column Name      : RecordID
  Type           : VarChar
  Max Length     : 50
  Mandatory      : Yes
  Primary Key    : Yes
  Description    : Primary key value of the affected record (stored as string)
-------------------------------------------------
Column Name      : OperationType
  Type           : VarChar
  Mandatory      : Yes
  Primary Key    : No
  Description    : Type of operation performed
-------------------------------------------------
Column Name      : OldValue
  Type           : Text
  Mandatory      : No
  Primary Key    : No
  Description    : JSON snapshot of the record before the change (NULL for INSERT)
-------------------------------------------------
Column Name      : NewValue
  Type           : Text
  Mandatory      : No
  Primary Key    : No
  Description    : JSON snapshot of the record after the change (NULL for DELETE)
-------------------------------------------------
Column Name      : ChangedBy
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : FK → Employee.EmployeeID — employee who made the change
-------------------------------------------------
Column Name      : ChangedByKGID
  Type           : VarChar
  Max Length     : 50
  Mandatory      : No
  Primary Key    : No
  Description    : Denormalized KGID for audit integrity (preserved even if Employee changes)
-------------------------------------------------
Column Name      : ChangeTimestamp
  Type           : DateTime
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : CURRENT_TIMESTAMP
  Description    : Precise timestamp of the change
-------------------------------------------------
Column Name      : IPAddress
  Type           : VarChar
  Max Length     : 45
  Mandatory      : No
  Primary Key    : No
  Description    : IP address of the client that made the change (IPv4 or IPv6)
-------------------------------------------------
Column Name      : UserAgent
  Type           : VarChar
  Max Length     : 500
  Mandatory      : No
  Primary Key    : No
  Description    : Browser/client user agent string
-------------------------------------------------
Column Name      : SessionID
  Type           : VarChar
  Max Length     : 255
  Mandatory      : No
  Primary Key    : No
  Description    : Session identifier for correlating related audit events
-------------------------------------------------
Column Name      : ChangeReason
  Type           : VarChar
  Max Length     : 500
  Mandatory      : No
  Primary Key    : No
  Description    : Optional reason provided by the operator for the change
-------------------------------------------------
Column Name      : IsReversible
  Type           : Boolean
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : 1
  Description    : Flag: 1=this change can be reversed, 0=irreversible
-------------------------------------------------
Column Name      : ReversedAt
  Type           : DateTime
  Mandatory      : No
  Primary Key    : No
  Description    : Timestamp when this change was reversed (NULL if not reversed)
-------------------------------------------------
Column Name      : ReversedBy
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : FK → Employee.EmployeeID — officer who reversed this change
-------------------------------------------------

=================================================
TABLE: AIAlert
=================================================
Column Name      : AlertID
  Type           : Int
  Mandatory      : Yes
  Primary Key    : Yes
  Auto Increment : Yes
  Unique         : Yes
  Description    : Primary key — unique identifier for each alert
-------------------------------------------------
Column Name      : AlertType
  Type           : VarChar
  Mandatory      : Yes
  Primary Key    : No
  Description    : Type/category of the alert
-------------------------------------------------
Column Name      : AlertSeverity
  Type           : VarChar
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : INFO
  Description    : Severity level of the alert
-------------------------------------------------
Column Name      : AlertTitle
  Type           : VarChar
  Max Length     : 300
  Mandatory      : Yes
  Primary Key    : No
  Description    : Short descriptive title of the alert
-------------------------------------------------
Column Name      : AlertDescription
  Type           : Text
  Mandatory      : Yes
  Primary Key    : No
  Description    : Full description of the alert with context and recommended action
-------------------------------------------------
Column Name      : RelatedCaseMasterID
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : FK → CaseMaster.CaseMasterID — related case (if applicable)
-------------------------------------------------
Column Name      : RelatedHotspotID
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : FK → CrimeHotspot.HotspotID — related hotspot (if applicable)
-------------------------------------------------
Column Name      : RelatedPredictionID
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : FK → CrimePrediction.PredictionID — related prediction (if applicable)
-------------------------------------------------
Column Name      : RelatedDistrictID
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : FK → District.DistrictID — district this alert pertains to
-------------------------------------------------
Column Name      : RelatedUnitID
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : FK → Unit.UnitID — unit this alert pertains to
-------------------------------------------------
Column Name      : AlertStatus
  Type           : VarChar
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : OPEN
  Description    : Current lifecycle status of the alert
-------------------------------------------------
Column Name      : AssignedTo
  Type           : Int
  Mandatory      : No
  Primary Key    : No
  Description    : FK → Employee.EmployeeID — officer assigned to act on this alert
-------------------------------------------------
Column Name      : AcknowledgedAt
  Type           : DateTime
  Mandatory      : No
  Primary Key    : No
  Description    : Timestamp when the alert was acknowledged
-------------------------------------------------
Column Name      : ResolvedAt
  Type           : DateTime
  Mandatory      : No
  Primary Key    : No
  Description    : Timestamp when the alert was resolved or dismissed
-------------------------------------------------
Column Name      : ResolutionNotes
  Type           : Text
  Mandatory      : No
  Primary Key    : No
  Description    : Notes describing how the alert was resolved
-------------------------------------------------
Column Name      : AutoGenerated
  Type           : Boolean
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : 1
  Description    : Flag: 1=auto-generated by system/AI, 0=manually created
-------------------------------------------------
Column Name      : CreatedAt
  Type           : DateTime
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : CURRENT_TIMESTAMP
  Description    : Record creation timestamp
-------------------------------------------------
Column Name      : UpdatedAt
  Type           : DateTime
  Mandatory      : Yes
  Primary Key    : No
  Default Value  : CURRENT_TIMESTAMP
  Description    : Record last updated timestamp
-------------------------------------------------

