from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class Victim:
    """
    Representing Table Victim from KCIP Database.
    """
    VictimMasterID: int
    CaseMasterID: int
    VictimName: str
    AgeYear: Optional[int] = None
    GenderID: Optional[int] = None
    VictimPolice: bool = False

    def to_dict(self) -> dict:
        return self.__dict__