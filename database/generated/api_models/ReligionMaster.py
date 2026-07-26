from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class ReligionMaster:
    """
    Representing Table ReligionMaster from KCIP Database.
    """
    ReligionID: int
    ReligionName: str

    def to_dict(self) -> dict:
        return self.__dict__