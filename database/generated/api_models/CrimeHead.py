from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class CrimeHead:
    """
    Representing Table CrimeHead from KCIP Database.
    """
    CrimeHeadID: int
    CrimeGroupName: str
    Active: bool = True

    def to_dict(self) -> dict:
        return self.__dict__