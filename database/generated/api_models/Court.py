from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class Court:
    """
    Representing Table Court from KCIP Database.
    """
    CourtID: int
    CourtName: str
    DistrictID: int
    StateID: int
    Active: bool = True

    def to_dict(self) -> dict:
        return self.__dict__