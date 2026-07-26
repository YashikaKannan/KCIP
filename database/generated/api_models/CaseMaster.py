from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class CaseMaster:
    """
    Representing Table CaseMaster from KCIP Database.
    """
    CaseMasterID: int
    CrimeNo: str
    CaseNo: str
    CrimeRegisteredDate: str
    PolicePersonID: int
    PoliceStationID: int
    CaseCategoryID: int
    GravityOffenceID: int
    CrimeMajorHeadID: int
    CrimeMinorHeadID: int
    CaseStatusID: int
    CourtID: Optional[int] = None
    IncidentFromDate: Optional[str] = None
    IncidentToDate: Optional[str] = None
    InfoReceivedPSDate: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    BriefFacts: Optional[str] = None
    CreatedAt: str = "CURRENT_TIMESTAMP"
    UpdatedAt: str = "CURRENT_TIMESTAMP"

    def to_dict(self) -> dict:
        return self.__dict__