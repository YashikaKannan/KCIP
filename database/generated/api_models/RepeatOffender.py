from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class RepeatOffender:
    """
    Representing Table RepeatOffender from KCIP Database.
    """
    RepeatOffenderID: int
    AccusedMasterID: int
    TotalCases: int = False
    TotalArrests: int = False
    FirstOffenseDate: Optional[str] = None
    LastOffenseDate: Optional[str] = None
    PrimaryMO: str = "LOW"

    def to_dict(self) -> dict:
        return self.__dict__