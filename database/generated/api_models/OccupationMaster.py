from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class OccupationMaster:
    """
    Representing Table OccupationMaster from KCIP Database.
    """
    OccupationID: int
    OccupationName: str

    def to_dict(self) -> dict:
        return self.__dict__