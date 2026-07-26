from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class CrimeHotspot:
    """
    Representing Table CrimeHotspot from KCIP Database.
    """
    HotspotID: int
    DistrictID: int
    UnitID: int
    CrimeHeadID: Optional[int] = None
    HotspotName: str
    CenterLatitude: float
    CenterLongitude: float
    RadiusMeters: int = "500"
    BoundaryGeoJSON: Optional[str] = None
    CrimeCount: int = False
    RiskLevel: str
    HotspotStatus: str = "ACTIVE"
    AnalysisPeriodFrom: str
    AnalysisPeriodTo: str
    LastUpdated: str = "CURRENT_TIMESTAMP"
    CreatedAt: str = "CURRENT_TIMESTAMP"

    def to_dict(self) -> dict:
        return self.__dict__