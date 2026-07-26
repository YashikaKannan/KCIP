from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class Accused:
    """
    Representing Table Accused from KCIP Database.
    """
    AccusedMasterID: int
    CaseMasterID: int
    AccusedName: str
    AgeYear: Optional[int] = None
    GenderID: Optional[int] = None
    PersonID: Optional[str] = None

    def to_dict(self) -> dict:
        return self.__dict__