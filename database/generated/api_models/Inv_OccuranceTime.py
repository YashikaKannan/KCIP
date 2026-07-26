from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class Inv_OccuranceTime:
    """
    Representing Table Inv_OccuranceTime from KCIP Database.
    """
    OccuranceTimeID: int
    CaseMasterID: int
    OccuranceFromDate: Optional[str] = None
    OccuranceToDate: Optional[str] = None
    LocationDescription: Optional[str] = None
    Latitude: Optional[float] = None
    Longitude: Optional[float] = None
    CreatedAt: str = "CURRENT_TIMESTAMP"

    def to_dict(self) -> dict:
        return self.__dict__