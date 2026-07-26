from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class ArrestSurrender:
    """
    Representing Table ArrestSurrender from KCIP Database.
    """
    ArrestSurrenderID: int
    CaseMasterID: int
    ArrestSurrenderTypeID: int
    ArrestSurrenderDate: str
    ArrestSurrenderStateId: Optional[int] = None
    ArrestSurrenderDistrictId: Optional[int] = None
    PoliceStationID: Optional[int] = None
    IOID: Optional[int] = None
    CourtID: Optional[int] = None
    AccusedMasterID: int
    IsAccused: bool = True
    IsComplainantAccused: bool = False

    def to_dict(self) -> dict:
        return self.__dict__