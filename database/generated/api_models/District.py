from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class District:
    """
    Representing Table District from KCIP Database.
    """
    DistrictID: int
    DistrictName: str
    StateID: int
    Active: bool = True

    def to_dict(self) -> dict:
        return self.__dict__