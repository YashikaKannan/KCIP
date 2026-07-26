from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class GravityOffence:
    """
    Representing Table GravityOffence from KCIP Database.
    """
    GravityOffenceID: int
    LookupValue: str

    def to_dict(self) -> dict:
        return self.__dict__