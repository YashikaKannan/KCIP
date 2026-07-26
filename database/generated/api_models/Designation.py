from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class Designation:
    """
    Representing Table Designation from KCIP Database.
    """
    DesignationID: int
    DesignationName: str
    Active: bool = True
    SortOrder: Optional[int] = None

    def to_dict(self) -> dict:
        return self.__dict__