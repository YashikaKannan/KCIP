from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class UnitType:
    """
    Representing Table UnitType from KCIP Database.
    """
    UnitTypeID: int
    UnitTypeName: str
    CityDistState: Optional[str] = None
    Hierarchy: Optional[int] = None
    Active: bool = True

    def to_dict(self) -> dict:
        return self.__dict__