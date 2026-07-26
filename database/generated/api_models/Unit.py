from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class Unit:
    """
    Representing Table Unit from KCIP Database.
    """
    UnitID: int
    UnitName: str
    TypeID: int
    ParentUnit: Optional[int] = None
    NationalityID: Optional[int] = None
    StateID: int
    DistrictID: int
    Active: bool = True

    def to_dict(self) -> dict:
        return self.__dict__